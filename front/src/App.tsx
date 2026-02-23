import LoginPage from "@/features/auth/pages/LoginPage";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import TelegramConfirmPage from "@/features/auth/pages/TelegramConfirmPage";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { RootRedirect } from "@/features/auth/components/RootRedirect";
import { Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  return (
    <TooltipProvider>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/telegram-confirm" element={<TelegramConfirmPage />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster />
    </TooltipProvider>
  );
}
