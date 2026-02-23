import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { lokasiAPI } from "../api/lokasi.api";
import type {
  CreateLocationData,
  UpdateLocationData,
} from "../types/lokasi.types";

// Get all locations
export function useLokasiData() {
  return useQuery({
    queryKey: ["locations"],
    queryFn: () => lokasiAPI.getLocations(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Get single location
export function useLokasi(id: number) {
  return useQuery({
    queryKey: ["locations", id],
    queryFn: () => lokasiAPI.getLocation(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Create location mutation
export function useCreateLokasi() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLocationData) => lokasiAPI.createLocation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });
}

// Update location mutation
export function useUpdateLokasi() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateLocationData }) =>
      lokasiAPI.updateLocation(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      queryClient.invalidateQueries({ queryKey: ["locations", variables.id] });
    },
  });
}

// Delete location mutation
export function useDeleteLokasi() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => lokasiAPI.deleteLocation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });
}
