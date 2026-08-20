"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { eventsApi } from "@/lib/api";
import type { EventItem } from "@/types/event";
import { EventForm } from "@/components/events/event-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditEventPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    eventsApi
      .get(params.id)
      .then(setEvent)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load event"))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <p className="text-muted-foreground text-sm">Loading event...</p>;
  if (error || !event) return <p className="text-destructive text-sm">{error || "Event not found"}</p>;

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.push(`/events/${params.id}`)}
        className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to event
      </button>

      <Card>
        <CardHeader>
          <CardTitle>Edit event</CardTitle>
        </CardHeader>
        <CardContent>
          <EventForm
            submitLabel="Save changes"
            initialValues={{
              name: event.name,
              description: event.description ?? "",
              date: event.date.slice(0, 10),
              location: event.location ?? "",
              owner_name: event.owner_name,
              owner_email: event.owner_email ?? "",
            }}
            onSubmit={async (input) => {
              await eventsApi.update(params.id, input);
              router.push(`/events/${params.id}`);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
