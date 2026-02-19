import { ItemsCard } from "./items-card";
import type { ItemMasters } from "../types/barang.types";

interface ItemsGridProps {
  items: ItemMasters[];
  isLoading: boolean;
}

export function ItemsGrid({ items, isLoading }: ItemsGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
      {items.length > 0 ? (
        items.map((item) => <ItemsCard key={item.id} item={item} />)
      ) : (
        <p className="col-span-full text-center text-neutral-500 dark:text-neutral-400">
          No items found
        </p>
      )}
    </div>
  );
}
