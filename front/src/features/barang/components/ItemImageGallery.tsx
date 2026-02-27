import { useAuthUser, Role } from "@/hooks/useAuthUser";
import type { ItemPhotos } from "../types/barang.types";
import { MainImage } from "./image-gallery/MainImage";
import { ItemTitleStats } from "./image-gallery/ItemTitleStats";
import { AddToCartSection } from "./image-gallery/AddToCartSection";

interface ItemImageGalleryProps {
  photos: ItemPhotos[];
  imageUrl: string | null;
  itemName?: string;
  modelCode?: string;
  selectedPhoto: string | null;
  onSelectPhoto: (path: string) => void;
  /** Pass to enable the cart button (PIC only). Omit on unit detail page. */
  itemId?: number;
  availableUnits?: number;
  totalUnits?: number;
  goodUnits?: number;
}

export default function ItemImageGallery({
  photos,
  imageUrl,
  itemName,
  modelCode,
  selectedPhoto,
  onSelectPhoto,
  itemId,
  availableUnits = 0,
  totalUnits,
  goodUnits,
}: ItemImageGalleryProps) {
  const { data: authUser } = useAuthUser();
  const isAdmin = authUser?.role === Role.admin;
  const showCartButton = !isAdmin && !!itemId && availableUnits > 0;

  return (
    <>
      <ItemTitleStats
        itemName={itemName}
        modelCode={modelCode}
        totalUnits={totalUnits}
        availableUnits={availableUnits}
        goodUnits={goodUnits}
      />
      <MainImage
        photos={photos}
        imageUrl={imageUrl}
        itemName={itemName}
        selectedPhoto={selectedPhoto}
        onSelectPhoto={onSelectPhoto}
      />
      {showCartButton && (
        <AddToCartSection
          itemId={itemId!}
          itemName={itemName!}
          firstPhotoPath={photos[0]?.file_path ?? null}
          availableUnits={availableUnits}
        />
      )}
    </>
  );
}
