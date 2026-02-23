import { useQuery } from "@tanstack/react-query";
import { akunAPI } from "../api/akun.api";
import type { Akun } from "../types/akun.types";

export const useAkun = () => {
  return useQuery<Akun>({
    queryKey: ["akun"],
    queryFn: akunAPI.getProfile,
  });
};