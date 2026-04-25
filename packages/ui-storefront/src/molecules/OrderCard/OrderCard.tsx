import {
  ChevronRight,
  Download,
  MapPin,
  RotateCcw,
  Star,
  Truck,
  XCircle,
} from 'lucide-react'

import { Button, cn } from '@ecom/ui'

import { PriceDisplay } from '../../atoms/PriceDisplay/PriceDisplay'
import { OrderStatusBadge } from '../../atoms/OrderStatusBadge/OrderStatusBadge'
import type { OrderStatus } from '../../atoms/OrderStatusBadge/OrderStatusBadge'

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
  /** View order detail. Whole row is clickable when this handler is provided. */
  onView?: () => void
  onTrack?: () => void
  onReorder?: () => void
  onCancel?: () => void
  onChangeAddress?: () => void
  onWriteReview?: () => void
  onDownloadInvoice?: () => void
  className?: string
}

interface ActionDescriptor {
  key: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  onClick?: () => void
  variant: 'primary' | 'secondary'
  /** Tone used for secondary actions only; primary always uses outline. */
  tone?: 'default' | 'danger'
}

/**
 * Compute the primary + (optionally) secondary action for an order based on status.
 * Returns at most 1 primary and 1 secondary action so the row never feels cluttered.
 */
function getContextualActions({
  status,
  onTrack,
  onReorder,
  onCancel,
  onChangeAddress,
  onWriteReview,
  onDownloadInvoice,
}: Pick<
  OrderCardProps,
  'status' | 'onTrack' | 'onReorder' | 'onCancel' | 'onChangeAddress' | 'onWriteReview' | 'onDownloadInvoice'
>): { primary?: ActionDescriptor; secondary?: ActionDescriptor } {
  switch (status) {
    case 'PENDING_PAYMENT':
    case 'PAID':
    case 'PROCESSING': {
      const primary: ActionDescriptor | undefined = onCancel
        ? {
            key: 'cancel',
            label: 'Cancel order',
            icon: XCircle,
            onClick: onCancel,
            variant: 'primary',
            tone: 'danger',
          }
        : undefined
      const secondary: ActionDescriptor | undefined = onChangeAddress
        ? {
            key: 'address',
            label: 'Change address',
            icon: MapPin,
            onClick: onChangeAddress,
            variant: 'secondary',
          }
        : undefined
      return { primary, secondary }
    }
    case 'SHIPPED': {
      const primary = onTrack
        ? {
            key: 'track',
            label: 'Track order',
            icon: Truck,
            onClick: onTrack,
            variant: 'primary' as const,
          }
        : undefined
      return { primary }
    }
    case 'COMPLETED': {
      const primary = onReorder
        ? {
            key: 'buy-again',
            label: 'Buy again',
            icon: RotateCcw,
            onClick: onReorder,
            variant: 'primary' as const,
          }
        : undefined
      let secondary: ActionDescriptor | undefined
      if (onWriteReview) {
        secondary = {
          key: 'review',
          label: 'Write review',
          icon: Star,
          onClick: onWriteReview,
          variant: 'secondary',
        }
      } else if (onDownloadInvoice) {
        secondary = {
          key: 'invoice',
          label: 'Invoice',
          icon: Download,
          onClick: onDownloadInvoice,
          variant: 'secondary',
        }
      }
      return { primary, secondary }
    }
    case 'CANCELLED':
    case 'REFUNDED':
    case 'PENDING_REFUND': {
      const primary = onReorder
        ? {
            key: 'reorder',
            label: 'Reorder',
            icon: RotateCcw,
            onClick: onReorder,
            variant: 'primary' as const,
          }
        : undefined
      return { primary }
    }
    default:
      return {}
  }
}

/**
 * Compact, horizontal order row for high-density list views.
 * Whole row is clickable when `onView` is provided; contextual actions sit
 * on the right and stop click propagation so they don't trigger the row click.
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
  const previewItems = items.slice(0, 3)
  const remaining = Math.max(0, itemCount - previewItems.length)
  const { primary, secondary } = getContextualActions({
    status,
    onTrack,
    onReorder,
    onCancel,
    onChangeAddress,
    onWriteReview,
    onDownloadInvoice,
  })

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
        'group relative flex flex-col gap-[var(--space-3)] sm:gap-[var(--space-4)]',
        'sm:grid sm:grid-cols-[auto_minmax(0,1fr)_auto_auto] sm:items-center',
        'rounded-[var(--radius-md)]',
        'bg-[var(--surface-base)]',
        'px-[var(--space-4)] py-[var(--space-4)]',
        'sm:px-[var(--space-5)] sm:py-[var(--space-4)]',
        'transition-colors duration-[var(--motion-fast)]',
        'border-b border-[var(--border-subtle)] last:border-b-0',
        interactive &&
          cn(
            'cursor-pointer hover:bg-[var(--surface-hover)]',
            'focus-visible:outline-none focus-visible:ring-[var(--focus-ring-width)] focus-visible:ring-[var(--focus-ring-color)] focus-visible:ring-offset-0',
          ),
        className,
      )}
    >
      {/* Thumbnails */}
      <div className="flex shrink-0 items-center gap-[var(--space-2)]">
        <div className="flex -space-x-2">
          {previewItems.map((item, i) => (
            <div
              key={i}
              className={cn(
                'h-11 w-11 overflow-hidden rounded-[var(--radius-md)]',
                'border-2 border-[var(--surface-base)]',
                'bg-[var(--surface-muted)]',
                'ring-1 ring-[var(--border-subtle)]',
              )}
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
          <span className="text-[length:var(--text-xs)] font-medium text-[var(--text-tertiary)]">
            +{remaining}
          </span>
        )}
      </div>

      {/* Order info */}
      <div className="min-w-0">
        <p className="truncate font-mono text-[length:var(--text-sm)] font-semibold text-[var(--text-primary)]">
          #{orderNumber}
        </p>
        <p className="text-[length:var(--text-xs)] text-[var(--text-tertiary)]">
          Placed {date} · {itemCount} item{itemCount === 1 ? '' : 's'}
        </p>
      </div>

      {/* Status */}
      <div className="flex items-center sm:justify-end">
        <OrderStatusBadge status={status} size="sm" />
      </div>

      {/* Total + actions */}
      <div className="flex items-center justify-between gap-[var(--space-3)] sm:justify-end sm:gap-[var(--space-4)]">
        <PriceDisplay price={total} size="sm" className="font-semibold" />

        <div className="flex items-center gap-[var(--space-1-5)]">
          {secondary && secondary.onClick && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(event) => {
                event.stopPropagation()
                secondary.onClick?.()
              }}
              className={cn(
                'hidden h-8 gap-[var(--space-1)] px-[var(--space-2)] text-[length:var(--text-xs)]',
                'sm:inline-flex',
                'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100',
                'transition-opacity duration-[var(--motion-fast)]',
                'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
              )}
            >
              <secondary.icon className="h-3.5 w-3.5" aria-hidden="true" />
              {secondary.label}
            </Button>
          )}

          {primary && primary.onClick ? (
            <Button
              variant={primary.tone === 'danger' ? 'ghost' : 'outline'}
              size="sm"
              onClick={(event) => {
                event.stopPropagation()
                primary.onClick?.()
              }}
              className={cn(
                'h-8 gap-[var(--space-1-5)] px-[var(--space-3)] text-[length:var(--text-xs)] font-medium',
                primary.tone === 'danger' &&
                  'text-[var(--intent-danger)] hover:bg-[var(--intent-danger-muted)] hover:text-[var(--intent-danger)]',
              )}
            >
              <primary.icon className="h-3.5 w-3.5" aria-hidden="true" />
              {primary.label}
            </Button>
          ) : null}

          {interactive && (
            <ChevronRight
              className="h-4 w-4 shrink-0 text-[var(--text-tertiary)] transition-transform duration-[var(--motion-fast)] group-hover:translate-x-0.5 group-hover:text-[var(--text-secondary)]"
              aria-hidden="true"
            />
          )}
        </div>
      </div>
    </div>
  )
}

export { OrderCard }
