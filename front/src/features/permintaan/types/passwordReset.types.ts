export type PasswordResetStatus = "pending" | "approved" | "rejected";

export interface PasswordResetUser {
  id: number;
  username: string;
  name: string;
  employee_id: string;
}

export interface PasswordResetAdmin {
  id: number;
  username: string;
  name: string;
}

export interface PasswordResetData {
  id: number;
  status: PasswordResetStatus;
  created_at: string;
  approved_at: string | null;
  user_id: number;
  admin_id: number | null;
  user: PasswordResetUser;
  admin: PasswordResetAdmin | null;
}
