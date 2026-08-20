"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { eventsApi } from "@/lib/api";
import type { EventFormInput, EventItem } from "@/types/event";
import { EventTable } from "@/components/events/event-table";
import { EventForm } from "@/components/events/event-form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetBody, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { EventSheet } from "@/components/events/event-sheet";

export default function HomePage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await eventsApi.list();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load events");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const openCreateSheet = () => {
    setEditingEvent(null);
    setSheetOpen(true);
  };

  const openEditSheet = (event: EventItem) => {
    setEditingEvent(event);
    setSheetOpen(true);
  };

  const handleSubmit = async (input: Partial<EventFormInput>) => {
    if (editingEvent) {
      await eventsApi.update(editingEvent.id, input);
    } else {
      await eventsApi.create(input);
    }
    setSheetOpen(false);
    setEditingEvent(null);
    await loadEvents();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    const previous = events;
    setEvents((prev) => prev.filter((event) => event.id !== id));
    try {
      await eventsApi.remove(id);
    } catch (err) {
      setEvents(previous);
      alert(err instanceof Error ? err.message : "Failed to delete event");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Events</h1>
          <p className="text-muted-foreground text-sm">Create, browse, and manage your events.</p>
        </div>
        <Button onClick={openCreateSheet}>
          <Plus className="h-4 w-4" />
          New Event
        </Button>
      </div>

      {/* {loading && events.length === 0 && <p className="text-muted-foreground text-sm">Loading events...</p>}
      {error && <p className="text-destructive text-sm">{error}</p>} */}

      <EventTable events={events} isLoading={loading} onEdit={openEditSheet} onDelete={handleDelete} />

      <EventSheet
        open={sheetOpen}
        event={editingEvent}
        onOpenChange={(open) => {
          setSheetOpen(open);

          if (!open) {
            setEditingEvent(null);
          }
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
