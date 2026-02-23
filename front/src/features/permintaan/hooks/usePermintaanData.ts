import { useQuery } from "@tanstack/react-query";
import { permintaanAPI } from "../api/permintaan.api";

export function usePermintaanData() {
  return useQuery({
    queryKey: ["requests"],
    queryFn: () => permintaanAPI.getRequests(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
