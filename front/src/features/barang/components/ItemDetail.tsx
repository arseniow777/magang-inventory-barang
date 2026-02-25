import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconPencil } from "@tabler/icons-react";
import { useItemDetail } from "../hooks/useItemDetail";
import { getImageUrl } from "@/config/api";
import ItemPageShell from "./ItemPageShell";
import ItemImageGallery from "./ItemImageGallery";
import DetailGrid from "./DetailGrid";
import EditItemDialog from "./EditItemDialog";
import {
  conditionLabel,
  conditionVariant,
  statusLabel,
  statusVariant,
} from "./item-badge-helpers";

// ── component ────────────────────────────────────────────────────────────────

interface ItemDetailProps {
  id: number | null;
}

export default function ItemDetail({ id }: ItemDetailProps) {
  const navigate = useNavigate();

  const { data: item, isLoading, isError } = useItemDetail(id);

  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const photos = item?.photos ?? [];
  const activePhoto = selectedPhoto ?? photos[0]?.file_path ?? null;
  const imageUrl = activePhoto ? getImageUrl(activePhoto) : null;

  const units = item?.units ?? [];
  const totalUnits = units.length;
  const availableUnits = units.filter((u) => u.status === "available").length;
  const goodUnits = units.filter((u) => u.condition === "good").length;

  const infoRows = [
    { label: "Kategori", value: item?.category ?? "—" },
    { label: "Tahun Pengadaan", value: item?.procurement_year ?? "—" },
    {
      label: "Kode Model",
      value: <span className="font-mono">{item?.model_code ?? "—"}</span>,
    },
    {
      label: "Ditambahkan",
      value: item?.created_at
        ? new Date(item.created_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "—",
    },
  ];

  return (
    <ItemPageShell
      onBack={() => navigate("/dashboard/barang")}
      name={item?.name}
      subtitle={item?.model_code}
      isLoading={isLoading}
      isError={isError}
      errorMessage="Gagal memuat data item. Silakan coba lagi."
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
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Informasi
              </p>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setEditOpen(true)}
                disabled={!item}
              >
                <IconPencil className="h-3.5 w-3.5" />
              </Button>
            </div>
            <DetailGrid rows={infoRows} />
          </div>

          <Separator />

          {/* Stats cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg border p-4">
              <p className="text-xs text-muted-foreground mb-1">Total Unit</p>
              <p className="text-2xl font-bold">{totalUnits}</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-xs text-muted-foreground mb-1">Tersedia</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {availableUnits}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-xs text-muted-foreground mb-1">Kondisi Baik</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {goodUnits}
              </p>
            </div>
          </div>

          <Separator />

          {/* Units list */}
          <div className="space-y-4">
            <p className="text-sm font-semibold">
              Daftar Unit{" "}
              <span className="text-muted-foreground font-normal">
                ({totalUnits})
              </span>
            </p>

            {units.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Belum ada unit terdaftar.
              </p>
            ) : (
              <div className="max-h-[45vh] overflow-y-auto space-y-3 pr-2">
                {units.map((unit) => (
                  <button
                    key={unit.id}
                    onClick={() =>
                      navigate(`/dashboard/barang/${item?.id}/units/${unit.id}`)
                    }
                    className="w-full text-left flex items-center justify-between rounded-md bg-accent/50 border border-accent px-4 py-3 text-sm hover:bg-accent transition-colors cursor-pointer"
                  >
                    <div>
                      <p className="font-mono font-medium text-sm">
                        {unit.unit_code}
                      </p>
                      <p className="text-muted-foreground text-sm mt-0.5">
                        {unit.location.building_name} · Lt.{" "}
                        {unit.location.floor}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={conditionVariant[unit.condition]}>
                        {conditionLabel[unit.condition]}
                      </Badge>
                      <Badge variant={statusVariant[unit.status]}>
                        {statusLabel[unit.status]}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {item && (
            <EditItemDialog
              open={editOpen}
              onOpenChange={setEditOpen}
              item={item}
            />
          )}
        </>
      }
    />
  );
}
