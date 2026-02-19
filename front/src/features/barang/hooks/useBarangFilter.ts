import { useMemo, useState, useCallback } from "react";
import type { ItemMasters } from "../types/barang.types";

export function useBarangFilter(items: ItemMasters[]) {
  const [activeCategory, setActiveCategory] = useState("all");

  // Extract unique categories using useMemo
  const categories = useMemo(() => {
    return Array.from(new Set(items.map((item) => item.category)));
  }, [items]);

  // Filter items using useMemo
  const filteredItems = useMemo(() => {
    if (activeCategory === "all") {
      return items;
    }
    return items.filter((item) => item.category === activeCategory);
  }, [activeCategory, items]);

  // Memoize callback to prevent unnecessary re-renders
  const handleCategoryChange = useCallback((category: string) => {
    setActiveCategory(category);
  }, []);

  return {
    activeCategory,
    categories,
    filteredItems,
    handleCategoryChange,
  };
}
