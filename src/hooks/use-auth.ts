import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { AuthResponse } from "@/types/user.types";

export function useAuth() {
  const { data, isLoading, error, refetch } = useQuery<AuthResponse>({
    queryKey: ["auth-user"],
    queryFn: () => api.get<AuthResponse>("/auth/me"),
    retry: false,
    staleTime: 1000 * 60 * 10,
  });

  return {
    user: data?.user,
    isAuthenticated: !!data,
    isLoading,
    error,
    refetch,
  };
}
