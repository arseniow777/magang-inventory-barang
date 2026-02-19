import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

export const Role = {
  pic: "pic",
  admin: "admin",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

interface User {
  id: number;
  employee_id: string;
  username: string;
  name: string;
  role: Role;
  phone_number?: string;
  is_active: boolean;
  telegram_id?: string;
  created_at: string;
}

export const useAuthUser = () => {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => apiClient.get<User>("/auth/me"),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
  });
};

export const getRoleDisplay = (role: Role): string => {
  const roleMap: Record<Role, string> = {
    [Role.admin]: "Administrator",
    [Role.pic]: "PIC",
  };
  return roleMap[role] || role;
};
