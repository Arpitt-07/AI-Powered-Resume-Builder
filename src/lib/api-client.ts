import { ApiResponse } from "@/types/api.types";

export class ApiError extends Error {
  constructor(public message: string, public status: number, public data?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "/api";

  const config: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  };

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, config);

    if (response.status === 401) {
      if (typeof window !== "undefined") {
        const isAuthPage = window.location.pathname.startsWith('/login') || window.location.pathname.startsWith('/register');
        if (!isAuthPage) {
          window.location.href = "/login";
        }
      }
      throw new ApiError("Unauthorized", 401);
    }

    const result: ApiResponse<T> = await response.json();

    if (!result.success) {
      throw new ApiError(result.message || "An unexpected error occurred", response.status, result.error);
    }

    return result.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    const message = error instanceof Error ? error.message : "Network error occurred";
    throw new ApiError(message, 500);
  }
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    apiClient<T>(endpoint, { ...options, method: "GET" }),

  post: <T, TBody>(endpoint: string, body: TBody, options?: RequestInit) =>
    apiClient<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body)
    }),

  patch: <T, TBody>(endpoint: string, body: TBody, options?: RequestInit) =>
    apiClient<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(body)
    }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    apiClient<T>(endpoint, { ...options, method: "DELETE" }),
};
