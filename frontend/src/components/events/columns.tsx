import Link from "next/link";
import type { ColumnDef, FilterFn } from "@tanstack/react-table";
import { Pencil, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EventItem } from "@/types/event";

const formatDate = (date: string) => {
  const [year, month, day] = date.slice(0, 10).split("-");

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
  ).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const dateFilter: FilterFn<EventItem> = (
  row,
  columnId,
  filterValue,
) => {
  // No filter applied
  if (!filterValue) {
    return true;
  }

  const rowValue = row.getValue<string>(columnId);

  // Event doesn't have a date
  if (!rowValue) {
    return false;
  }

  // Exact date match
  return rowValue.slice(0, 10) === String(filterValue);
};


export const eventColumns = (onEdit: (event: EventItem) => void, onDelete: (id: number) => void): ColumnDef<EventItem>[] => [
  {
    accessorKey: "name",
    header: "Name",
    meta: { filterable: true,filterType: "text", },
    cell: ({ row }) => (
      <Link href={`/events/${row.original.id}`} className="text-foreground font-medium hover:underline">
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    filterFn: dateFilter,
    meta: {
      filterable: true,
      filterType: "date",
    },
    cell: ({ row }) => formatDate(row.original.date),
  },
  {
    accessorKey: "location",
    header: "Location",
    meta: { filterable: true,filterType: "text", },
    cell: ({ row }) => row.original.location || <span className="text-muted-foreground">—</span>,
  },
  {
    accessorKey: "owner_name",
    header: "Owner",
    meta: { filterable: true, filterType: "text", },
    cell: ({ row }) => row.original.owner_name || <span className="text-muted-foreground">—</span>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" aria-label="Participants" asChild>
          <Link href={`/events/${row.original.id}/dashboard`}>
            <Users className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="ghost" size="icon" aria-label="Edit event" onClick={() => onEdit(row.original)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Delete event"
          onClick={() => onDelete(row.original.id)}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
