export type Role = "pic" | "admin";

export interface User {
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

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}
