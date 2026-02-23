import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../api/auth.api";
import { ROUTES } from "@/constants/routes";
import type { LoginResponse } from "../types/auth.types";
import type { LoginFormData } from "../schemas/auth.schema";

export function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, Error, LoginFormData>({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      // clear old data
      queryClient.clear();
      localStorage.setItem("token", data.token);
      if (!data.user?.telegram_id) {
        navigate(ROUTES.TELEGRAM_CONFIRM);
      } else {
        navigate(ROUTES.DASHBOARD);
      }
    },
  });
}
