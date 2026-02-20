export interface NotificationItem {
  id: number;
  user_id: number;
  message: string;
  type: string;
  created_at: string;
  link?: string | null;
  user?: {
    id: number;
    username: string;
    name: string;
  };
}

export type NotificationListResponse = NotificationItem[];
