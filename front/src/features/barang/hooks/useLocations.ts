import { useQuery } from "@tanstack/react-query";
import { createBarangAPI } from "../../barang/api/createbarang.api";

export function useLocations() {
  return useQuery({
    queryKey: ["locations"],
    queryFn: () => createBarangAPI.getLocations(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
