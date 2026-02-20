import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notifikasiAPI } from "../api/notifikasi.api";
import type { NotificationItem } from "../types/notification.types";

export function useNotifications() {
  return useQuery<NotificationItem[]>({
    queryKey: ["notifications"],
    queryFn: () => notifikasiAPI.getNotifications(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useDeleteNotification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => notifikasiAPI.deleteNotification(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}
