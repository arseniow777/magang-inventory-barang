export const ROUTES = {
  ROOT: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  TELEGRAM_CONFIRM: "/telegram-confirm",
  USERS: "/users",
  USERS_DETAIL: (id: string | number) => `/users/${id}`,
  SETTINGS: "/settings",
} as const;
