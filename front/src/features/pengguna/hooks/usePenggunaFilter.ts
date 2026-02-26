import { useMemo, useState, useCallback } from "react";
import type { UserData } from "../types/pengguna.types";

export type StatusFilter = "all" | "active" | "inactive";

export function usePenggunaFilter(users: UserData[]) {
  const [activeRole, setActiveRole] = useState("all");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filteredUsers = useMemo(() => {
    let result = users;

    if (activeRole !== "all") {
      result = result.filter((u) => u.role === activeRole);
    }

    if (statusFilter === "active") {
      result = result.filter((u) => u.is_active);
    } else if (statusFilter === "inactive") {
      result = result.filter((u) => !u.is_active);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q) ||
          u.employee_id.toLowerCase().includes(q),
      );
    }

    return result;
  }, [users, activeRole, search, statusFilter]);

  const handleRoleChange = useCallback((role: string) => {
    setActiveRole(role);
  }, []);

  return {
    activeRole,
    handleRoleChange,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    filteredUsers,
  };
}
