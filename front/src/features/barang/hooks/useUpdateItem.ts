import { useMutation, useQueryClient } from "@tanstack/react-query";
import { itemsMasterAPI } from "../api/barang.api";
import type { UpdateItemMastersDTO } from "../types/barang.types";

export function useUpdateItem(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateItemMastersDTO) =>
      itemsMasterAPI.updateItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["item", id] });
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}
