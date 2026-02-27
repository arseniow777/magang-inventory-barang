import { useMutation } from "@tanstack/react-query";
import { bantuanAPI } from "../api/bantuan.api";

export function useContactAdmin() {
  return useMutation({
    mutationFn: (message: string) => bantuanAPI.contactAdmin(message),
  });
}
