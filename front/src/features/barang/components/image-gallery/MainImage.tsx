import { IconPackage } from "@tabler/icons-react";
import { getImageUrl } from "@/config/api";
import type { ItemPhotos } from "../../types/barang.types";

interface MainImageProps {
  photos: ItemPhotos[];
  imageUrl: string | null;
  itemName?: string;
  selectedPhoto: string | null;
  onSelectPhoto: (path: string) => void;
}

export function MainImage({
  photos,
  imageUrl,
  itemName,
  selectedPhoto,
  onSelectPhoto,
}: MainImageProps) {
  return (
    <>
      <div className="w-full aspect-square overflow-hidden rounded-sm bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={itemName}
            className="h-full w-full object-cover"
          />
        ) : (
          <IconPackage className="h-16 w-16 text-muted-foreground" />
        )}
      </div>

      {photos.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {photos.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelectPhoto(p.file_path)}
              className={`h-16 w-16 overflow-hidden rounded-sm border-2 transition-colors ${
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
    </>
  );
}
