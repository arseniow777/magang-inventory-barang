import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { transferAPI } from "../api/transfer.api";
import { useCartStore } from "../store/cartStore";
import type { TransferFormValues } from "../types/transfer.types";

const TYPE_LABELS: Record<string, string> = {
  borrow: "peminjaman",
  transfer: "transfer",
  sell: "penjualan",
  demolish: "penghapusan",
};

export function useCreateTransfer() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  return useMutation({
    mutationFn: (values: TransferFormValues) =>
      transferAPI.createRequest(items, values),
    onSuccess: (data, variables) => {
      clearCart();
      const label =
        TYPE_LABELS[variables.request_type] ?? variables.request_type;
      toast.success(
        `Permintaan ${label} berhasil diajukan${
          data?.request_code ? ` (${data.request_code})` : ""
        }.`,
      );
      navigate("/dashboard/permintaan");
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Gagal mengajukan permintaan.");
    },
  });
}
