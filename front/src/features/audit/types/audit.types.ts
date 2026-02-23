export interface AuditLogData {
  id: number;
  action: string;
  entity_type: string;
  entity_id: number;
  description: string | null;
  actor_role: string;
  user_agent: string | null;
  created_at: string;
  actor: {
    id: number;
    name: string;
    username: string;
    role: string;
  };
}

export interface AuditLogsResponse {
  logs: AuditLogData[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "APPROVE"
  | "REJECT"
  | "LOGIN"
  | "LOGOUT"
  | "ARCHIVE"
  | "RESET_PASSWORD_REQUEST";
