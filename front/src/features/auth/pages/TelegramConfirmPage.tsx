import { TelegramConfirm } from "../components/TelegramConfirm";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

export default function TelegramConfirmPage() {
  const { data: user, isLoading } = useAuth();
  const token = localStorage.getItem("token");

  // No token, redirect to login
  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Loading user data
  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="text-lg">Memuat...</div>
      </div>
    );
  }

  // If user already has telegram_id, redirect to dashboard
  if (user?.telegram_id) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <TelegramConfirm />
      </div>
    </div>
  );
}
