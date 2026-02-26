import { apiClient } from "@/lib/api";
import type { PasswordResetData } from "../types/passwordReset.types";

export const passwordResetAPI = {
  // Get all password resets (admin only)
  getPasswordResets: (params?: { status?: string }) => {
    const query = params?.status ? `?status=${params.status}` : "";
    return apiClient.get<PasswordResetData[]>(`/password-resets${query}`);
  },

  // Approve a password reset request
  approvePasswordReset: (id: number) =>
    apiClient.put<void>(`/password-resets/${id}/approve`, {}),

  // Reject a password reset request
  rejectPasswordReset: (id: number) =>
    apiClient.put<void>(`/password-resets/${id}/reject`, {}),
};
