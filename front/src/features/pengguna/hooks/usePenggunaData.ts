import { useQuery } from "@tanstack/react-query";
import { usersAPI } from "../api/pengguna.api";

export function useUsersData() {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => usersAPI.getUsers(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
