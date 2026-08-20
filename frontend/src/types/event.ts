export interface EventItem {
  id: number;
  name: string;
  description: string | null;
  date: string;
  location: string | null;
  owner_name: string;
  owner_email: string | null;
  created_at: string;
}

export type EventFormInput = {
  name: string;
  description: string;
  date: string;
  location: string;
  owner_name: string;
  owner_email: string;
};

export interface Participant {
  id: number;
  event_id: number;
  name: string;
  email: string;
  status: "registered" | "cancelled";
  cancellation_reason: string | null;
  registered_at: string;
  cancelled_at: string | null;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: { path: string; message: string }[];
}
