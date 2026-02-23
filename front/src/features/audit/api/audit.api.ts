import { apiClient } from "@/lib/api";
import type { AuditLogsResponse } from "../types/audit.types";

export const auditAPI = {
  getAuditLogs: (params?: {
    action?: string;
    entity_type?: string;
    actor_id?: number;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const query = params
      ? "?" +
        new URLSearchParams(
          Object.entries(params)
            .filter(([, v]) => v !== undefined)
            .map(([k, v]) => [k, String(v)]),
        ).toString()
      : "";
    return apiClient.get<AuditLogsResponse>(`/audit-logs${query}`);
  },

  getAuditLogById: (id: number) =>
    apiClient.get<AuditLogsResponse>(`/audit-logs/${id}`),

  exportAuditLogs: () => apiClient.get<Blob>("/audit-logs/export"),
};
