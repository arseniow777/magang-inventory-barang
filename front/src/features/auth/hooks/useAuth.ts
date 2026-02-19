import { useQuery } from "@tanstack/react-query";
import { authAPI } from "../api/auth.api";

export function useAuth() {
  const token = localStorage.getItem("token");

  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: authAPI.getMe,
    enabled: !!token,
    retry: false,
  });
}
