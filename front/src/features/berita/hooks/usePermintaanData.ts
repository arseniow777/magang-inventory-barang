import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reportsAPI } from "../api/permintaan.api";

export function useReportsData(
  params?: { report_type?: string; is_approved?: boolean },
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ["reports", params],
    queryFn: () => reportsAPI.getReports(params),
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useMyReportsData(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["reports", "my-reports"],
    queryFn: () => reportsAPI.getMyReports(),
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// Get single report
export function useReport(id: number) {
  return useQuery({
    queryKey: ["reports", id],
    queryFn: () => reportsAPI.getReport(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Get report by request ID
export function useReportByRequestId(requestId: number) {
  return useQuery({
    queryKey: ["reports", "request", requestId],
    queryFn: () => reportsAPI.getReportByRequestId(requestId),
    enabled: !!requestId,
    staleTime: 5 * 60 * 1000,
  });
}

// Approve report mutation
export function useApproveReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => reportsAPI.approveReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
}

// Reject report mutation
export function useRejectReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => reportsAPI.rejectReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
}
