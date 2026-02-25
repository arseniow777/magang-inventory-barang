import { IconPackage } from "@tabler/icons-react";
import { getImageUrl } from "@/config/api";
import type { ItemPhotos } from "../types/barang.types";
import { Button } from "@/components/ui/button";

interface ItemImageGalleryProps {
  photos: ItemPhotos[];
  imageUrl: string | null;
  itemName?: string;
  selectedPhoto: string | null;
  onSelectPhoto: (path: string) => void;
}

export default function ItemImageGallery({
  photos,
  imageUrl,
  itemName,
  selectedPhoto,
  onSelectPhoto,
}: ItemImageGalleryProps) {
  return (
    <>
      {/* Main image */}
      <div className="w-full aspect-square rounded-sm overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={itemName}
            className="h-full w-full object-cover"
          />
        ) : (
          <IconPackage className="h-16 w-16 text-muted-foreground/40" />
        )}
      </div>
      {/* Thumbnails */}
      {photos.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {photos.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelectPhoto(p.file_path)}
              className={`h-16 w-16 rounded-sm overflow-hidden border-2 transition-colors ${
                (selectedPhoto ?? photos[0]?.file_path) === p.file_path
                  ? "border-primary"
                  : "border-transparent"
              }`}
            >
              <img
                src={getImageUrl(p.file_path)}
                alt=""
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
      <div className="w-full space-y-4 mt-10">
        <Button size="lg" variant="outline" className="w-full  rounded-sm">
          Tambahkan ke bagasi
        </Button>

        <div className="flex gap-4">
          <Button size="lg" variant="outline" className="flex-1  rounded-sm">
            Transfer
          </Button>
          <Button size="lg" variant="outline" className="flex-1  rounded-sm">
            Lelang
          </Button>
          <Button size="lg" variant="outline" className="flex-1  rounded-sm">
            Arsipkan
          </Button>
        </div>
      </div>
    </>
  );
}
