import { useQuery } from "@tanstack/react-query";
// import { permintaanAPI } from "../api/permintaan.api";
import { dummyRequestData } from "../data/dummy-data";

export function usePermintaanData() {
  // UNCOMMENT THIS WHEN API IS READY:
  // return useQuery({
  //   queryKey: ["permintaan"],
  //   queryFn: () => permintaanAPI.getRequests(),
  //   staleTime: 5 * 60 * 1000, // 5 minutes
  //   gcTime: 10 * 60 * 1000, // 10 minutes
  // });

  // TEMPORARY: Using dummy data
  return useQuery({
    queryKey: ["permintaan"],
    queryFn: async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      return dummyRequestData;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
