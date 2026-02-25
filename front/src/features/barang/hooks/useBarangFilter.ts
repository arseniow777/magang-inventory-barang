import { useMemo, useState, useCallback } from "react";
import type { ItemMasters } from "../types/barang.types";

export type SortField = "name" | "created_at" | "procurement_year";
export type SortDir = "asc" | "desc";

export function useBarangFilter(items: ItemMasters[]) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const categories = useMemo(() => {
    return Array.from(new Set(items.map((item) => item.category)));
  }, [items]);

  const filteredItems = useMemo(() => {
    let result =
      activeCategory === "all"
        ? items
        : items.filter((item) => item.category === activeCategory);

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.model_code.toLowerCase().includes(q),
      );
    }

    result = [...result].sort((a, b) => {
      const valA =
        sortField === "procurement_year"
          ? a.procurement_year
          : sortField === "created_at"
            ? a.created_at
            : a.name;
      const valB =
        sortField === "procurement_year"
          ? b.procurement_year
          : sortField === "created_at"
            ? b.created_at
            : b.name;
      const cmp = valA < valB ? -1 : valA > valB ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [activeCategory, items, search, sortField, sortDir]);

  const handleCategoryChange = useCallback((category: string) => {
    setActiveCategory(category);
  }, []);

  return {
    activeCategory,
    categories,
    filteredItems,
    handleCategoryChange,
    search,
    setSearch,
    sortField,
    setSortField,
    sortDir,
    setSortDir,
  };
}
