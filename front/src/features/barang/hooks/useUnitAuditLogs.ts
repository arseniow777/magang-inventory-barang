import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { AuditLogData } from "@/features/audit/types/audit.types";

export function useUnitAuditLogs(unitId: number | null) {
  return useQuery<AuditLogData[]>({
    queryKey: ["unit-audit-logs", unitId],
    queryFn: () =>
      apiClient.get<AuditLogData[]>(`/audit-logs/entity/ItemUnits/${unitId!}`),
    enabled:
      unitId !== null && !isNaN(unitId) && !!localStorage.getItem("token"),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
