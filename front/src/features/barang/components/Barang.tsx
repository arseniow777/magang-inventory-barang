import { TabsLine } from "@/components/tabs";
import { Button } from "@/components/ui/button";
import { ItemsGrid } from "./items-grid";
import { useBarangItems } from "../hooks/useBarangItems";
import { useBarangFilter } from "../hooks/useBarangFilter";
import { IconDatabasePlus } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { ButtonGroupInput } from "./group-button";
import { useAuthUser, Role } from "@/hooks/useAuthUser";

export function Barang() {
  const { data: items = [], isLoading, error } = useBarangItems();
  const { data: authUser } = useAuthUser();
  const isAdmin = authUser?.role === Role.admin;
  const {
    categories,
    filteredItems,
    activeCategory,
    handleCategoryChange,
    search,
    setSearch,
    sortField,
    setSortField,
    sortDir,
    setSortDir,
  } = useBarangFilter(items);

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
        </div>

        {/* Category Tabs */}
        <div className="mb-2 w-full flex justify-between gap-4">
          <TabsLine
            tabs={[
              { value: "all", label: "Semua" },
              ...categories.map((c) => ({ value: c, label: c })),
            ]}
            activeTab={activeCategory}
            onTabChange={handleCategoryChange}
          />
          <div className="flex gap-2">
            <ButtonGroupInput
              search={search}
              onSearchChange={setSearch}
              sortField={sortField}
              onSortFieldChange={setSortField}
              sortDir={sortDir}
              onSortDirChange={setSortDir}
            />
            {isAdmin && (
              <Button className="gap-2" onClick={handleCreate}>
                <IconDatabasePlus className="h-4 w-4" />
                <p className="hidden lg:block">Tambah Barang</p>
              </Button>
            )}
          </div>
        </div>
        {/* Items Grid */}
        <ItemsGrid items={filteredItems} isLoading={isLoading} />
      </div>
    </>
  );
}
