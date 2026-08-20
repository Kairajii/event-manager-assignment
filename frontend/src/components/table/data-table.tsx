"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type FilterFn,
  type SortingState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    filterable?: boolean;
    filterType?: "text" | "date";
  }
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  emptyMessage?: string;
}

const dateFilter: FilterFn<any> = (row, columnId, filterValue) => {
  if (!filterValue) {
    return true;
  }

  const rowValue = row.getValue(columnId);

  if (!rowValue) {
    return false;
  }

  return String(rowValue).slice(0, 10) === filterValue;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  emptyMessage = "No results found.",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([]);

  const filterFns = React.useMemo(
    () => ({
      dateFilter,
    }),
    [],
  );

  const table = useReactTable({
    data,
    columns,

    state: {
      sorting,
      columnFilters,
    },

    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,

    filterFns,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const hasFilterableColumn = table
    .getAllLeafColumns()
    .some((column) => column.columnDef.meta?.filterable);

  return (
    <div className="bg-card w-full overflow-hidden rounded-lg border">
      <Table>
        <TableHeader className="bg-muted/50">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}

          {hasFilterableColumn && (
            <TableRow className="hover:bg-transparent">
              {table.getFlatHeaders().map((header) => {
                const meta = header.column.columnDef.meta;

                if (!meta?.filterable) {
                  return (
                    <TableHead
                      key={`${header.id}-filter`}
                      className="py-2"
                    />
                  );
                }

                const filterValue =
                  (header.column.getFilterValue() as string) ?? "";

                return (
                  <TableHead
                    key={`${header.id}-filter`}
                    className="py-2"
                  >
                    <Input
                      type={
                        meta.filterType === "date"
                          ? "date"
                          : "text"
                      }
                      value={filterValue}
                      onChange={(e) =>
                        header.column.setFilterValue(
                          e.target.value,
                        )
                      }
                      placeholder={
                        meta.filterType === "date"
                          ? undefined
                          : `Search ${
                              typeof header.column
                                .columnDef.header === "string"
                                ? header.column.columnDef.header.toLowerCase()
                                : ""
                            }...`
                      }
                      className="h-8 text-xs"
                    />
                  </TableHead>
                );
              })}
            </TableRow>
          )}
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-muted-foreground h-24 text-center"
              >
                Loading...
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext(),
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-muted-foreground h-24 text-center"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}