import LoginPage from "@/features/auth/pages/LoginPage";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import TelegramConfirmPage from "@/features/auth/pages/TelegramConfirmPage";
import { Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function App() {
  return (
    <TooltipProvider>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/telegram-confirm" element={<TelegramConfirmPage />} />
        <Route path="/dashboard/*" element={<DashboardPage />} />
      </Routes>
    </TooltipProvider>
  );
}
