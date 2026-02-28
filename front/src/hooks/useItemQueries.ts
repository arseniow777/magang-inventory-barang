import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

// ============ QUERIES ============

export interface Location {
  id: number;
  building_name: string;
  floor: number;
  address: string;
}

export const useLocations = () => {
  return useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${API_URL}/locations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch locations");
      const data = await response.json();
      return data.data as Location[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export interface User {
  id: number;
  name: string;
  username: string;
  role: string;
  employee_id: string;
}

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      return data.data as User[];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const usePICUsers = () => {
  const { data, isLoading, error } = useUsers();
  return {
    data: data?.filter((user) => user.role === "pic") || [],
    isLoading,
    error,
  };
};

// ============ MUTATIONS ============

export interface CreateItemPayload {
  name: string;
  quantity: number;
  category: string;
  procurement_year: string;
  location_id: string;
  pic_id: string;
  photos: File[];
}

export const useCreateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateItemPayload) => {
      const formDataObj = new FormData();
      formDataObj.append("name", payload.name);
      formDataObj.append("quantity", payload.quantity.toString());
      formDataObj.append("category", payload.category);
      formDataObj.append("procurement_year", payload.procurement_year);
      formDataObj.append("location_id", payload.location_id);
      if (payload.pic_id) formDataObj.append("pic_id", payload.pic_id);

      // Add photos
      payload.photos.forEach((photo) => {
        formDataObj.append("photos", photo);
      });

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${API_URL}/items`, {
        method: "POST",
        body: formDataObj,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create item");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
};
