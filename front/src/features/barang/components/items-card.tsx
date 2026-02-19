import type { ItemMasters } from "../types/barang.types";
import { getImageUrl } from "@/config/api";

interface ItemsCardProps {
  item: ItemMasters;
}

export function ItemsCard({ item }: ItemsCardProps) {
  const totalUnits = item._count?.units || 0;
  const firstPhoto = item.photos?.[0];
  const imageUrl = firstPhoto ? getImageUrl(firstPhoto.file_path) : null;

  return (
    <div className="w-full rounded-lg overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
      {/* Image Container */}
      <div className="aspect-square w-full overflow-hidden bg-linear-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : null}
      </div>

      {/* Content Container */}
      <div className="p-4 bg-neutral-50 dark:bg-neutral-900">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-8 line-clamp-1">
          {item.name}
        </h3>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
            {totalUnits} Unit
          </span>
          <span className="text-sm font-medium text-neutral-400 dark:text-neutral-500">
            {item.category}
          </span>
        </div>
      </div>
    </div>
  );
}
