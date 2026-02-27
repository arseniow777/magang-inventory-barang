import { apiClient } from "@/lib/api";

export const bantuanAPI = {
  contactAdmin: (message: string) =>
    apiClient.post<void>("/notifications/contact-admin/web", { message }),
};
