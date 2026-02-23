import { useMutation } from "@tanstack/react-query";
import { createBarangAPI } from "../api/createbarang.api";
import type { CreateBarangRequest } from "../types/createbarang.types";

interface CreateItemResponse {
  id: number;
  name: string;
  category: string;
}

export function useCreateBarang() {
  return useMutation({
    mutationFn: async (data: {
      barangData: CreateBarangRequest;
      files: File[];
    }) => {
      // Create item first
      const itemResponse = (await createBarangAPI.createItem(
        data.barangData,
      )) as CreateItemResponse;

      // Upload photos if present
      if (data.files.length > 0) {
        await createBarangAPI.uploadPhotos(itemResponse.id, data.files);
      }

      return itemResponse;
    },
  });
}
