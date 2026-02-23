import { apiClient } from "@/lib/api";
import type {
  CreateBarangRequest,
  Location,
} from "../types/createbarang.types";

export const createBarangAPI = {
  createItem: async (data: CreateBarangRequest) => {
    const response = await apiClient.post("/items", data);
    return response;
  },

  uploadPhotos: async (itemId: number, files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    return apiClient.post(`/items/${itemId}/photos`, formData);
  },

  getLocations: () => apiClient.get<Location[]>("/locations"),
};
