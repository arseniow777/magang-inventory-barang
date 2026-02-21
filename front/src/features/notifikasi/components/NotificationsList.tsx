import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHeader,
  TableHead,
} from "@/components/ui/table";
import { useNotifications, useDeleteNotification } from "../hooks/useNotifications";
import type { NotificationItem } from "../types/notification.types";
// import { IconTrash } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

function NotificationRow({ item }: { item: NotificationItem }) {
  const { mutate: deleteNotif } = useDeleteNotification();
  const navigate = useNavigate();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotif(item.id);
  };

  const handleRowClick = () => {
    if (item.link) {
      navigate(item.link);
    }
  };

  const createdDate = new Date(item.created_at);
  const timeAgo = Math.floor((Date.now() - createdDate.getTime()) / 1000);
  let displayTime = "baru saja";
  if (timeAgo > 60) displayTime = `${Math.floor(timeAgo / 60)}m lalu`;
  if (timeAgo > 3600) displayTime = `${Math.floor(timeAgo / 3600)}h lalu`;
  if (timeAgo > 86400) displayTime = `${Math.floor(timeAgo / 86400)}d lalu`;

  const username = item.user?.username || `User #${item.user_id}`;
  
  const typeDisplay = item.type.toUpperCase();
  
  return (
    <TableRow
      onClick={handleRowClick}
      className={`${item.link ? "cursor-pointer hover:bg-muted/50" : ""}`}
    >
      {/* <TableCell className="text-red-600">{username.toUpperCase()}</TableCell> */}
      <TableCell className="w-32 truncate text-sm text-muted-foreground pl-0">{item.message}</TableCell>
      <TableCell className="text-xs font-bold lg:pl-44">{typeDisplay}</TableCell>
      <TableCell className="text-xs text-right text-muted-foreground">{displayTime}</TableCell>
      {/* <TableCell className="w-12" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
        >
          <IconTrash className="h-4 w-4" />
        </Button>
      </TableCell> */}
    </TableRow>
  );
}

export function NotificationsList() {
  const { data = [], isLoading, error } = useNotifications();

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
          Error: {error instanceof Error ? error.message : "Gagal memuat notifikasi"}
        </p>
      </div>
    );
  }

  return (
   
        <Table>
          <TableHeader>
          <TableRow>
            <TableHead className="pl-0">Pesan</TableHead>
            <TableHead className="lg:pl-44">Tipe</TableHead>
            <TableHead className="text-right">Waktu</TableHead>
          </TableRow>
        </TableHeader>
          <TableBody>
            {Array.isArray(data) && data.length > 0 ? (
              data.map((n) => <NotificationRow key={n.id} item={n} />)
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Tidak ada notifikasi
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
     
  );
}
