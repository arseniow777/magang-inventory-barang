import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "@/constants/routes";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { data: user, isLoading } = useAuth();
  const token = localStorage.getItem("token");
  const isGuest = localStorage.getItem("isGuest") === "true";

  // Guest mode — allow through without a token
  if (isGuest && !token) {
    return <>{children}</>;
  }

  // No token and not a guest, redirect to login
  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Still loading user data, show nothing or a loader
  if (isLoading) {
    return (
      <div className="flex h-screen bg-foreground items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // User loaded but no telegram_id, redirect to telegram confirmation
  if (user && !user.telegram_id) {
    return <Navigate to={ROUTES.TELEGRAM_CONFIRM} replace />;
  }

  // All checks passed, render protected content
  return <>{children}</>;
}
