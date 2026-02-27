// import { Button } from "@/components/ui/button";
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
import { useNotifications } from "../hooks/useNotifications";
import type { NotificationItem } from "../types/notification.types";
// import { useNavigate } from "react-router-dom";

const dotColorMap: Record<string, string> = {
  request: "bg-red-500",
  report: "bg-orange-500",
  password: "bg-yellow-500",
  system: "bg-green-500",
};

// function NotificationRow({ item }: { item: NotificationItem }) {
//   // const navigate = useNavigate();

//   const createdDate = new Date(item.created_at);
//   const timeAgo = Math.floor((Date.now() - createdDate.getTime()) / 1000);
//   let displayTime = "baru saja";
//   if (timeAgo > 60) displayTime = `${Math.floor(timeAgo / 60)} menit lalu`;
//   if (timeAgo > 3600) displayTime = `${Math.floor(timeAgo / 3600)} jam lalu`;
//   if (timeAgo > 86400) displayTime = `${Math.floor(timeAgo / 86400)} hari lalu`;

//   return (
//     <TableRow>
//       <TableCell className="w-32 truncate text-muted-foreground pl-0">
//         {item.message}
//       </TableCell>
//       <TableCell className="lg:pl-44">
//         <Badge variant="outline" className="gap-1.5">
//           <span
//             className={`size-2 rounded-full ${dotColorMap[item.type] ?? "bg-gray-500"}`}
//           />
//           {item.type}
//         </Badge>
//       </TableCell>
//       <TableCell className="text-right text-muted-foreground">
//         {displayTime}
//       </TableCell>
//     </TableRow>
//   );
// }
function NotificationRow({ item }: { item: NotificationItem }) {
  const createdDate = new Date(item.created_at);
  const timeAgo = Math.floor((Date.now() - createdDate.getTime()) / 1000);
  let displayTime = "baru saja";
  if (timeAgo > 60) displayTime = `${Math.floor(timeAgo / 60)} menit lalu`;
  if (timeAgo > 3600) displayTime = `${Math.floor(timeAgo / 3600)} jam lalu`;
  if (timeAgo > 86400) displayTime = `${Math.floor(timeAgo / 86400)} hari lalu`;

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
          Error:{" "}
          {error instanceof Error ? error.message : "Gagal memuat notifikasi"}
        </p>
      </div>
    );
  }

  return (
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
        {Array.isArray(data) && data.length > 0 ? (
          data.map((n) => <NotificationRow key={n.id} item={n} />)
        ) : (
          <TableRow>
            <TableCell
              colSpan={3}
              className="text-center text-muted-foreground py-8"
            >
              Tidak ada notifikasi
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
