"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { eventsApi } from "@/lib/api";
import type { EventItem, Participant } from "@/types/event";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CancelParticipantDialog } from "@/components/events/cancel-participant-dialog";

const formatDateTime = (date: string) => new Date(date).toLocaleString();

export default function OwnerDashboardPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Participant | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [eventData, participantData] = await Promise.all([
        eventsApi.get(params.id),
        eventsApi.participants(params.id),
      ]);
      setEvent(eventData);
      setParticipants(participantData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    load();
  }, [load]);

  const registered = participants.filter((p) => p.status === "registered");
  const cancelled = participants.filter((p) => p.status === "cancelled");

  if (loading) return <p className="text-muted-foreground text-sm">Loading dashboard...</p>;
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

      <div>
        <h1 className="text-2xl font-semibold">{event.name} — Participants</h1>
        <p className="text-muted-foreground text-sm">
          {registered.length} registered &middot; {cancelled.length} cancelled
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registered participants</CardTitle>
        </CardHeader>
        <CardContent>
          {registered.length === 0 ? (
            <p className="text-muted-foreground text-sm">No one has registered yet.</p>
          ) : (
            <ul className="divide-border divide-y">
              {registered.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-muted-foreground text-xs">{p.email}</p>
                    <p className="text-muted-foreground text-xs">Registered {formatDateTime(p.registered_at)}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setCancelTarget(p)}>
                    Cancel registration
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {cancelled.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Cancelled registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-border divide-y">
              {cancelled.map((p) => (
                <li key={p.id} className="space-y-1 py-3">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{p.name}</p>
                    <Badge variant="destructive">Cancelled</Badge>
                  </div>
                  <p className="text-muted-foreground text-xs">{p.email}</p>
                  {p.cancellation_reason && (
                    <p className="text-muted-foreground text-xs">Reason: {p.cancellation_reason}</p>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {cancelTarget && (
        <CancelParticipantDialog
          participantName={cancelTarget.name}
          onCancel={() => setCancelTarget(null)}
          onConfirm={async (reason) => {
            await eventsApi.cancelParticipant(params.id, cancelTarget.id, reason);
            setCancelTarget(null);
            await load();
          }}
        />
      )}
    </div>
  );
}
