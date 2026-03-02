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

  const confirmArrival = useMutation({
    mutationFn: (id: number) => permintaanAPI.confirmArrival(id),
    onSuccess: invalidate,
  });

  const returnBorrow = useMutation({
    mutationFn: (id: number) => permintaanAPI.returnBorrow(id),
    onSuccess: invalidate,
  });

  return { approve, reject, confirmArrival, returnBorrow };
}
