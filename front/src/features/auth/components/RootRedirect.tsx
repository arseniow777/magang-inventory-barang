import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "@/constants/routes";
import { Spinner } from "@/components/ui/spinner";

export function RootRedirect() {
  const { data: user, isLoading } = useAuth();
  const token = localStorage.getItem("token");

  // Loading state
  if (isLoading && token) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <>
          <Spinner />
          <span className="text-lg">Memuat...</span>
        </>
      </div>
    );
  }

  // If user is logged in, redirect based on telegram status
  if (token && user) {
    if (user.telegram_id) {
      return <Navigate to={ROUTES.DASHBOARD} replace />;
    } else {
      return <Navigate to={ROUTES.TELEGRAM_CONFIRM} replace />;
    }
  }

  // Guest mode — send to barang list
  if (localStorage.getItem("isGuest") === "true") {
    return <Navigate to="/dashboard/barang" replace />;
  }

  // Not logged in, go to login page
  return <Navigate to={ROUTES.LOGIN} replace />;
}
