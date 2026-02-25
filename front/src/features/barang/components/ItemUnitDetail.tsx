import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { IconHistory, IconUser } from "@tabler/icons-react";
import { useItemDetail } from "../hooks/useItemDetail";
import { useUnitAuditLogs } from "../hooks/useUnitAuditLogs";
import { getImageUrl } from "@/config/api";
import ItemPageShell from "./ItemPageShell";
import ItemImageGallery from "./ItemImageGallery";
import DetailGrid from "./DetailGrid";
import {
  conditionLabel,
  conditionVariant,
  statusLabel,
  statusVariant,
  actionVariant,
} from "./item-badge-helpers";

// ── component ────────────────────────────────────────────────────────────────

interface ItemUnitDetailProps {
  itemId: number | null;
  unitId: number | null;
}

export default function ItemUnitDetail({
  itemId,
  unitId,
}: ItemUnitDetailProps) {
  const navigate = useNavigate();

  const {
    data: item,
    isLoading: itemLoading,
    isError: itemError,
  } = useItemDetail(itemId);
  const { data: auditLogs = [], isError: logsError } = useUnitAuditLogs(unitId);

  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const photos = item?.photos ?? [];
  const activePhoto = selectedPhoto ?? photos[0]?.file_path ?? null;
  const imageUrl = activePhoto ? getImageUrl(activePhoto) : null;

  const unit = item?.units.find((u) => u.id === unitId) ?? null;

  const qrValue =
    itemId != null && unitId != null
      ? `${window.location.origin}/dashboard/barang/${itemId}/units/${unitId}`
      : "";

  const infoRows = [
    { label: "Nama Barang", value: item?.name ?? "—" },
    {
      label: "Kode Unit",
      value: <span className="font-mono">{unit?.unit_code ?? "—"}</span>,
    },
    {
      label: "Kondisi",
      value: unit ? (
        <Badge variant={conditionVariant[unit.condition]}>
          {conditionLabel[unit.condition]}
        </Badge>
      ) : (
        "—"
      ),
    },
    {
      label: "Status",
      value: unit ? (
        <Badge variant={statusVariant[unit.status]}>
          {statusLabel[unit.status]}
        </Badge>
      ) : (
        "—"
      ),
    },
    { label: "Gedung", value: unit?.location.building_name ?? "—" },
    {
      label: "Lantai",
      value: unit?.location.floor != null ? `Lt. ${unit.location.floor}` : "—",
    },
    { label: "Alamat", value: unit?.location.address ?? "—" },
  ];

  return (
    <ItemPageShell
      onBack={() => navigate(`/dashboard/barang/${itemId}`)}
      name={item?.name}
      subtitle={unit?.unit_code}
      isLoading={itemLoading}
      isError={itemError}
      errorMessage="Gagal memuat data unit. Silakan coba lagi."
      left={
        <ItemImageGallery
          photos={photos}
          imageUrl={imageUrl}
          itemName={item?.name}
          selectedPhoto={selectedPhoto}
          onSelectPhoto={setSelectedPhoto}
        />
      }
      right={
        <>
          {/* Info + QR side by side */}
          <div className="flex gap-6 items-start">
            <div className="flex-1">
              <DetailGrid rows={infoRows} />
            </div>
            {qrValue && (
              <div className="shrink-0 w-28 flex flex-col items-center gap-1.5">
                <div className="w-full aspect-square rounded-lg border p-2 bg-white flex items-center justify-center">
                  <QRCodeSVG
                    value={qrValue}
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground font-mono text-center">
                  {unit?.unit_code ?? ""}
                </p>
              </div>
            )}
          </div>

          <Separator />

          {/* Histori lokasi */}
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
                            {new Date(log.created_at).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
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
        </>
      }
    />
  );
}
