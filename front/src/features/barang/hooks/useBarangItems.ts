import { useQuery } from "@tanstack/react-query";
import { itemsMasterAPI } from "../api/barang.api";

export function useBarangItems() {
  return useQuery({
    queryKey: ["items"],
    queryFn: () => itemsMasterAPI.getItems(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (cache time)
  });
}
