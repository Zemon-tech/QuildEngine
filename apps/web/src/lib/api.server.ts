/**
 * Backend API proxy utility.
 *
 * This is the BFF's core responsibility: aggregate and forward requests
 * to your dedicated backend with proper auth token injection.
 *
 * All backend communication goes through this module so that:
 * - Auth tokens are injected automatically (never exposed to client)
 * - Multiple backend calls can be batched
 * - Errors are normalized before reaching the client
 */
import { getEnv } from "./env.server";
import { getAccessToken } from "./session.server";

export interface ApiRequestOptions {
  /** HTTP method. Defaults to GET */
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /** Request body (will be JSON-serialized) */
  body?: unknown;
  /** Additional headers to send */
  headers?: Record<string, string>;
  /**
   * If true, skip auth token injection.
   * Useful for public endpoints that don't require auth.
   */
  public?: boolean;
}

export interface ApiError {
  status: number;
  message: string;
  code?: string;
}

/**
 * Make a typed request to your dedicated backend.
 *
 * @param path - API path relative to BACKEND_URL (e.g. "/api/dashboard/stats")
 * @param options - Request configuration
 * @returns Parsed JSON response
 * @throws ApiError if the backend returns a non-2xx status
 *
 * @example
 * ```ts
 * const stats = await backendFetch<DashboardStats>("/api/dashboard/stats");
 * ```
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

  // Inject auth token from cookie (the BFF's primary job)
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
 * Useful for aggregating data for a single page load (SSR optimization).
 *
 * @example
 * ```ts
 * const [stats, progress, events] = await backendBatch(
 *   backendFetch<Stats>("/api/dashboard/stats"),
 *   backendFetch<Progress>("/api/dashboard/progress"),
 *   backendFetch<Event[]>("/api/dashboard/events"),
 * );
 * ```
 */
export function backendBatch<T extends readonly Promise<unknown>[]>(
  ...requests: T
): Promise<{ [K in keyof T]: Awaited<T[K]> }> {
  return Promise.all(requests) as Promise<{ [K in keyof T]: Awaited<T[K]> }>;
}
