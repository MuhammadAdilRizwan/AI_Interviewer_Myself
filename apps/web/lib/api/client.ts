import type { ProblemDetails } from "@/lib/types";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");

export class ApiError extends Error {
  readonly problem: ProblemDetails;

  constructor(problem: ProblemDetails) {
    super(problem.detail);
    this.name = "ApiError";
    this.problem = problem;
  }
}

export function isApiConfigured() {
  return Boolean(apiBaseUrl);
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });

  if (!response.ok) {
    const fallback: ProblemDetails = {
      type: "https://api.example.com/errors/request-failed",
      title: "Request failed",
      status: response.status,
      detail: `The request failed with status ${response.status}.`,
      requestId: response.headers.get("x-request-id") ?? "unknown",
    };

    let problem = fallback;
    try {
      const parsed = (await response.json()) as Partial<ProblemDetails>;
      if (parsed.detail && parsed.title && parsed.status) {
        problem = { ...fallback, ...parsed } as ProblemDetails;
      }
    } catch {
      // Keep the safe fallback when the server did not return JSON.
    }

    throw new ApiError(problem);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
