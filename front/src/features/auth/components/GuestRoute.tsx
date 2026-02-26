import { Navigate } from "react-router-dom";

interface GuestRouteProps {
  children: React.ReactNode;
}

/**
 * Blocks guest users (no token, isGuest flag set) from accessing
 * pages that require a real authenticated account.
 * Redirects them to the barang list.
 */
export function GuestRoute({ children }: GuestRouteProps) {
  const isGuest = localStorage.getItem("isGuest") === "true";
  const token = localStorage.getItem("token");

  if (isGuest || !token) {
    return <Navigate to="/dashboard/barang" replace />;
  }

  return <>{children}</>;
}
