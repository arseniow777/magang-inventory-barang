export interface UserData {
  id: number;
  employee_id: string;
  username: string;
  name: string;
  role: "admin" | "pic" | "staff";
  phone_number: string | null;
  telegram_id: string | null;
  is_active: boolean;
  created_at: string;
}

export type UserRole = "admin" | "pic" | "staff";
