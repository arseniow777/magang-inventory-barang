import { useQuery } from "@tanstack/react-query";
import { auditAPI } from "../api/audit.api";

export function useAuditData(params?: {
  action?: string;
  entity_type?: string;
  actor_id?: number;
  search?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["audit-logs", params],
    queryFn: () => auditAPI.getAuditLogs(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
