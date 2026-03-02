import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { ItemLogHistoryEntry } from "../types/barang.types";

export function useUnitLocationHistory(unitId: number | null) {
  return useQuery<ItemLogHistoryEntry[]>({
    queryKey: ["unit-location-history", unitId],
    queryFn: () =>
      apiClient.get<ItemLogHistoryEntry[]>(`/item-units/${unitId!}/history`),
    enabled: unitId !== null && !isNaN(unitId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
