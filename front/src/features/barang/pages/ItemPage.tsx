import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IconArrowLeft } from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";
import { useItemDetail } from "../hooks/useItemDetail";
import { getImageUrl } from "@/config/api";
import { useAuthUser, Role } from "@/hooks/useAuthUser";
import { AddToCartSection } from "../components/image-gallery/AddToCartSection";
import { UnitDataTable } from "../components/item-detail/UnitDataTable";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ItemPage() {
  const { id } = useParams<{ id: string }>();
  const numericId = id ? parseInt(id) : null;
  const navigate = useNavigate();

  const { data: authUser } = useAuthUser();
  const isPic = authUser?.role === Role.pic;

  const { data: item } = useItemDetail(numericId);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const photos = item?.photos ?? [];
  const activePhoto = selectedPhoto ?? photos[0]?.file_path ?? null;
  const imageUrl = activePhoto ? getImageUrl(activePhoto) : null;
  const units = item?.units ?? [];
  const availableUnits = units.filter((u) => u.status === "available").length;
  const goodUnits = units.filter((u) => u.condition === "good").length;

  const createdAt = item?.created_at
    ? new Date(item.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <section className="space-y-10 w-full max-w-5xl md:mx-auto">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 mb-5 text-muted-foreground"
        onClick={() => navigate("/dashboard/barang")}
      >
        <IconArrowLeft className="h-4 w-4 mr-1" />
        Kembali
      </Button>
      <div className="flex flex-col md:grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* ── Left: Photo Gallery ── */}
        <div className="space-y-2">
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
          <div className="grid grid-cols-3 gap-2 items-end">
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
        <div className="space-y-4 w-auto h-auto flex flex-col justify-between">
          {/* Header */}
          <div className="flex flex-col space-y-4">
            <p className="text-sm uppercase tracking-widest text-muted-foreground">
              {item?.category ?? "—"}
            </p>
            <h1 className="text-3xl leading-tight">{item?.name ?? "—"}</h1>
            <p className="text-md tracking-wide text-muted-foreground mt-0.5">
              {item?.model_code ?? "—"}
            </p>
          </div>

          <div className="h-auto">
            {/* Stats */}
            <Separator />
            <div className="flex gap-6 my-5">
              <div>
                <span className="text-2xl">{units.length}</span>
                <span className="text-sm text-muted-foreground ml-1.5">
                  Total unit
                </span>
              </div>
              <div>
                <span className="text-2xl ">{availableUnits}</span>
                <span className="text-sm text-muted-foreground ml-1.5">
                  Tersedia
                </span>
              </div>
              <div>
                <span className="text-2xl">{goodUnits}</span>
                <span className="text-sm text-muted-foreground ml-1.5">
                  Kondisi bagus
                </span>
              </div>
            </div>

            <Separator />

            {/* Detail rows */}
            <div>
              <div className="flex justify-between py-3 text-sm">
                <span className="text-muted-foreground">Kategori</span>
                <span className="font-medium">{item?.category ?? "—"}</span>
              </div>
              <Separator />
              <div className="flex justify-between py-3 text-sm">
                <span className="text-muted-foreground">Tahun pengadaan</span>
                <span className="font-medium">
                  {item?.procurement_year ?? "—"}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between py-3 text-sm">
                <span className="text-muted-foreground">Kode model</span>
                <span className="font-medium font-mono">
                  {item?.model_code ?? "—"}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between py-3 text-sm">
                <span className="text-muted-foreground">Ditambahkan</span>
                <span className="font-medium">{createdAt}</span>
              </div>
            </div>

            <Separator />

            {/* Bagasi / Add to cart */}
            {isPic && item && availableUnits > 0 && (
              <div className="space-y-3 mt-3">
                <p className="text-sm font-semibold">Bagasi</p>
                <AddToCartSection
                  itemId={item.id}
                  itemName={item.name}
                  firstPhotoPath={photos[0]?.file_path ?? null}
                  availableUnits={availableUnits}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom: Unit list data-table ── */}
      <div className="bg-accent rounded-lg p-4">
        <UnitDataTable units={units} itemId={item?.id} />
      </div>
    </section>
  );
}
