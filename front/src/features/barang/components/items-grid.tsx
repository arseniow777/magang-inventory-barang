import { ItemsCard } from "./items-card";
import type { ItemMasters } from "../types/barang.types";
import { EmptyState } from "@/components/empty-state";

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
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
      {items.length > 0 ? (
        items.map((item) => <ItemsCard key={item.id} item={item} />)
      ) : (
        <div className="col-span-full">
          <EmptyState
            title="Tidak ada barang"
            description="Belum ada barang yang terdaftar di sistem"
          />
        </div>
      )}
    </div>
  );
}
