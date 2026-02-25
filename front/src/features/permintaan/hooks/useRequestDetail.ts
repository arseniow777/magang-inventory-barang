import { useQuery } from "@tanstack/react-query";
import { permintaanAPI } from "../api/permintaan.api";

export function useRequestDetail(id: number | null) {
  return useQuery({
    queryKey: ["request-detail", id],
    queryFn: () => permintaanAPI.getRequest(id!),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
}
