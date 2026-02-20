import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../api/auth.api";
import { ROUTES } from "@/constants/routes";

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      // Remove token from localStorage
      localStorage.removeItem("token");
      // Clear all cached queries
      queryClient.clear();
      // Redirect to login page
      navigate(ROUTES.LOGIN);
    },
    onError: () => {
      // Even if API call fails, still logout locally
      localStorage.removeItem("token");
      queryClient.clear();
      navigate(ROUTES.LOGIN);
    },
  });
}
