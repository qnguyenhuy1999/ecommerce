'use client'

import React from 'react'

import { cn } from '../../lib/utils'

/* --- Table Root ----------------------------------------------------------- */
type TableProps = React.TableHTMLAttributes<HTMLTableElement> & {
  /** Class applied to the scroll container wrapping the table. */
  containerClassName?: string
  /** Props applied to the scroll container wrapping the table. */
  containerProps?: React.HTMLAttributes<HTMLDivElement>
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, containerClassName, containerProps, ...props }, ref) => (
    <div
      {...containerProps}
      className={cn('relative w-full overflow-auto', containerProps?.className, containerClassName)}
    >
      <table
        ref={ref}
        className={cn(
          'w-full caption-bottom text-sm [border-collapse:separate] [border-spacing:0]',
          className,
        )}
        {...props}
      />
    </div>
  ),
)
Table.displayName = 'Table'

/* --- Table Header --------------------------------------------------------- */
const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      '[&_tr]:border-b [&_tr]:border-border/70 bg-[var(--surface-elevated)]',
      className,
    )}
    {...props}
  />
))
TableHeader.displayName = 'TableHeader'

/* --- Table Body ----------------------------------------------------------- */
const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
))
TableBody.displayName = 'TableBody'

/* --- Table Footer --------------------------------------------------------- */
const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      'border-t border-border/70 bg-muted/40 font-medium [&>tr]:last:border-b-0',
      className,
    )}
    {...props}
  />
))
TableFooter.displayName = 'TableFooter'

/* --- Table Row ------------------------------------------------------------ */
const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'border-b border-border/70 transition-colors duration-[var(--motion-fast)]',
        'hover:bg-muted/40',
        'data-[state=selected]:bg-[var(--state-selected)]',
        className,
      )}
      {...props}
    />
  ),
)
TableRow.displayName = 'TableRow'

/* --- Table Head ----------------------------------------------------------- */
const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-12 px-4 text-left align-middle font-semibold text-muted-foreground uppercase tracking-[0.05em] text-[var(--text-micro)]',
      '[&:has([role=checkbox])]:pr-0',
      className,
    )}
    {...props}
  />
))
TableHead.displayName = 'TableHead'

/* --- Table Cell ----------------------------------------------------------- */
const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn('px-4 py-3.5 align-middle [&:has([role=checkbox])]:pr-0', className)}
    {...props}
  />
))
TableCell.displayName = 'TableCell'

/* --- Table Caption -------------------------------------------------------- */
const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption ref={ref} className={cn('mt-4 text-sm text-muted-foreground', className)} {...props} />
))
TableCaption.displayName = 'TableCaption'

export { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption }
