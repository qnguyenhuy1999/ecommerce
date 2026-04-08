"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { Pagination } from "@ecom/ui";

type SortDirection = "asc" | "desc" | null;

interface ColumnDef<T> {
  key: keyof T | string;
  header: string;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T extends Record<string, unknown> = Record<string, unknown>>
  extends React.HTMLAttributes<HTMLDivElement> {
  columns: ColumnDef<T>[];
  data: T[];
  keyField?: keyof T;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  selectable?: boolean;
  selectedKeys?: (string | number)[];
  onSelectionChange?: (keys: (string | number)[]) => void;
  onSortChange?: (key: string, direction: SortDirection) => void;
  sortKey?: string;
  sortDirection?: SortDirection;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

function DataTable<T extends Record<string, unknown> = Record<string, unknown>>({
  columns,
  data,
  keyField = "id" as keyof T,
  page = 1,
  totalPages = 1,
  onPageChange,
  pageSize,
  selectable = false,
  selectedKeys = [],
  onSelectionChange,
  onSortChange,
  sortKey,
  sortDirection,
  loading = false,
  emptyMessage = "No data available",
  className,
  ...props
}: DataTableProps<T>) {
  const allSelected =
    selectable && data.length > 0 && data.every((row) => selectedKeys.includes(row[keyField] as string | number));
  const someSelected =
    selectable && !allSelected && data.some((row) => selectedKeys.includes(row[keyField] as string | number));

  function toggleAll() {
    if (!selectable || !onSelectionChange) return;
    if (allSelected) {
      const current = new Set(selectedKeys);
      data.forEach((row) => current.delete(row[keyField] as string | number));
      onSelectionChange(Array.from(current));
    } else {
      const current = new Set(selectedKeys);
      data.forEach((row) => current.add(row[keyField] as string | number));
      onSelectionChange(Array.from(current));
    }
  }

  function toggleRow(key: string | number) {
    if (!selectable || !onSelectionChange) return;
    const current = selectedKeys;
    if (current.includes(key)) {
      onSelectionChange(current.filter((k) => k !== key));
    } else {
      onSelectionChange([...current, key]);
    }
  }

  function handleSort(key: string) {
    if (!onSortChange) return;
    const next: SortDirection =
      sortKey === key
        ? sortDirection === "asc"
          ? "desc"
          : sortDirection === "desc"
            ? null
            : "asc"
        : "asc";
    onSortChange(key, next);
  }

  return (
    <div className={cn("flex flex-col", className)} {...props}>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              {selectable && (
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected;
                    }}
                    onChange={toggleAll}
                    className="rounded border-input"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key as string}
                  className={cn(
                    "px-4 py-3 text-left font-medium text-muted-foreground",
                    col.sortable && "cursor-pointer select-none hover:text-foreground",
                    col.className
                  )}
                  onClick={col.sortable ? () => handleSort(col.key as string) : undefined}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && sortKey === col.key && (
                      <span className="text-xs">{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: pageSize || 5 }).map((_, i) => (
                <tr key={i} className="border-b">
                  {selectable && <td className="px-4 py-3"><div className="h-4 w-4 bg-muted rounded animate-pulse" /></td>}
                  {columns.map((col) => (
                    <td key={col.key as string} className="px-4 py-3">
                      <div className="h-4 bg-muted rounded animate-pulse" style={{ width: "60%" }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => {
                const rowKey = row[keyField] as string | number;
                const isSelected = selectedKeys.includes(rowKey);
                return (
                  <tr
                    key={rowKey as string}
                    className={cn(
                      "border-b transition-colors",
                      isSelected ? "bg-muted/50" : "hover:bg-muted/30"
                    )}
                  >
                    {selectable && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={!!isSelected}
                          onChange={() => toggleRow(rowKey)}
                          className="rounded border-input"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key as string} className={cn("px-4 py-3", col.className)}>
                        {col.cell ? col.cell(row) : (row[col.key as keyof T] as React.ReactNode)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {onPageChange && totalPages > 1 && (
        <div className="mt-4 flex justify-end">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}

export { DataTable };
export type { DataTableProps, ColumnDef, SortDirection };
