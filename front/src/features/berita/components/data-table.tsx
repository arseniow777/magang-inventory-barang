"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import {
  IconCheck,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDownload,
  IconLayoutColumns,
  IconSearch,
} from "@tabler/icons-react";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TabsLine } from "@/components/tabs";

export const schema = z.object({
  id: z.number(),
  report_number: z.string(),
  report_type: z.string(),
  issued_date: z.string(),
  file_path: z.string(),
  is_approved: z.boolean(),
  approved_by_id: z.number().nullable(),
  approved_at: z.string().nullable(),
  request_id: z.number(),
  issued_by_id: z.number(),
  request: z
    .object({
      request_code: z.string(),
      request_type: z.string(),
      pic: z.object({ name: z.string() }),
      destination_location: z.object({ building_name: z.string() }),
    })
    .optional(),
  issued_by: z.object({ name: z.string() }).optional(),
  approved_by: z.object({ name: z.string() }).nullable().optional(),
});

const reportTypeLabels: Record<string, string> = {
  borrow: "Peminjaman",
  transfer: "Transfer",
  sell: "Penjualan",
  demolish: "Pemusnahan",
};

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const handleDownload = (reportId: number, reportNumber: string) => {
  const token = localStorage.getItem("token");
  fetch(`${API_URL}/reports/${reportId}/download`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.blob())
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${reportNumber}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    });
};

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "no",
    size: 48,
    header: () => (
      <div className="w-10 text-center text-xs font-medium">No.</div>
    ),
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination;
      const rows = table.getRowModel().rows;
      const visualIndex = rows.findIndex((r) => r.id === row.id);
      return (
        <div className="w-10 text-center text-muted-foreground text-sm">
          {pageIndex * pageSize + visualIndex + 1}
        </div>
      );
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "report_number",
    header: "No. Berita Acara",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.report_number}</div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "report_type",
    header: "Tipe",
    cell: ({ row }) => (
      <Badge variant="outline">
        {reportTypeLabels[row.original.report_type] || row.original.report_type}
      </Badge>
    ),
  },
  {
    id: "request_code",
    header: "No. Permintaan",
    cell: ({ row }) => <div>{row.original.request?.request_code || "-"}</div>,
  },
  {
    id: "pic",
    header: "PIC",
    cell: ({ row }) => <div>{row.original.request?.pic?.name || "-"}</div>,
  },
  {
    id: "lokasi",
    header: "Lokasi",
    cell: ({ row }) => (
      <div>
        {row.original.request?.destination_location?.building_name || "-"}
      </div>
    ),
  },
  {
    accessorKey: "issued_date",
    header: "Tanggal",
    cell: ({ row }) => <div>{formatDate(row.original.issued_date)}</div>,
  },
  {
    accessorKey: "is_approved",
    header: "Status",
    cell: ({ row }) =>
      row.original.is_approved ? (
        <Badge className="bg-green-500 hover:bg-green-600">
          <IconCheck className="h-3 w-3 mr-1" />
          Disetujui
        </Badge>
      ) : (
        <Badge variant="secondary">Menunggu Persetujuan</Badge>
      ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Aksi</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            handleDownload(row.original.id, row.original.report_number)
          }
        >
          <IconDownload className="h-4 w-4 mr-1" />
          Download
        </Button>
      </div>
    ),
  },
];

export function DataTable({
  data: initialData,
}: {
  data: z.infer<typeof schema>[];
}) {
  const [activeType, setActiveType] = useState("all");
  const [search, setSearch] = useState("");
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const filteredData = useMemo(() => {
    let result = initialData;

    if (activeType !== "all") {
      result = result.filter((r) => r.report_type === activeType);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (r) =>
          r.report_number.toLowerCase().includes(q) ||
          r.request?.request_code?.toLowerCase().includes(q) ||
          r.request?.pic?.name?.toLowerCase().includes(q) ||
          r.request?.destination_location?.building_name
            ?.toLowerCase()
            .includes(q),
      );
    }

    return result;
  }, [initialData, activeType, search]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <TabsLine
          tabs={[
            { value: "all", label: "Semua" },
            { value: "borrow", label: "Peminjaman" },
            { value: "transfer", label: "Transfer" },
            { value: "sell", label: "Penjualan" },
            { value: "demolish", label: "Pemusnahan" },
          ]}
          activeTab={activeType}
          onTabChange={setActiveType}
        />
        <div className="flex items-center gap-2">
          <ButtonGroup>
            <Input
              placeholder="Cari nomor / permintaan / PIC..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-72"
            />
            <Button variant="outline" aria-label="Search">
              <IconSearch />
            </Button>
          </ButtonGroup>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Kolom</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide(),
                )
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="relative flex flex-col gap-4 overflow-auto">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Tidak ada data.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            Total: {filteredData.length} berita acara
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
