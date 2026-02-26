import { useQuery } from "@tanstack/react-query";
import { passwordResetAPI } from "../api/passwordReset.api";

export function usePasswordResets(status?: string) {
  return useQuery({
    queryKey: ["password-resets", status],
    queryFn: () =>
      passwordResetAPI.getPasswordResets(status ? { status } : undefined),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
