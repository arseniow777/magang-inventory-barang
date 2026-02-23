import { apiClient } from "@/lib/api";
import type { UserData } from "../types/pengguna.types";

export const usersAPI = {
  // Get all users
  getUsers: () => apiClient.get<UserData[]>("/users"),

  // Get single user
  getUser: (id: number) => apiClient.get<UserData>(`/users/${id}`),

  // Create user
  createUser: (data: Omit<UserData, "id" | "created_at">) =>
    apiClient.post<UserData>("/users", data),

  // Update user
  updateUser: (id: number, data: Partial<UserData>) =>
    apiClient.put<UserData>(`/users/${id}`, data),

  // Delete user
  deleteUser: (id: number) => apiClient.delete<void>(`/users/${id}`),
};
