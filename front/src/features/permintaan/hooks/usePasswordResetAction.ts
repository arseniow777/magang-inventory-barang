import { useMutation, useQueryClient } from "@tanstack/react-query";
import { passwordResetAPI } from "../api/passwordReset.api";
import { toast } from "sonner";

export function usePasswordResetAction() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["password-resets"] });
  };

  const approve = useMutation({
    mutationFn: (id: number) => passwordResetAPI.approvePasswordReset(id),
    onSuccess: () => {
      invalidate();
      toast.success("Password berhasil direset");
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Gagal menyetujui reset password");
    },
  });

  const reject = useMutation({
    mutationFn: (id: number) => passwordResetAPI.rejectPasswordReset(id),
    onSuccess: () => {
      invalidate();
      toast.success("Request reset password ditolak");
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Gagal menolak reset password");
    },
  });

  return { approve, reject };
}
