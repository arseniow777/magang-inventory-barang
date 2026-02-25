import { useQuery } from "@tanstack/react-query";
import { itemsMasterAPI } from "../api/barang.api";
import type { ItemMasterDetail } from "../types/barang.types";

export function useItemDetail(id: number | null) {
  return useQuery<ItemMasterDetail>({
    queryKey: ["item", id],
    queryFn: () => itemsMasterAPI.getItem(id!) as Promise<ItemMasterDetail>,
    enabled: id !== null && !isNaN(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
