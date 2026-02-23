import { apiClient } from "@/lib/api";
import type {
  NotificationListResponse,
  NotificationItem,
} from "../types/notification.types";

export const notifikasiAPI = {
  getNotifications: () =>
    apiClient.get<NotificationListResponse>(`/notifications`),

  getNotification: (id: number) =>
    apiClient.get<NotificationItem>(`/notifications/${id}`),

  deleteNotification: (id: number) =>
    apiClient.delete<void>(`/notifications/${id}`),
};
