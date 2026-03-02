import { apiClient } from "@/lib/api";
import type { RequestData, RequestDetailData } from "../types/permintaan.types";

export const permintaanAPI = {
  // Get all requests
  getRequests: (params?: {
    status?: string;
    request_type?: string;
    pic_id?: number;
  }) => {
    const query = params
      ? "?" +
        new URLSearchParams(
          Object.entries(params)
            .filter(([, v]) => v !== undefined)
            .map(([k, v]) => [k, String(v)]),
        ).toString()
      : "";
    return apiClient.get<RequestData[]>(`/requests${query}`);
  },

  // Get own requests (PIC only — filtered server-side by req.user.id)
  getMyRequests: () => apiClient.get<RequestData[]>(`/requests/my-requests`),

  // Get single request (with full items)
  getRequest: (id: number) =>
    apiClient.get<RequestDetailData>(`/requests/${id}`),

  // Approve request (admin)
  approveRequest: (id: number) =>
    apiClient.put<RequestData>(`/requests/${id}/approve`, {}),

  // Reject request (admin)
  rejectRequest: (id: number) =>
    apiClient.put<RequestData>(`/requests/${id}/reject`, {}),

  // Cancel request
  cancelRequest: (id: number) =>
    apiClient.put<RequestData>(`/requests/${id}/cancel`, {}),

  // Confirm arrival (admin) — transitions in_transit → approved/completed
  confirmArrival: (id: number) =>
    apiClient.put<RequestData>(`/requests/${id}/confirm-arrival`, {}),

  // Return borrowed items (admin) — marks borrow as completed, items back to available
  returnBorrow: (id: number) =>
    apiClient.put<RequestData>(`/requests/${id}/return`, {}),
};
