"use client";

import { Sheet, SheetBody, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { EventForm } from "@/components/events/event-form";
import type { EventFormInput, EventItem } from "@/types/event";

interface EventSheetProps {
  open: boolean;
  event: EventItem | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: Partial<EventFormInput>) => Promise<void>;
}

export function EventSheet({
  open,
  event,
  onOpenChange,
  onSubmit,
}: EventSheetProps) {
  const isEditing = Boolean(event);

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
    >
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>
            {isEditing ? "Edit Event" : "Create a new event"}
          </SheetTitle>

          <SheetDescription>
            {isEditing
              ? "Update the details for this event."
              : "Fill in the details to add a new event."}
          </SheetDescription>
        </SheetHeader>

        <SheetBody>
          <EventForm
            key={event?.id ?? "create"}
            initialValues={
              event
                ? {
                    name: event.name,
                    description: event.description ?? "",
                    date: event.date.slice(0, 10),
                    location: event.location ?? "",
                    owner_name: event.owner_name ?? "",
                    owner_email: event.owner_email ?? "",
                  }
                : undefined
            }
            submitLabel={
              isEditing ? "Save Changes" : "Create Event"
            }
            onSubmit={onSubmit}
          />
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}