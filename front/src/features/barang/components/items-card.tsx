import { useNavigate } from "react-router-dom";
import type { ItemMasters } from "../types/barang.types";
import { getImageUrl } from "@/config/api";

interface ItemsCardProps {
  item: ItemMasters;
}

export function ItemsCard({ item }: ItemsCardProps) {
  const navigate = useNavigate();
  const totalUnits = item._count?.units || 0;
  const firstPhoto = item.photos?.[0];
  const imageUrl = firstPhoto ? getImageUrl(firstPhoto.file_path) : null;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/dashboard/barang/${item.id}`)}
      onKeyDown={(e) =>
        e.key === "Enter" && navigate(`/dashboard/barang/${item.id}`)
      }
      className="relative w-full aspect-video md:aspect-square rounded-sm overflow-hidden bg-neutral-200 dark:bg-neutral-800 cursor-pointer transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      {/* Image fills the entire card */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt={item.name}
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      )}

      {/* Dark gradient overlay at bottom */}
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />

      {/* Text content on top */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
        <h3 className="text-base font-semibold text-white line-clamp-1 mb-1">
          {item.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-white/80">
            {totalUnits} Unit
          </span>
          <span className="text-xs font-medium text-white/60">
            {item.category}
          </span>
        </div>
      </div>
    </div>
  );
}
