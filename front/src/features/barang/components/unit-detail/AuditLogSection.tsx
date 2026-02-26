import { IconHistory, IconUser } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { actionVariant } from "../item-badge-helpers";
import type { AuditLogData } from "@/features/audit/types/audit.types";

interface AuditLogSectionProps {
  auditLogs: AuditLogData[];
  logsError: boolean;
}

export function AuditLogSection({
  auditLogs,
  logsError,
}: AuditLogSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <IconHistory className="h-4 w-4 text-muted-foreground" />
        <p className="text-sm font-semibold">
          Histori Lokasi{" "}
          <span className="text-muted-foreground font-normal">
            ({auditLogs.length})
          </span>
        </p>
      </div>

      {logsError ? (
        <p className="text-sm text-muted-foreground py-4 text-center">
          Histori tidak tersedia (akses terbatas).
        </p>
      ) : auditLogs.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">
          Belum ada histori tercatat.
        </p>
      ) : (
        <div className="max-h-[48vh] overflow-y-auto space-y-3 pr-2">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="rounded-md bg-accent/50 border border-accent px-4 py-3 text-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium leading-snug">
                    {log.description ??
                      `${log.action} – ${log.entity_type} #${log.entity_id}`}
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-muted-foreground text-xs">
                    <IconUser className="h-3 w-3 shrink-0" />
                    <span>
                      {log.actor?.name ?? "—"} · {log.actor?.role ?? "—"}
                    </span>
                    <span className="mx-1">·</span>
                    <span>
                      {new Date(log.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
                <Badge
                  variant={actionVariant[log.action] ?? "outline"}
                  className="shrink-0"
                >
                  {log.action}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
