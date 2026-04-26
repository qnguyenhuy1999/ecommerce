import React from 'react'

import { ChevronRight } from 'lucide-react'

import { cn } from '@ecom/ui'

import { PriceDisplay } from '../../atoms/PriceDisplay/PriceDisplay'
import { OrderStatusBadge } from '../../atoms/OrderStatusBadge/OrderStatusBadge'
import type { OrderStatus } from '../../atoms/OrderStatusBadge/OrderStatusBadge'
import { OrderActions } from '../OrderActions/OrderActions'

export interface OrderCardItem {
  image: string
  title: string
}

export interface OrderCardProps {
  orderNumber: string
  date: string
  status: OrderStatus
  items: OrderCardItem[]
  itemCount: number
  total: number
  /** View order detail. Whole card is clickable when this handler is provided. */
  onView?: () => void
  onTrack?: () => void
  onReorder?: () => void
  onCancel?: () => void
  onChangeAddress?: () => void
  onWriteReview?: () => void
  onDownloadInvoice?: () => void
  className?: string
}

/**
 * Structured 4-row order card for high-UX transaction dashboard.
 * 1. Header (ID, Status, Total)
 * 2. Metadata (Date, item count)
 * 3. Thumbnails
 * 4. Actions
 */
function OrderCard({
  orderNumber,
  date,
  status,
  items,
  itemCount,
  total,
  onView,
  onTrack,
  onReorder,
  onCancel,
  onChangeAddress,
  onWriteReview,
  onDownloadInvoice,
  className,
}: OrderCardProps) {
  // Show up to 4 items in the overlap stack
  const previewItems = items.slice(0, 4)
  const remaining = Math.max(0, itemCount - previewItems.length)

  const interactive = Boolean(onView)

  const handleRowKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onView) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onView()
    }
  }

  const interactiveProps = interactive
    ? {
        role: 'button' as const,
        tabIndex: 0,
        onClick: () => onView?.(),
        onKeyDown: handleRowKeyDown,
      }
    : {}

  return (
    <div
      {...interactiveProps}
      className={cn(
        'group relative flex flex-col',
        'rounded-2xl border border-[var(--border-subtle)]',
        'bg-[var(--surface-base)]',
        'p-5 sm:p-6',
        'transition-all duration-200',
        interactive &&
          cn(
            'cursor-pointer hover:bg-[var(--surface-muted)]/40 hover:shadow-md',
            'focus-visible:outline-none focus-visible:ring-[var(--focus-ring-width)] focus-visible:ring-[var(--focus-ring-color)] focus-visible:ring-offset-0',
          ),
        className,
      )}
    >
      {/* Row 1: Header (Order ID, Status, Total) */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-base font-semibold text-[var(--text-primary)]">
            #{orderNumber}
          </span>
          {interactive && (
            <ChevronRight
              className="h-4 w-4 shrink-0 text-[var(--text-tertiary)] opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-[var(--text-secondary)]"
              aria-hidden="true"
            />
          )}
        </div>

        <div className="flex flex-col items-end gap-1.5 sm:flex-row sm:items-center sm:gap-4">
          <OrderStatusBadge status={status} size="sm" />
          <PriceDisplay price={total} size="default" className="font-bold text-right" />
        </div>
      </div>

      {/* Row 2: Metadata */}
      <div className="mt-1">
        <p className="text-sm text-[var(--text-secondary)]">
          Placed on {date} &bull; {itemCount} item{itemCount === 1 ? '' : 's'}
        </p>
      </div>

      {/* Row 3: Thumbnails */}
      <div className="mt-5 flex items-center gap-3">
        <div className="flex -space-x-3">
          {previewItems.map((item, i) => (
            <div
              key={i}
              className={cn(
                'h-12 w-12 sm:h-14 sm:w-14 overflow-hidden rounded-xl',
                'border-2 border-[var(--surface-base)]',
                'bg-[var(--surface-subtle)]',
                'ring-1 ring-[var(--border-subtle)]',
                'relative z-10 hover:z-20 transition-transform duration-200 hover:scale-105',
              )}
              style={{ zIndex: previewItems.length - i }}
            >
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
        {remaining > 0 && (
          <span className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[var(--surface-subtle)] text-xs font-medium text-[var(--text-secondary)]">
            +{remaining}
          </span>
        )}
      </div>

      {/* Row 4: Actions */}
      <OrderActions
        status={status}
        onTrack={onTrack}
        onReorder={onReorder}
        onCancel={onCancel}
        onChangeAddress={onChangeAddress}
        onWriteReview={onWriteReview}
        onDownloadInvoice={onDownloadInvoice}
        className="mt-6 pt-5 border-t border-[var(--border-subtle)]"
      />
    </div>
  )
}


