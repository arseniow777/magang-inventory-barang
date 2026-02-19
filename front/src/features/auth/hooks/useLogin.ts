import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../api/auth.api";
import { ROUTES } from "@/constants/routes";
import type { LoginResponse } from "../types/auth.types";
import type { LoginFormData } from "../schemas/auth.schema";
import { useAuth } from "../hooks/useAuth";

export function useLogin() {
  const navigate = useNavigate();
  const { data: user } = useAuth();

  const isLinked = !!user?.telegram_id;

  return useMutation<LoginResponse, Error, LoginFormData>({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      if (isLinked) {
        navigate(ROUTES.TELEGRAM_CONFIRM);
      } else {
        navigate(ROUTES.DASHBOARD);
      }
    },
  });
}
