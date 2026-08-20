"use client";

import { DataTable } from "@/components/table/data-table";
import { eventColumns } from "@/components/events/columns";
import type { EventItem } from "@/types/event";

interface EventTableProps {
  events: EventItem[];
  isLoading: boolean;
  onEdit: (event: EventItem) => void;
  onDelete: (id: number) => void;
}

export function EventTable({ events, isLoading, onEdit, onDelete }: EventTableProps) {
  return (
    <DataTable
      columns={eventColumns(onEdit, onDelete)}
      data={events}
      isLoading={isLoading}
      emptyMessage="No events found. Create your first event to get started."
    />
  );
}
