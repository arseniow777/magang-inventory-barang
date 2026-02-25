import { useMemo, useState, useCallback } from "react";
import type { RequestData } from "../types/permintaan.types";

export type SortField = "created_at" | "request_code";
export type SortDir = "asc" | "desc";

export function usePermintaanFilter(requests: RequestData[]) {
  const [activeStatus, setActiveStatus] = useState("pending");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const categories = useMemo(() => {
    return Array.from(new Set(requests.map((r) => r.status)));
  }, [requests]);

  const filteredRequests = useMemo(() => {
    let result =
      activeStatus === "all"
        ? requests
        : requests.filter((r) => r.status === activeStatus);

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (r) =>
          r.request_code.toLowerCase().includes(q) ||
          r.pic.name.toLowerCase().includes(q) ||
          r.reason.toLowerCase().includes(q),
      );
    }

    result = [...result].sort((a, b) => {
      const valA = sortField === "created_at" ? a.created_at : a.request_code;
      const valB = sortField === "created_at" ? b.created_at : b.request_code;
      const cmp = valA < valB ? -1 : valA > valB ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [activeStatus, requests, search, sortField, sortDir]);

  const handleStatusChange = useCallback((status: string) => {
    setActiveStatus(status);
  }, []);

  return {
    activeStatus,
    categories,
    filteredRequests,
    handleStatusChange,
    search,
    setSearch,
    sortField,
    setSortField,
    sortDir,
    setSortDir,
  };
}
