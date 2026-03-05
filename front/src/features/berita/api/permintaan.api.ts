import { apiClient } from "@/lib/api";
import type { ReportData } from "../types/permintaan.types";

export const reportsAPI = {
  // Get all reports
  getReports: (params?: { report_type?: string; is_approved?: boolean }) => {
    const searchParams = new URLSearchParams();
    if (params?.report_type)
      searchParams.set("report_type", params.report_type);
    if (params?.is_approved !== undefined)
      searchParams.set("is_approved", String(params.is_approved));
    const query = searchParams.toString();
    return apiClient.get<ReportData[]>(
      query ? `/reports?${query}` : "/reports",
    );
  },

  getMyReports: () => apiClient.get<ReportData[]>("/reports/my-reports"),

  // Get single report
  getReport: (id: number) => apiClient.get<ReportData>(`/reports/${id}`),

  // Get report by request ID
  getReportByRequestId: (requestId: number) =>
    apiClient.get<ReportData>(`/reports/request/${requestId}`),

  // Download report
  downloadReport: (id: number) => `/api/v1/reports/${id}/download`,

  // Approve report
  approveReport: (id: number) =>
    apiClient.put<ReportData>(`/reports/${id}/approve`, {}),

  // Reject report
  rejectReport: (id: number) =>
    apiClient.put<ReportData>(`/reports/${id}/reject`, {}),
};
