import { z } from "zod";

export const createEventSchema = z.object({
  name: z.string().trim().min(1, "Event name is required").max(200),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  date: z.string().refine((val) => !Number.isNaN(Date.parse(val)), "Date must be a valid date (YYYY-MM-DD)"),
  location: z.string().trim().max(200).optional().or(z.literal("")),
  owner_name: z.string().trim().max(200).optional(),
  owner_email: z.string().trim().email().optional().or(z.literal("")),
});

export const updateEventSchema = createEventSchema.partial();

export const applyToEventSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  email: z.string().trim().email("A valid email is required"),
});

export const cancelParticipantSchema = z.object({
  reason: z.string().trim().min(1, "Cancellation reason is required").max(500),
});
