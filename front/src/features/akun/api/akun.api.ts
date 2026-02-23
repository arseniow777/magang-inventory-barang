import { apiClient } from "@/lib/api";
import type { Akun} from "../types/akun.types";

export const akunAPI = {
  getProfile: () => apiClient.get<Akun>(`/users/me`),

  updateProfile: (data: Partial<Akun>) => apiClient.put<void>(`/users/me`, data),
};
