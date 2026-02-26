import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersAPI } from "../api/pengguna.api";

export function useUsersData() {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => usersAPI.getUsers(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof usersAPI.createUser>[0]) =>
      usersAPI.createUser(data),
    onSuccess: async () => {
      await qc.refetchQueries({ queryKey: ["users"] });
    },
  });
}

export function useUpdateUser() {
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Parameters<typeof usersAPI.updateUser>[1];
    }) => usersAPI.updateUser(id, data),
  });
}

export function useDeleteUser() {
  return useMutation({
    mutationFn: (id: number) => usersAPI.deleteUser(id),
  });
}
