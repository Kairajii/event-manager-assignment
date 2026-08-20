"use client";

import { useState, FormEvent } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { EventFormInput } from "@/types/event";

const eventSchema = z.object({
  name: z.string().trim().min(1, "Event name is required"),
  description: z.string().trim().optional(),
  date: z.string().min(1, "Date is required"),
  location: z.string().trim().optional(),
  owner_name: z.string().trim().optional(),
  owner_email: z.string().trim().email("Enter a valid email").optional().or(z.literal("")),
});

interface EventFormProps {
  initialValues?: Partial<EventFormInput>;
  submitLabel?: string;
  onSubmit: (input: Partial<EventFormInput>) => Promise<void>;
}

const emptyValues: EventFormInput = {
  name: "",
  description: "",
  date: "",
  location: "",
  owner_name: "",
  owner_email: "",
};

const today = new Date();

const minDate = [
  today.getFullYear(),
  String(today.getMonth() + 1).padStart(2, "0"),
  String(today.getDate()).padStart(2, "0"),
].join("-");

export function EventForm({ initialValues, submitLabel = "Create Event", onSubmit }: EventFormProps) {
  const [values, setValues] = useState<EventFormInput>({ ...emptyValues, ...initialValues });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: keyof EventFormInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const parsed = eventSchema.safeParse(values);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        errors[issue.path[0] as string] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    setSubmitting(true);
    try {
      await onSubmit(parsed.data);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Event Name *</Label>
        <Input id="name" value={values.name} onChange={handleChange("name")} placeholder="Annual Tech Summit" />
        {fieldErrors.name && <p className="text-destructive text-xs">{fieldErrors.name}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={values.description}
          onChange={handleChange("description")}
          placeholder="What is this event about?"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="date">Date *</Label>
          <Input id="date" type="date" min={minDate} value={values.date} onChange={handleChange("date")} />
          {fieldErrors.date && <p className="text-destructive text-xs">{fieldErrors.date}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="location">Location</Label>
          <Input id="location" value={values.location} onChange={handleChange("location")} placeholder="San Francisco, CA" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="owner_name">Owner Name</Label>
          <Input id="owner_name" value={values.owner_name} onChange={handleChange("owner_name")} placeholder="Jane Doe" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="owner_email">Owner Email</Label>
          <Input
            id="owner_email"
            type="email"
            value={values.owner_email}
            onChange={handleChange("owner_email")}
            placeholder="jane@example.com"
          />
          {fieldErrors.owner_email && <p className="text-destructive text-xs">{fieldErrors.owner_email}</p>}
        </div>
      </div>

      {formError && <p className="text-destructive text-sm">{formError}</p>}

      <Button type="submit" disabled={submitting}>
        {submitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
