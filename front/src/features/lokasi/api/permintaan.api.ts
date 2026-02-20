import { apiClient } from "@/lib/api";
import type { RequestData } from "../types/permintaan.types";

// TODO: Implement actual API calls when backend is ready
export const permintaanAPI = {
  // Get all requests
  getRequests: () => apiClient.get<RequestData[]>("/requests"),

  // Get single request
  getRequest: (id: number) => apiClient.get<RequestData>(`/requests/${id}`),

  // Create new request
  createRequest: (data: Omit<RequestData, "id">) =>
    apiClient.post<RequestData>("/requests", data),

  // Update existing request
  updateRequest: (id: number, data: Partial<RequestData>) =>
    apiClient.put<RequestData>(`/requests/${id}`, data),

  // Delete request
  deleteRequest: (id: number) => apiClient.delete<void>(`/requests/${id}`),

  // Approve request
  approveRequest: (id: number) =>
    apiClient.post<RequestData>(`/requests/${id}/approve`),

  // Reject request
  rejectRequest: (id: number, reason?: string) =>
    apiClient.post<RequestData>(`/requests/${id}/reject`, { reason }),
};
