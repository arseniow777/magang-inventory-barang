import { apiClient } from "@/lib/api";
import type { ReportData } from "../types/permintaan.types";

export const reportsAPI = {
  // Get all reports
  getReports: (params?: { report_type?: string; is_approved?: boolean }) =>
    apiClient.get<ReportData[]>("/reports", params),

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
