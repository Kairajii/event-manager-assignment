import type { EventFormInput, EventItem, Participant } from "@/types/event";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export class ApiRequestError extends Error {
  status: number;
  errors?: { path: string; message: string }[];

  constructor(message: string, status: number, errors?: { path: string; message: string }[]) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiRequestError(body?.message || "Something went wrong", res.status, body?.errors);
  }

  return body?.data as T;
}

export interface EventFilters {
  search?: string;
  location?: string;
  sort?: "asc" | "desc";
}

export const eventsApi = {
  list: (filters: EventFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.location) params.set("location", filters.location);
    if (filters.sort) params.set("sort", filters.sort);
    const qs = params.toString();
    return request<EventItem[]>(`/api/events${qs ? `?${qs}` : ""}`);
  },

  get: (id: number | string) => request<EventItem>(`/api/events/${id}`),

  create: (input: Partial<EventFormInput>) =>
    request<EventItem>("/api/events", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  update: (id: number | string, input: Partial<EventFormInput>) =>
    request<EventItem>(`/api/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    }),

  remove: (id: number | string) =>
    request<{ message: string }>(`/api/events/${id}`, {
      method: "DELETE",
    }),

  participants: (id: number | string) => request<Participant[]>(`/api/events/${id}/participants`),

  apply: (id: number | string, input: { name: string; email: string }) =>
    request<Participant>(`/api/events/${id}/apply`, {
      method: "POST",
      body: JSON.stringify(input),
    }),

  cancelParticipant: (eventId: number | string, participantId: number | string, reason: string) =>
    request<Participant>(`/api/events/${eventId}/participants/${participantId}/cancel`, {
      method: "PUT",
      body: JSON.stringify({ reason }),
    }),
};
