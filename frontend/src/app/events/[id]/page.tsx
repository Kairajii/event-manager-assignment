"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { ArrowLeft, CalendarDays, MapPin, User } from "lucide-react";
import { eventsApi } from "@/lib/api";
import type { EventItem } from "@/types/event";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const applySchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Enter a valid email"),
});

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

export default function EventDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [applyError, setApplyError] = useState<string | null>(null);
  const [applySuccess, setApplySuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    eventsApi
      .get(params.id)
      .then(setEvent)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load event"))
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleApply = async (e: FormEvent) => {
    e.preventDefault();
    setApplyError(null);
    setApplySuccess(false);

    const parsed = applySchema.safeParse({ name, email });
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) errors[issue.path[0] as string] = issue.message;
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    setSubmitting(true);
    try {
      await eventsApi.apply(params.id, parsed.data);
      setApplySuccess(true);
      setName("");
      setEmail("");
    } catch (err) {
      setApplyError(err instanceof Error ? err.message : "Failed to register");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-muted-foreground text-sm">Loading event...</p>;
  if (error || !event) return <p className="text-destructive text-sm">{error || "Event not found"}</p>;

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.push("/")}
        className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to events
      </button>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{event.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {event.description && <p className="text-muted-foreground text-sm">{event.description}</p>}
          <div className="text-muted-foreground flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              {formatDate(event.date)}
            </span>
            {event.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {event.location}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              Hosted by {event.owner_name}
            </span>
          </div>
          <div className="flex gap-3 pt-2 text-sm">
            <Link href={`/events/${event.id}/edit`} className="font-medium hover:underline">
              Edit event
            </Link>
            <Link href={`/events/${event.id}/dashboard`} className="font-medium hover:underline">
              Owner dashboard
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Apply to this event</CardTitle>
        </CardHeader>
        <CardContent>
          {applySuccess ? (
            <p className="text-sm text-emerald-600 dark:text-emerald-400">You&apos;re registered! We look forward to seeing you there.</p>
          ) : (
            <form onSubmit={handleApply} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="apply-name">Your Name *</Label>
                  <Input id="apply-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
                  {fieldErrors.name && <p className="text-destructive text-xs">{fieldErrors.name}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="apply-email">Your Email *</Label>
                  <Input
                    id="apply-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                  />
                  {fieldErrors.email && <p className="text-destructive text-xs">{fieldErrors.email}</p>}
                </div>
              </div>
              {applyError && <p className="text-destructive text-sm">{applyError}</p>}
              <Button type="submit" disabled={submitting}>
                {submitting ? "Registering..." : "Register"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
