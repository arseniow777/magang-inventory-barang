import { useQuery } from "@tanstack/react-query";
import { createBarangAPI } from "@/features/barang/api/createbarang.api";

/** Fetches all available locations for the destination dropdown. */
export function useLocationsTransfer() {
  return useQuery({
    queryKey: ["locations"],
    queryFn: () => createBarangAPI.getLocations(),
    staleTime: 10 * 60 * 1000,
  });
}
