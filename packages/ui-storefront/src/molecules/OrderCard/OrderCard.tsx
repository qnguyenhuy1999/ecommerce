import { Calendar, ChevronRight, RotateCcw, Truck } from 'lucide-react'

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
  onView?: () => void
  onTrack?: () => void
  onReorder?: () => void
  className?: string
}

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
  className,
}: OrderCardProps) {
  const previewItems = items.slice(0, 3)
  const remaining = Math.max(0, itemCount - 3)

  return (
    <div
      className={cn(
        'rounded-[var(--radius-xl)] border border-[var(--border-subtle)]',
        'bg-[var(--surface-base)] shadow-[var(--elevation-surface)]',
        'p-[var(--space-5)] flex flex-col gap-[var(--space-4)]',
        'hover:shadow-[var(--elevation-card)] transition-shadow duration-[var(--motion-normal)]',
        className,
      )}
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[var(--text-xs)] text-[var(--text-tertiary)] uppercase tracking-wide font-medium">
            Order
          </p>
          <p className="text-[var(--text-sm)] font-bold text-[var(--text-primary)] font-mono">
            #{orderNumber}
          </p>
        </div>
        <OrderStatusBadge status={status} />
      </div>

      {/* Item thumbnails */}
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {previewItems.map((item, i) => (
            <div
              key={i}
              className={cn(
                'w-12 h-12 rounded-[var(--radius-md)] overflow-hidden',
                'border-2 border-[var(--surface-base)]',
                'bg-[var(--surface-muted)]',
                'ring-1 ring-[var(--border-subtle)]',
              )}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
        {remaining > 0 && (
          <span className="text-[var(--text-xs)] text-[var(--text-secondary)] font-medium">
            +{remaining} more
          </span>
        )}
      </div>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[length:var(--text-xs)] text-[var(--text-secondary)]">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          {date}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="font-medium text-[var(--text-primary)]">Total:</span>
          <PriceDisplay price={total} size="sm" />
        </span>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[var(--border-subtle)]">
        {onView && (
          <Button
            variant="outline"
            size="sm"
            onClick={onView}
            className="h-8 gap-1.5 text-[length:var(--text-xs)]"
          >
            View Details
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        )}
        {onTrack && (status === 'SHIPPED' || status === 'PROCESSING') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onTrack}
            className="h-8 gap-1.5 text-[length:var(--text-xs)] text-[var(--action-primary)]"
          >
            <Truck className="w-3.5 h-3.5" />
            Track
          </Button>
        )}
        {onReorder && status === 'COMPLETED' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReorder}
            className="h-8 gap-1.5 text-[length:var(--text-xs)]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reorder
          </Button>
        )}
      </div>
    </div>
  )
}

export { OrderCard }
