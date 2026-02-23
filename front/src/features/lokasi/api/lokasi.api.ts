import { apiClient } from "@/lib/api";
import type {
  LocationData,
  CreateLocationData,
  UpdateLocationData,
} from "../types/lokasi.types";

export const lokasiAPI = {
  // Get all locations
  getLocations: () => apiClient.get<LocationData[]>("/locations"),

  // Get single location
  getLocation: (id: number) => apiClient.get<LocationData>(`/locations/${id}`),

  // Create new location
  createLocation: (data: CreateLocationData) =>
    apiClient.post<LocationData>("/locations", data),

  // Update existing location
  updateLocation: (id: number, data: UpdateLocationData) =>
    apiClient.put<LocationData>(`/locations/${id}`, data),

  // Delete location
  deleteLocation: (id: number) => apiClient.delete<void>(`/locations/${id}`),
};
