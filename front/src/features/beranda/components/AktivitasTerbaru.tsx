"use client";

import { useAuditData } from "@/features/audit/hooks/useAuditData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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
  });

export default function AktivitasTerbaru() {
  const { data, isLoading } = useAuditData({ limit: 5 });
  const logs = data?.logs ?? [];

  return (
    <div className="bg-muted/50 rounded-xl p-4 h-full flex flex-col overflow-hidden">
      <div className="mb-4 flex items-center justify-between shrink-0">
        <h2 className="text-base font-semibold">Aktivitas Terbaru</h2>
      </div>
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          Memuat data...
        </div>
      ) : (
        <div className="flex-1 overflow-auto min-h-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10 text-muted-foreground">
                  No.
                </TableHead>
                <TableHead className="text-muted-foreground">Profil</TableHead>
                <TableHead className="text-muted-foreground">Nama</TableHead>
                <TableHead className="text-muted-foreground">Aksi</TableHead>
                <TableHead className="text-muted-foreground">
                  User-agent
                </TableHead>
                <TableHead className="text-muted-foreground">Tanggal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-muted-foreground">
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-sm text-muted-foreground"
                  >
                    Tidak ada aktivitas
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log, index) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-muted-foreground">
                      {index + 1}.
                    </TableCell>
                    <TableCell className="text-sm capitalize">
                      {log.actor.role}
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {log.actor.name}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={actionBadgeClass[log.action] ?? ""}
                      >
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[180px] truncate">
                      {log.user_agent ?? "-"}
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap">
                      {formatDate(log.created_at)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
