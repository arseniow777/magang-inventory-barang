import { apiClient } from "@/lib/api";
import type { LoginFormData } from "../schemas/auth.schema";
import type { LoginResponse, User } from "../types/auth.types";

export const authAPI = {
  login: (data: LoginFormData) =>
    apiClient.post<LoginResponse>("/auth/login", data),

  getMe: () => apiClient.get<User>("/auth/me"),

  logout: () => apiClient.post<void>("/auth/logout"),
};
