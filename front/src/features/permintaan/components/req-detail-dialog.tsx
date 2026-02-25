import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useRequestDetail } from "../hooks/useRequestDetail";

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

function conditionClass(condition: string) {
  switch (condition) {
    case "good":
      return "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300";
    case "damaged":
      return "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300";
    case "broken":
      return "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300";
    default:
      return "bg-muted text-muted-foreground";
  }
}

const CONDITION_LABEL: Record<string, string> = {
  good: "Baik",
  damaged: "Rusak Ringan",
  broken: "Rusak Berat",
};

// ── component ─────────────────────────────────────────────────────
interface ReqDetailDialogProps {
  requestId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReqDetailDialog({
  requestId,
  open,
  onOpenChange,
}: ReqDetailDialogProps) {
  const { data: request, isLoading } = useRequestDetail(
    open ? requestId : null,
  );

  const hasLocation =
    request?.request_type === "borrow" || request?.request_type === "transfer";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-mono text-lg">
            {isLoading ? (
              <Skeleton className="h-6 w-40" />
            ) : (
              (request?.request_code ?? "Detail Permintaan")
            )}
          </DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}

        {!isLoading && request && (
          <div className="space-y-4">
            {/* Status & Type */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className={statusClass(request.status)}>
                {STATUS_LABEL[request.status] ?? request.status}
              </Badge>
              <Badge variant="outline">
                {REQUEST_TYPE_LABEL[request.request_type] ??
                  request.request_type}
              </Badge>
            </div>

            <Separator />

            {/* Meta Info */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <div>
                <p className="text-muted-foreground text-xs mb-0.5">PIC</p>
                <p className="font-medium">{request.pic.name}</p>
                <p className="text-muted-foreground text-xs">
                  @{request.pic.username}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-0.5">
                  Tanggal Permintaan
                </p>
                <p className="font-medium">
                  {format(new Date(request.created_at), "dd MMMM yyyy", {
                    locale: localeId,
                  })}
                </p>
                <p className="text-muted-foreground text-xs">
                  {format(new Date(request.created_at), "HH:mm")}
                </p>
              </div>
              {request.admin && (
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">
                    {request.status === "approved"
                      ? "Disetujui oleh"
                      : "Ditolak oleh"}
                  </p>
                  <p className="font-medium">{request.admin.name}</p>
                  {request.approved_at && (
                    <p className="text-muted-foreground text-xs">
                      {format(
                        new Date(request.approved_at),
                        "dd MMM yyyy HH:mm",
                        {
                          locale: localeId,
                        },
                      )}
                    </p>
                  )}
                </div>
              )}
            </div>

            <Separator />

            {/* Alasan */}
            <div>
              <p className="text-xs text-muted-foreground mb-1">Alasan</p>
              <p className="text-sm">{request.reason}</p>
            </div>

            {/* Lokasi (only borrow/transfer) */}
            {hasLocation && request.destination_location && (
              <>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Lokasi Tujuan
                  </p>
                  <p className="text-sm font-medium">
                    {request.destination_location.building_name} — Lt.{" "}
                    {request.destination_location.floor}
                  </p>
                </div>
              </>
            )}

            <Separator />

            {/* Items */}
            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Daftar Unit ({request.request_items.length} unit)
              </p>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {request.request_items.map((ri, idx) => (
                  <div
                    key={ri.id}
                    className="flex items-start justify-between rounded-md border px-3 py-2 text-sm"
                  >
                    <div className="flex gap-3 items-start">
                      <span className="text-muted-foreground text-xs w-5 shrink-0 pt-0.5">
                        {idx + 1}.
                      </span>
                      <div>
                        <p className="font-medium">{ri.unit.item.name}</p>
                        <p className="text-muted-foreground text-xs font-mono">
                          {ri.unit.unit_code}
                        </p>
                        {ri.unit.location && (
                          <p className="text-muted-foreground text-xs">
                            {ri.unit.location.building_name} — Lt.{" "}
                            {ri.unit.location.floor}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={conditionClass(ri.unit.condition)}
                    >
                      {CONDITION_LABEL[ri.unit.condition] ?? ri.unit.condition}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
