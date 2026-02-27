import * as React from "react";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react";
import { useNotifications } from "../hooks/useNotifications";
import type { NotificationItem } from "../types/notification.types";
import { EmptyState } from "@/components/empty-state";

const dotColorMap: Record<string, string> = {
  request: "bg-red-500",
  report: "bg-orange-500",
  password: "bg-yellow-500",
  system: "bg-green-500",
};

function NotificationRow({ item }: { item: NotificationItem }) {
  const createdDate = new Date(item.created_at);
  const timeAgo = Math.floor((Date.now() - createdDate.getTime()) / 1000);
  let displayTime = "baru saja";
  if (timeAgo > 86400) displayTime = `${Math.floor(timeAgo / 86400)} hari lalu`;
  else if (timeAgo > 3600)
    displayTime = `${Math.floor(timeAgo / 3600)} jam lalu`;
  else if (timeAgo > 60) displayTime = `${Math.floor(timeAgo / 60)} menit lalu`;

  return (
    <TableRow>
      <TableCell className="pl-0 break-words whitespace-normal max-w-0 w-full text-muted-foreground">
        {item.message}
      </TableCell>
      <TableCell className="whitespace-nowrap pl-4 text-center">
        <Badge variant="outline" className="gap-1.5">
          <span
            className={`size-2 rounded-full ${dotColorMap[item.type] ?? "bg-gray-500"}`}
          />
          {item.type}
        </Badge>
      </TableCell>
      <TableCell className="text-right text-muted-foreground whitespace-nowrap pl-4">
        {displayTime}
      </TableCell>
    </TableRow>
  );
}

export function NotificationsList() {
  const { data = [], isLoading, error } = useNotifications();

  //testing UI Empty state
  const debugEmpty = false; // ubah ke false setelah selesai
  const notifications = debugEmpty ? [] : Array.isArray(data) ? data : [];

  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);

  // const notifications = Array.isArray(data) ? data : [];
  const pageCount = Math.ceil(notifications.length / pageSize);
  const paginated = notifications.slice(
    pageIndex * pageSize,
    pageIndex * pageSize + pageSize,
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-6">
        <p className="text-red-600">
          {error instanceof Error ? error.message : "Gagal memuat notifikasi"}
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-4">
      {paginated.length === 0 ? (
        <EmptyState
          title="Tidak ada notifikasi"
          description="Anda belum memiliki notifikasi apapun"
        />
      ) : (
        <>
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-0">Pesan</TableHead>
                <TableHead className="lg:w-60 pl-4 whitespace-nowrap text-center">
                  Jenis
                </TableHead>
                <TableHead className="lg:w-60 text-right whitespace-nowrap">
                  Waktu
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((n) => (
                <NotificationRow key={n.id} item={n} />
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-2">
            <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
              Total: {notifications.length} notifikasi
            </div>
            <div className="flex w-full items-center gap-8 lg:w-fit">
              <div className="hidden items-center gap-2 lg:flex">
                <Label htmlFor="rows-per-page" className="text-sm font-medium">
                  Rows per page
                </Label>
                <Select
                  value={`${pageSize}`}
                  onValueChange={(value) => {
                    setPageSize(Number(value));
                    setPageIndex(0);
                  }}
                >
                  <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                    <SelectValue placeholder={pageSize} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[10, 20, 30, 40, 50].map((size) => (
                      <SelectItem key={size} value={`${size}`}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex w-fit items-center justify-center text-sm font-medium">
                Page {pageIndex + 1} of {pageCount || 1}
              </div>
              <div className="ml-auto flex items-center gap-2 lg:ml-0">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => setPageIndex(0)}
                  disabled={pageIndex === 0}
                >
                  <span className="sr-only">Go to first page</span>
                  <IconChevronsLeft />
                </Button>
                <Button
                  variant="outline"
                  className="size-8"
                  size="icon"
                  onClick={() => setPageIndex((p) => p - 1)}
                  disabled={pageIndex === 0}
                >
                  <span className="sr-only">Go to previous page</span>
                  <IconChevronLeft />
                </Button>
                <Button
                  variant="outline"
                  className="size-8"
                  size="icon"
                  onClick={() => setPageIndex((p) => p + 1)}
                  disabled={pageIndex >= pageCount - 1}
                >
                  <span className="sr-only">Go to next page</span>
                  <IconChevronRight />
                </Button>
                <Button
                  variant="outline"
                  className="hidden size-8 lg:flex"
                  size="icon"
                  onClick={() => setPageIndex(pageCount - 1)}
                  disabled={pageIndex >= pageCount - 1}
                >
                  <span className="sr-only">Go to last page</span>
                  <IconChevronsRight />
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
