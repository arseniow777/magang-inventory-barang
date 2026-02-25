import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import type { RequestData } from "../types/permintaan.types";
import { usePermintaanAction } from "../hooks/usePermintaanAction";
import { ReqDetailDialog } from "./req-detail-dialog";
import { IconUser, IconArrowNarrowRight } from "@tabler/icons-react";
// ── helpers ────────────────────────────────────────────────────────
const REQUEST_TYPE_LABEL: Record<string, string> = {
  borrow: "Peminjaman",
  transfer: "Transfer",
  sell: "Penjualan",
  demolish: "Penghapusan",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Menunggu",
  approved: "Disetujui",
  rejected: "Ditolak",
  completed: "Selesai",
};

function statusClass(status: string) {
  switch (status) {
    case "approved":
      return "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 border-green-200";
    case "rejected":
      return "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200";
    case "completed":
      return "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200";
    default:
      return "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300 border-yellow-200";
  }
}

// ── component ─────────────────────────────────────────────────────
interface ReqCardProps {
  data: RequestData;
}

export default function ReqCard({ data }: ReqCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { approve, reject } = usePermintaanAction();

  const hasLocation =
    data.request_type === "borrow" || data.request_type === "transfer";
  const isPending = data.status === "pending";

  const timeAgo = formatDistanceToNow(new Date(data.created_at), {
    addSuffix: true,
    locale: localeId,
  });

  return (
    <>
      <Card size="sm" className="mx-auto w-full bg-accent/20">
        <CardHeader className="py-0">
          <CardTitle className="font-mono text-xl">
            <div className="flex justify-between items-center gap-2">
              <p className="truncate tracking-wider">{data.request_code}</p>
              <Badge
                variant="outline"
                className={`shrink-0 text-xs ${statusClass(data.status)}`}
              >
                {STATUS_LABEL[data.status] ?? data.status}
              </Badge>
            </div>
          </CardTitle>
          <CardDescription>
            <div className="flex justify-between">
              <div className="flex items-center gap-1">
                <IconUser size={15} />
                <p>{data.pic.name}</p>
              </div>
              <p>{timeAgo}</p>
            </div>
          </CardDescription>
        </CardHeader>

        <Separator />

        {/* ── Lokasi tujuan (hanya borrow / transfer) ── */}
        {hasLocation && (
          <>
            <CardContent>
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  {REQUEST_TYPE_LABEL[data.request_type]}
                </p>
                <div className="flex justify-between text-sm">
                  <p className="text-muted-foreground text-xs">Tujuan</p>
                  <p className="font-medium text-xs text-right">
                    {data.destination_location
                      ? `${data.destination_location.building_name} — Lt. ${data.destination_location.floor}`
                      : "—"}
                  </p>
                </div>
              </div>
            </CardContent>
            <Separator />
          </>
        )}

        {/* ── Label jenis (sell / demolish — tanpa lokasi) ── */}
        {!hasLocation && (
          <>
            <CardContent>
              <p className="text-xs text-muted-foreground">Jenis Permintaan</p>
              <p className="text-sm font-medium">
                {REQUEST_TYPE_LABEL[data.request_type]}
              </p>
            </CardContent>
            <Separator />
          </>
        )}

        {/* ── Jumlah item ── */}
        <CardContent>
          <div className="flex justify-between text-sm">
            <p className="text-muted-foreground text-xs">Total unit</p>
            <p className="font-medium text-xs">{data._count.request_items}</p>
          </div>
        </CardContent>

        <Separator />

        {/* ── Alasan ── */}
        <CardContent>
          <p className="text-xs text-muted-foreground mb-1">Alasan</p>
          <p className="text-sm line-clamp-2">{data.reason}</p>
        </CardContent>

        <Separator />

        <CardFooter>
          <div className="flex justify-between items-center w-full gap-2">
            {isPending ? (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => approve.mutate(data.id)}
                  disabled={approve.isPending || reject.isPending}
                >
                  Terima
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => reject.mutate(data.id)}
                  disabled={approve.isPending || reject.isPending}
                >
                  Tolak
                </Button>
              </div>
            ) : (
              <div />
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDialogOpen(true)}
            >
              Lihat
              <IconArrowNarrowRight />
            </Button>
          </div>
        </CardFooter>
      </Card>

      <ReqDetailDialog
        requestId={data.id}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}
