"use client";
import * as React from "react";
import { useState } from "react";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
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
import { Input } from "@/components/ui/input";
import { ButtonGroup } from "@/components/ui/button-group";
import { TabsLine } from "@/components/tabs";

export const schema = z.object({
  id: z.number(),
  action: z.string(),
  entity_type: z.string(),
  entity_id: z.number(),
  description: z.string().nullable(),
  actor_role: z.string(),
  user_agent: z.string().nullable(),
  created_at: z.string(),
  actor: z.object({
    id: z.number(),
    name: z.string(),
    username: z.string(),
    role: z.string(),
  }),
});

const actionBadgeClass: Record<string, string> = {
  CREATE: "bg-green-100 text-green-700 hover:bg-green-100",
  UPDATE: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  DELETE: "bg-red-100 text-red-700 hover:bg-red-100",
  APPROVE: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  REJECT: "bg-orange-100 text-orange-700 hover:bg-orange-100",
  LOGIN: "bg-gray-100 text-gray-700 hover:bg-gray-100",
  LOGOUT: "bg-gray-100 text-gray-700 hover:bg-gray-100",
  ARCHIVE: "bg-purple-100 text-purple-700 hover:bg-purple-100",
  RESET_PASSWORD_REQUEST: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
};

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "no",
    size: 48,
    header: () => (
      <div className="w-10 text-center text-xs font-medium">No.</div>
    ),
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination;
      return (
        <div className="w-10 text-center text-muted-foreground text-sm">
          {pageIndex * pageSize + row.index + 1}
        </div>
      );
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "action",
    header: "Aksi",
    cell: ({ row }) => (
      <Badge
        className={actionBadgeClass[row.original.action] ?? ""}
        variant="secondary"
      >
        {row.original.action}
      </Badge>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "entity_type",
    header: "Entitas",
    cell: ({ row }) => (
      <div>
        <span className="font-medium">{row.original.entity_type}</span>
        <span className="text-muted-foreground ml-1">
          #{row.original.entity_id}
        </span>
      </div>
    ),
  },
  {
    id: "actor",
    header: "Dilakukan Oleh",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.actor.name}</div>
        <div className="text-muted-foreground text-xs">
          @{row.original.actor.username}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Keterangan",
    cell: ({ row }) => (
      <div className="max-w-xs truncate text-sm">
        {row.original.description || "-"}
      </div>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Waktu",
    cell: ({ row }) => (
      <div className="text-sm whitespace-nowrap">
        {formatDate(row.original.created_at)}
      </div>
    ),
  },
];

export function DataTable({
  data: initialData,
}: {
  data: z.infer<typeof schema>[];
}) {
  const [search, setSearch] = useState("");
  const [activeAction, setActiveAction] = useState("all");
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

  const filteredData = React.useMemo(() => {
    let result = initialData;

    if (activeAction !== "all") {
      result = result.filter((l) => l.action === activeAction);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (l) =>
          l.action.toLowerCase().includes(q) ||
          l.entity_type.toLowerCase().includes(q) ||
          (l.description ?? "").toLowerCase().includes(q) ||
          l.actor.name.toLowerCase().includes(q) ||
          l.actor.username.toLowerCase().includes(q),
      );
    }

    return result;
  }, [initialData, search, activeAction]);

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
            { value: "CREATE", label: "Create" },
            { value: "UPDATE", label: "Update" },
            { value: "DELETE", label: "Delete" },
            { value: "REJECT", label: "Reject" },
          ]}
          activeTab={activeAction}
          onTabChange={setActiveAction}
        />
        <div className="flex items-center gap-2">
          <ButtonGroup>
            <Input
              placeholder="Cari aksi / entitas / keterangan..."
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
            Total: {filteredData.length} log
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
