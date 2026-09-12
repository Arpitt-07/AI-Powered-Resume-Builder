import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { LoginBody, RegisterBody } from "@/types/user.types";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: LoginBody) => api.post("/auth/login", body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: RegisterBody) => api.post("/auth/register", body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.post("/auth/logout", {}),
    onSuccess: () => {
      queryClient.setQueryData(["auth-user"], null);
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
    },
  });
}
