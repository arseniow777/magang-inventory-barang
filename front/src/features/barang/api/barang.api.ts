import { apiClient } from "@/lib/api";
import type {
  ItemMasters,
  ItemUnits,
  CreateItemMastersDTO,
  UpdateItemMastersDTO,
  CreateItemUnitsDTO,
  UpdateItemUnitsDTO,
  ItemPhotos,
} from "../types/barang.types";

// Master
export const itemsMasterAPI = {
  // Item Masters endpoints
  getItems: () => apiClient.get<ItemMasters[]>("/items"),

  getItem: (id: number) => apiClient.get<ItemMasters>(`/items/${id}`),

  createItem: (data: CreateItemMastersDTO) =>
    apiClient.post<ItemMasters>("/items", data),

  updateItem: (id: number, data: UpdateItemMastersDTO) =>
    apiClient.put<ItemMasters>(`/items/${id}`, data),

  deleteItem: (id: number) => apiClient.delete<void>(`/items/${id}`),

  uploadPhoto: (id: number, file: FormData) =>
    apiClient.post<ItemPhotos>(`/items/${id}/photos`, file),

  deletePhoto: (id: number, photoId: number) =>
    apiClient.delete<void>(`/items/${id}/photos/${photoId}`),

  restockItem: (id: number, data: any) =>
    apiClient.post<ItemMasters>(`/items/${id}/restock`, data),

  getConditionSummary: () =>
    apiClient.get<{ good: number; damaged: number; broken: number }>(
      "/items/condition-summary",
    ),
};

// Units
export const itemUnitsAPI = {
  // Item Units endpoints
  getUnits: () => apiClient.get<ItemUnits[]>("/item-units"),

  getUnit: (id: number) => apiClient.get<ItemUnits>(`/item-units/${id}`),

  createUnit: (data: CreateItemUnitsDTO) =>
    apiClient.post<ItemUnits>("/item-units", data),

  updateUnit: (id: number, data: UpdateItemUnitsDTO) =>
    apiClient.put<ItemUnits>(`/item-units/${id}`, data),

  deleteUnit: (id: number) => apiClient.delete<void>(`/item-units/${id}`),

  getUnitsByStatus: (status: string) =>
    apiClient.get<ItemUnits[]>(`/item-units?status=${status}`),
};
