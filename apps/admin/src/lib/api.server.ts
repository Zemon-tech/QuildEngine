/**
 * Backend API proxy utility for the admin BFF.
 * Exact mirror of apps/web/src/lib/api.server.ts.
 */
import { getEnv } from "./env.server";
import { getAccessToken } from "./session.server";

export interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  public?: boolean;
}

export interface ApiError {
  status: number;
  message: string;
  code?: string;
}

/**
 * Make a typed request to the dedicated backend.
 * Injects the admin's auth token automatically from cookies.
 */
export async function backendFetch<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { BACKEND_URL } = getEnv();
  const {
    method = "GET",
    body,
    headers = {},
    public: isPublic = false,
  } = options;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...headers,
  };

  if (!isPublic) {
    const token = getAccessToken();
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }
  }

  const url = `${BACKEND_URL}${path}`;

  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const apiError: ApiError = {
      status: response.status,
      message:
        (errorBody as Record<string, string>).message ??
        `Backend responded with ${response.status}`,
      code: (errorBody as Record<string, string>).code,
    };
    throw apiError;
  }

  return response.json() as Promise<T>;
}

/**
 * Batch multiple backend requests in parallel.
 */
export function backendBatch<T extends readonly Promise<unknown>[]>(
  ...requests: T
): Promise<{ [K in keyof T]: Awaited<T[K]> }> {
  return Promise.all(requests) as Promise<{ [K in keyof T]: Awaited<T[K]> }>;
}
