import { useMutation, useQueryClient } from "@tanstack/react-query";
import { permintaanAPI } from "../api/permintaan.api";

export function usePermintaanAction() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["requests"] });
  };

  const approve = useMutation({
    mutationFn: (id: number) => permintaanAPI.approveRequest(id),
    onSuccess: invalidate,
  });

  const reject = useMutation({
    mutationFn: (id: number) => permintaanAPI.rejectRequest(id),
    onSuccess: invalidate,
  });

  return { approve, reject };
}
