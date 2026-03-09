import { useMutation, useQueryClient } from "@tanstack/react-query";
import { itemUnitsAPI } from "../api/barang.api";
import type { UpdateItemUnitsDTO } from "../types/barang.types";

export function useUpdateUnit(id: number, itemId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateItemUnitsDTO) => itemUnitsAPI.updateUnit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["item", itemId] });
    },
  });
}
