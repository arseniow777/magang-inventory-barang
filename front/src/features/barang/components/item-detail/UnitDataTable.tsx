import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconSearch,
  IconSelector,
  IconSortAscending,
  IconSortDescending,
  IconLayoutColumns,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TabsLine } from "@/components/tabs";
import { ButtonGroup } from "@/components/ui/button-group";
import type { ItemUnitsWithLocation } from "../../types/barang.types";
import {
  conditionLabel,
  conditionVariant,
  statusLabel,
  statusVariant,
} from "../item-badge-helpers";

interface UnitDataTableProps {
  units: ItemUnitsWithLocation[];
  itemId?: number;
}

const STATUS_TABS = [
  { value: "all", label: "Semua" },
  { value: "available", label: "Tersedia" },
  { value: "borrowed", label: "Dipinjam" },
  { value: "transferred", label: "Dipindah" },
  { value: "sold", label: "Dijual" },
  { value: "demolished", label: "Dimusnahkan" },
];

export function UnitDataTable({ units, itemId }: UnitDataTableProps) {
  const navigate = useNavigate();
  const [activeStatus, setActiveStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const filteredData = useMemo(() => {
    let result = units;
    if (activeStatus !== "all") {
      result = result.filter((u) => u.status === activeStatus);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (u) =>
          u.unit_code.toLowerCase().includes(q) ||
          u.location.building_name.toLowerCase().includes(q) ||
          u.location.address.toLowerCase().includes(q),
      );
    }
    return result;
  }, [units, activeStatus, search]);

  const columns: ColumnDef<ItemUnitsWithLocation>[] = useMemo(
    () => [
      {
        id: "no",
        size: 48,
        header: () => <div className="w-8 text-center text-xs">#</div>,
        cell: ({ row, table }) => {
          const { pageIndex, pageSize } = table.getState().pagination;
          const rows = table.getRowModel().rows;
          const idx = rows.findIndex((r) => r.id === row.id);
          return (
            <div className="w-8 text-center text-muted-foreground text-sm">
              {pageIndex * pageSize + idx + 1}
            </div>
          );
        },
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "unit_code",
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 hover:text-foreground transition-colors"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Kode Unit
            {column.getIsSorted() === "asc" ? (
              <IconSortAscending className="h-3.5 w-3.5" />
            ) : column.getIsSorted() === "desc" ? (
              <IconSortDescending className="h-3.5 w-3.5" />
            ) : (
              <IconSelector className="h-3.5 w-3.5 opacity-40" />
            )}
          </button>
        ),
        cell: ({ row }) => (
          <span className="font-mono font-medium">
            {row.original.unit_code}
          </span>
        ),
        enableHiding: false,
      },
      {
        accessorKey: "condition",
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 hover:text-foreground transition-colors"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Kondisi
            {column.getIsSorted() === "asc" ? (
              <IconSortAscending className="h-3.5 w-3.5" />
            ) : column.getIsSorted() === "desc" ? (
              <IconSortDescending className="h-3.5 w-3.5" />
            ) : (
              <IconSelector className="h-3.5 w-3.5 opacity-40" />
            )}
          </button>
        ),
        cell: ({ row }) => (
          <Badge variant={conditionVariant[row.original.condition]}>
            {conditionLabel[row.original.condition]}
          </Badge>
        ),
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 hover:text-foreground transition-colors"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            {column.getIsSorted() === "asc" ? (
              <IconSortAscending className="h-3.5 w-3.5" />
            ) : column.getIsSorted() === "desc" ? (
              <IconSortDescending className="h-3.5 w-3.5" />
            ) : (
              <IconSelector className="h-3.5 w-3.5 opacity-40" />
            )}
          </button>
        ),
        cell: ({ row }) => (
          <Badge variant={statusVariant[row.original.status]}>
            {statusLabel[row.original.status]}
          </Badge>
        ),
      },
      {
        id: "building",
        accessorFn: (row) => row.location.building_name,
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 hover:text-foreground transition-colors"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Gedung
            {column.getIsSorted() === "asc" ? (
              <IconSortAscending className="h-3.5 w-3.5" />
            ) : column.getIsSorted() === "desc" ? (
              <IconSortDescending className="h-3.5 w-3.5" />
            ) : (
              <IconSelector className="h-3.5 w-3.5 opacity-40" />
            )}
          </button>
        ),
        cell: ({ row }) => row.original.location.building_name,
      },
      {
        id: "floor",
        accessorFn: (row) => row.location.floor,
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 hover:text-foreground transition-colors"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Lantai
            {column.getIsSorted() === "asc" ? (
              <IconSortAscending className="h-3.5 w-3.5" />
            ) : column.getIsSorted() === "desc" ? (
              <IconSortDescending className="h-3.5 w-3.5" />
            ) : (
              <IconSelector className="h-3.5 w-3.5 opacity-40" />
            )}
          </button>
        ),
        cell: ({ row }) => `Lt. ${row.original.location.floor}`,
      },
    ],
    [],
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, columnVisibility, pagination },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm font-semibold">
          Daftar Unit{" "}
          <span className="text-muted-foreground font-normal">
            ({filteredData.length})
          </span>
        </p>
      </div>

      <div className="flex w-full flex-col gap-4 lg:flex-row lg:justify-between">
        {/* SEARCH - mobile full row */}
        <div className="w-full lg:w-auto lg:order-0 order-1">
          <ButtonGroup className="w-full">
            <Input
              placeholder="Cari kode / gedung..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPagination((p) => ({ ...p, pageIndex: 0 }));
              }}
              className="w-full"
            />
            <Button variant="outline" aria-label="Search">
              <IconSearch className="h-4 w-4" />
            </Button>
          </ButtonGroup>
        </div>

        {/* FILTER + COLUMN */}
        <div className="flex w-full items-center justify-between lg:w-auto lg:order-0 order-2 gap-2">
          <TabsLine
            tabs={STATUS_TABS}
            activeTab={activeStatus}
            onTabChange={(v) => {
              setActiveStatus(v);
              setPagination((p) => ({ ...p, pageIndex: 0 }));
            }}
          />

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" size="sm">
                <IconLayoutColumns className="h-4 w-4" />
                <span className="hidden lg:inline ml-1">Kolom</span>
                <IconChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-40">
              {table
                .getAllColumns()
                .filter((col) => col.getCanHide())
                .map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    checked={col.getIsVisible()}
                    onCheckedChange={(v) => col.toggleVisibility(!!v)}
                    className="capitalize"
                  >
                    {col.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      {table.getRowModel().rows.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          Tidak ada unit ditemukan.
        </p>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted">
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((header) => (
                    <TableHead key={header.id}>
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
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer"
                  onClick={() =>
                    navigate(`/dashboard/barang/${itemId}/${row.original.id}`)
                  }
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
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between px-1">
          <div className="text-muted-foreground text-sm hidden lg:block">
            Total: {filteredData.length} unit
          </div>
          <div className="flex items-center gap-6 ml-auto">
            <div className="hidden items-center gap-2 lg:flex">
              <Label className="text-sm font-medium">Baris</Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(v) => table.setPageSize(Number(v))}
              >
                <SelectTrigger size="sm" className="w-16">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 50].map((s) => (
                    <SelectItem key={s} value={`${s}`}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm font-medium">
              {table.getState().pagination.pageIndex + 1} /{" "}
              {table.getPageCount()}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="hidden h-8 w-8 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <IconChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <IconChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <IconChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="hidden h-8 w-8 lg:flex"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <IconChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
