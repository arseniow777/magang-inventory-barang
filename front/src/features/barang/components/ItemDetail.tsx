import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { useItemDetail } from "../hooks/useItemDetail";
import { getImageUrl } from "@/config/api";
import ItemPageShell from "./ItemPageShell";
import ItemImageGallery from "./ItemImageGallery";
import EditItemDialog from "./EditItemDialog";
import { useAuthUser, Role } from "@/hooks/useAuthUser";
import { ItemInfoPanel } from "./item-detail/ItemInfoPanel";
import { UnitListSection } from "./item-detail/UnitListSection";

// ── component ────────────────────────────────────────────────────────────────

interface ItemDetailProps {
  id: number | null;
}

export default function ItemDetail({ id }: ItemDetailProps) {
  const { data: authUser } = useAuthUser();
  const isAdmin = authUser?.role === Role.admin;
  const navigate = useNavigate();

  const { data: item, isLoading, isError } = useItemDetail(id);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const photos = item?.photos ?? [];
  const activePhoto = selectedPhoto ?? photos[0]?.file_path ?? null;
  const imageUrl = activePhoto ? getImageUrl(activePhoto) : null;
  const units = item?.units ?? [];
  const availableUnits = units.filter((u) => u.status === "available").length;
  const goodUnits = units.filter((u) => u.condition === "good").length;

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
          modelCode={item?.model_code}
          selectedPhoto={selectedPhoto}
          onSelectPhoto={setSelectedPhoto}
          itemId={item?.id}
          availableUnits={availableUnits}
          totalUnits={units.length}
          goodUnits={goodUnits}
        />
      }
      right={
        <>
          <Separator />
          <ItemInfoPanel
            item={item}
            isAdmin={isAdmin}
            onEditClick={() => setEditOpen(true)}
          />
          <Separator />
          <UnitListSection units={units} itemId={item?.id} />
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
