import { useState, useRef } from "react";
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
import { useUnitLocationHistory } from "../hooks/useUnitLocationHistory";
import { getImageUrl } from "@/config/api";
import { useAuthUser, Role } from "@/hooks/useAuthUser";
import { UnitCartButton } from "../components/unit-detail/UnitCartButton";
import {
  conditionLabel,
  conditionVariant,
  statusLabel,
  statusVariant,
} from "../components/item-badge-helpers";
import { cn } from "@/lib/utils";
import EditUnitDialog from "../components/EditUnitDialog";
import { IconDownload } from "@tabler/icons-react";

export default function ItemUnitPage() {
  const { itemId, unitId } = useParams<{ itemId: string; unitId: string }>();
  const numericItemId = itemId ? parseInt(itemId) : null;
  const numericUnitId = unitId ? parseInt(unitId) : null;

  const navigate = useNavigate();
  const { data: authUser } = useAuthUser();
  const isPic = authUser?.role === Role.pic;
  const isAdmin = authUser?.role === Role.admin;

  const { data: item } = useItemDetail(numericItemId);
  const { data: locationHistory = [], isError: logsError } =
    useUnitLocationHistory(numericUnitId);

  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const photos = item?.photos ?? [];
  const activePhoto = selectedPhoto ?? photos[0]?.file_path ?? null;
  const imageUrl = activePhoto ? getImageUrl(activePhoto) : null;

  const unit = item?.units.find((u) => u.id === numericUnitId) ?? null;

  const qrValue =
    numericItemId != null && numericUnitId != null
      ? `${window.location.origin}/dashboard/barang/${numericItemId}/${numericUnitId}`
      : "";

  const qrRef = useRef<SVGSVGElement>(null);

  const handleDownloadQR = () => {
    const svg = qrRef.current;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      ctx?.drawImage(img, 0, 0, 200, 200);
      const a = document.createElement("a");
      a.download = `${unit?.unit_code ?? "qr"}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  return (
    <section className="space-y-10 w-full max-w-5xl md:mx-auto">
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 text-muted-foreground mb-5"
        onClick={() => navigate(`/dashboard/barang/${numericItemId}`)}
      >
        <IconArrowLeft className="h-4 w-4 mr-1" />
        Kembali
      </Button>

      <div className="flex flex-col md:grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* ── Left: Photo Gallery ── */}
        <div className="space-y-4">
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
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm uppercase tracking-widest text-muted-foreground">
                {item?.category ?? "—"}
              </p>
              {isAdmin && unit && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground -mr-2"
                    onClick={() => setEditOpen(true)}
                  >
                    Edit
                  </Button>
                  <EditUnitDialog
                    open={editOpen}
                    onOpenChange={setEditOpen}
                    unit={unit}
                    itemId={numericItemId!}
                  />
                </>
              )}
            </div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl leading-tight">{item?.name ?? "—"}</h1>
              {qrValue && (
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className="relative rounded-sm border p-2 bg-white flex items-center justify-center cursor-pointer group"
                    onClick={handleDownloadQR}
                  >
                    <QRCodeSVG ref={qrRef} value={qrValue} size={80} />
                    <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-[2px] rounded-sm flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <IconDownload className="h-4 w-4 text-gray-700 dark:text-gray-200" />
                      <span className="text-[10px] font-medium text-gray-700 dark:text-gray-200">
                        Unduh
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-mono mt-1 text-center">
                    {unit?.unit_code ?? ""}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1">
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

      {/* ── Bottom: Location history table ── */}
      <div className="bg-accent dark:bg-accent/40 rounded-lg p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <IconHistory className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-semibold">
              Histori Lokasi{" "}
              <span className="text-muted-foreground font-normal">
                ({locationHistory.length})
              </span>
            </p>
          </div>

          {logsError ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              Histori tidak tersedia (akses terbatas).
            </p>
          ) : locationHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              Belum ada histori tercatat.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">#</TableHead>
                  <TableHead>Dari</TableHead>
                  <TableHead>Ke</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Oleh</TableHead>
                  <TableHead>Waktu</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locationHistory.map((log, index) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {log.from_location.building_name}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        Lt. {log.from_location.floor}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {log.to_location.building_name}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        Lt. {log.to_location.floor}
                      </span>
                    </TableCell>
                    <TableCell>
                      {log.request ? (
                        <Badge variant="outline" className="capitalize">
                          {log.request.request_type}
                        </Badge>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <IconUser className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        {log.moved_by.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(log.moved_at).toLocaleDateString("id-ID", {
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
