import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { IResume } from "@/types/resume.types";

export function useGetResumes() {
  return useQuery({
    queryKey: ["resumes"],
    queryFn: () => api.get<{ resumes: IResume[], total: number, page: number, limit: number }>("/resume"),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.post<IResume>("/resume/create", {}),
    onSuccess: (newResume) => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      queryClient.invalidateQueries({ queryKey: ["resume", newResume._id] });
    },
  });
}

export function useResume(id: string) {
  return useQuery({
    queryKey: ["resume", id],
    queryFn: () => api.get<Partial<IResume>>(`/resume/${id}`),
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IResume> }) =>
      api.patch<Partial<IResume>>(`/resume/${id}`, data),
    onSuccess: (updatedResume) => {
      if (updatedResume._id) {
        queryClient.setQueryData(["resume", updatedResume._id], updatedResume);
      }
    },
  });
}

export function useDeleteResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/resume/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
  });
}
