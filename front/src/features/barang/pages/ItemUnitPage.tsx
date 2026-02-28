import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { IconArrowLeft, IconHistory, IconUser } from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useItemDetail } from "../hooks/useItemDetail";
import { useUnitAuditLogs } from "../hooks/useUnitAuditLogs";
import { getImageUrl } from "@/config/api";
import { useAuthUser, Role } from "@/hooks/useAuthUser";
import { UnitCartButton } from "../components/unit-detail/UnitCartButton";
import {
  conditionLabel,
  conditionVariant,
  statusLabel,
  statusVariant,
  actionVariant,
} from "../components/item-badge-helpers";
import { cn } from "@/lib/utils";

export default function ItemUnitPage() {
  const { itemId, unitId } = useParams<{ itemId: string; unitId: string }>();
  const numericItemId = itemId ? parseInt(itemId) : null;
  const numericUnitId = unitId ? parseInt(unitId) : null;

  const navigate = useNavigate();
  const { data: authUser } = useAuthUser();
  const isPic = authUser?.role === Role.pic;

  const { data: item } = useItemDetail(numericItemId);
  const { data: auditLogs = [], isError: logsError } =
    useUnitAuditLogs(numericUnitId);

  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const photos = item?.photos ?? [];
  const activePhoto = selectedPhoto ?? photos[0]?.file_path ?? null;
  const imageUrl = activePhoto ? getImageUrl(activePhoto) : null;

  const unit = item?.units.find((u) => u.id === numericUnitId) ?? null;

  const qrValue =
    numericItemId != null && numericUnitId != null
      ? `${window.location.origin}/dashboard/barang/${numericItemId}/${numericUnitId}`
      : "";

  return (
    <section className="space-y-10 w-full max-w-5xl md:mx-auto">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 text-muted-foreground mb-5 "
        onClick={() => navigate(`/dashboard/barang/${numericItemId}`)}
      >
        <IconArrowLeft className="h-4 w-4 mr-1" />
        Kembali
      </Button>

      <div className="flex flex-col md:grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* ── Left: Photo Gallery ── */}
        <div className="space-y-4">
          {/* Main photo */}
          <div className="rounded-sm overflow-hidden bg-muted aspect-square">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={item?.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                No photo
              </div>
            )}
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-3 gap-4 items-end">
            {photos.slice(0, 3).map((photo) => {
              const isActive =
                (selectedPhoto ?? photos[0]?.file_path) === photo.file_path;
              return (
                <button
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo.file_path)}
                  className={cn(
                    "rounded-lg overflow-hidden aspect-video bg-muted border-2 transition-colors",
                    isActive
                      ? "border-primary"
                      : "border-transparent hover:border-muted-foreground/30",
                  )}
                >
                  <img
                    src={getImageUrl(photo.file_path)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Right: Info Panel ── */}
        <div className="space-y-4 w-auto md:h-full flex flex-col justify-between">
          {/* Header */}
          <div className="flex flex-col space-y-4">
            <p className="text-sm uppercase tracking-widest text-muted-foreground">
              {item?.category ?? "—"}
            </p>
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl leading-tight">{item?.name ?? "—"}</h1>
              {qrValue && (
                <div className="flex flex-col items-center shrink-0">
                  <div className="rounded-sm border p-2 bg-white flex items-center justify-center">
                    <QRCodeSVG value={qrValue} size={80} />
                  </div>
                  <p className="text-[10px] text-muted-foreground font-mono mt-1 text-center">
                    {unit?.unit_code ?? ""}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1">
            {/* Badges */}
            <Separator />
            <div className="flex justify-between items-center py-3 text-sm">
              <span className="text-muted-foreground">Kondisi</span>
              {unit ? (
                <Badge variant={conditionVariant[unit.condition]}>
                  {conditionLabel[unit.condition]}
                </Badge>
              ) : (
                "—"
              )}
            </div>
            <Separator />
            <div className="flex justify-between items-center py-3 text-sm">
              <span className="text-muted-foreground">Status</span>
              {unit ? (
                <Badge variant={statusVariant[unit.status]}>
                  {statusLabel[unit.status]}
                </Badge>
              ) : (
                "—"
              )}
            </div>

            <Separator />

            {/* Detail rows */}
            <div>
              <div className="flex justify-between py-3 text-sm">
                <span className="text-muted-foreground">Kode Unit</span>
                <span className="font-medium font-mono">
                  {unit?.unit_code ?? "—"}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between py-3 text-sm">
                <span className="text-muted-foreground">Gedung</span>
                <span className="font-medium">
                  {unit?.location.building_name ?? "—"}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between py-3 text-sm">
                <span className="text-muted-foreground">Lantai</span>
                <span className="font-medium">
                  {unit?.location.floor != null
                    ? `Lt. ${unit.location.floor}`
                    : "—"}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between py-3 text-sm">
                <span className="text-muted-foreground">Alamat</span>
                <span className="font-medium text-right max-w-[60%]">
                  {unit?.location.address ?? "—"}
                </span>
              </div>
            </div>

            {/* Add to cart — PIC only */}
            {isPic && unit?.status === "available" && (
              <div className="mt-3">
                <UnitCartButton
                  unit={unit}
                  unitId={numericUnitId}
                  item={item}
                  firstPhotoPath={photos[0]?.file_path ?? null}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom: Audit log table ── */}
      <div className="bg-accent rounded-lg p-4">
        <div className="space-y-3">
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
            <p className="text-sm text-muted-foreground py-6 text-center">
              Histori tidak tersedia (akses terbatas).
            </p>
          ) : auditLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              Belum ada histori tercatat.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">#</TableHead>
                  <TableHead>Aksi</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Oleh</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Waktu</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log, index) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <Badge variant={actionVariant[log.action] ?? "outline"}>
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-sm">
                      {log.description ??
                        `${log.action} – ${log.entity_type} #${log.entity_id}`}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <IconUser className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        {log.actor?.name ?? "—"}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground capitalize">
                      {log.actor?.role ?? "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(log.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </section>
  );
}
