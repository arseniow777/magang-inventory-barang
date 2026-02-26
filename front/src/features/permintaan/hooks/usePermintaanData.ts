import { useQuery } from "@tanstack/react-query";
import { permintaanAPI } from "../api/permintaan.api";
import { useAuthUser, Role } from "@/hooks/useAuthUser";

export function usePermintaanData() {
  const { data: user } = useAuthUser();

  return useQuery({
    queryKey: ["requests", user?.role, user?.id],
    queryFn: () =>
      user?.role === Role.pic
        ? permintaanAPI.getMyRequests() // backend filters by req.user.id
        : permintaanAPI.getRequests(), // admin gets all
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
