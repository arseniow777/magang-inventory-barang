import { TabsLine } from "@/components/tabs";
import { Button } from "@/components/ui/button";
import { ItemsGrid } from "./items-grid";
import { useBarangItems } from "../hooks/useBarangItems";
import { useBarangFilter } from "../hooks/useBarangFilter";
import { IconPlus } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

export function Barang() {
  const { data: items = [], isLoading, error } = useBarangItems();
  const { categories, filteredItems, activeCategory, handleCategoryChange } =
    useBarangFilter(items);

  const navigate = useNavigate();
  const handleCreate = () => {
    navigate("/dashboard/barang/create");
  };
  if (error) {
    return (
      <div className="flex items-center justify-center p-6">
        <p className="text-lg text-red-500">
          Error:{" "}
          {error instanceof Error ? error.message : "Failed to fetch items"}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-1 flex-col gap-4">
        {/* Header with title and button */}
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold">Data Barang</h2>
          <Button className="gap-2" onClick={handleCreate}>
            <IconPlus className="h-4 w-4" />
            Tambah Barang
          </Button>
        </div>

        {/* Category Tabs */}
        <div className="mb-6 border-b w-full">
          <TabsLine
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {/* Items Grid */}
        <ItemsGrid items={filteredItems} isLoading={isLoading} />
      </div>
    </>
  );
}
