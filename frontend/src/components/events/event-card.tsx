"use client";

import Link from "next/link";
import { CalendarDays, MapPin, Trash2, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { EventItem } from "@/types/event";

interface EventCardProps {
  event: EventItem;
  onDelete: (id: number) => void;
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

export function EventCard({ event, onDelete }: EventCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-2">
        <div>
          <CardTitle>
            <Link href={`/events/${event.id}`} className="hover:underline">
              {event.name}
            </Link>
          </CardTitle>
          <p className="text-muted-foreground text-xs">#{event.id}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Delete event"
          onClick={() => onDelete(event.id)}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {event.description && <p className="text-muted-foreground line-clamp-2 text-sm">{event.description}</p>}
        <div className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <span className="flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDate(event.date)}
          </span>
          {event.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {event.location}
            </span>
          )}
        </div>
        <div className="flex gap-3 pt-2">
          <Link href={`/events/${event.id}`} className="text-foreground text-sm font-medium hover:underline">
            View details
          </Link>
          <Link
            href={`/events/${event.id}/dashboard`}
            className="flex items-center gap-1 text-foreground text-sm font-medium hover:underline"
          >
            <Users className="h-3.5 w-3.5" />
            Participants
          </Link>
          <Link href={`/events/${event.id}/edit`} className="text-foreground text-sm font-medium hover:underline">
            Edit
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
