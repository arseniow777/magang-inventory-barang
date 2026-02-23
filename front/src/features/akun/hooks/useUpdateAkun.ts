import { useMutation, useQueryClient } from "@tanstack/react-query";
import { akunAPI } from "../api/akun.api";
import type { Akun } from "../types/akun.types";

export const useUpdateAkun = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Akun>) =>
      akunAPI.updateProfile(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["akun"] });
    },
  });
};