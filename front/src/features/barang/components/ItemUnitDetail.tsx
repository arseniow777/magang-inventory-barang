import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { useItemDetail } from "../hooks/useItemDetail";
import { useUnitAuditLogs } from "../hooks/useUnitAuditLogs";
import { useAuthUser, Role } from "@/hooks/useAuthUser";
import { getImageUrl } from "@/config/api";
import ItemPageShell from "./ItemPageShell";
import ItemImageGallery from "./ItemImageGallery";
import { UnitInfoPanel } from "./unit-detail/UnitInfoPanel";
import { AuditLogSection } from "./unit-detail/AuditLogSection";
import { UnitCartButton } from "./unit-detail/UnitCartButton";

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

  const { data: authUser } = useAuthUser();
  const isAdmin = authUser?.role === Role.admin;

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
          <Separator />
          <p className="text-sm font-semibold">Informasi Unit</p>
          <UnitInfoPanel item={item} unit={unit} qrValue={qrValue} />
          <Separator />
          <AuditLogSection auditLogs={auditLogs} logsError={logsError} />
          {!isAdmin && unit?.status === "available" && (
            <UnitCartButton
              unit={unit}
              unitId={unitId}
              item={item}
              firstPhotoPath={photos[0]?.file_path ?? null}
            />
          )}
        </>
      }
    />
  );
}
