import { ExternalLink } from 'lucide-react'

import { cn } from '@ecom/ui/utils'

import { OrderStatusBadge } from '../../../atoms/OrderStatusBadge/OrderStatusBadge'
import { PriceDisplay } from '../../../atoms/PriceDisplay/PriceDisplay'
import type { OrderDetailSubOrder } from '../../../organisms/OrderDetailSection/OrderDetailSection'
import { DashboardCard } from './DashboardCard'

export interface OrderDetailSubOrderCardProps {
  subOrder: OrderDetailSubOrder
}

export function OrderDetailSubOrderCard({ subOrder }: OrderDetailSubOrderCardProps) {
  return (
    <DashboardCard className="overflow-hidden">
      <div
        className={cn(
          'flex items-center justify-between gap-3',
          'border-b border-[var(--border-subtle)] bg-[var(--surface-subtle)]',
          'px-5 py-3 sm:px-6',
        )}
      >
        <div className="min-w-0">
          <p className="text-[length:var(--text-xs)] uppercase tracking-[0.1em] text-[var(--text-tertiary)]">
            Sold by
          </p>
          <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
            {subOrder.storeName}
          </p>
        </div>
        <OrderStatusBadge status={subOrder.status} size="sm" />
      </div>

      <ul className="divide-y divide-[var(--border-subtle)]">
        {subOrder.items.map((item) => (
          <li key={item.id} className={cn('flex items-center gap-4', 'px-5 py-4 sm:px-6')}>
            {item.image && (
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-muted)]">
                <img
                  src={item.image}
                  alt={item.productName}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                {item.productName}
              </p>
              <p className="font-mono text-[length:var(--text-xs)] text-[var(--text-tertiary)]">
                {item.variantSku}
              </p>
              {Object.entries(item.attributes).length > 0 && (
                <p className="mt-1 text-[length:var(--text-xs)] text-[var(--text-secondary)]">
                  {Object.entries(item.attributes)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(' · ')}
                </p>
              )}
              <p className="text-[length:var(--text-xs)] text-[var(--text-secondary)]">
                Qty {item.quantity}
              </p>
            </div>
            <PriceDisplay price={item.unitPrice * item.quantity} size="sm" />
          </li>
        ))}
      </ul>

      {subOrder.trackingInfo && (
        <div
          className={cn(
            'flex flex-wrap items-center justify-between gap-2',
            'border-t border-[var(--border-subtle)] bg-[var(--surface-subtle)]',
            'px-5 py-3 sm:px-6',
          )}
        >
          <p className="text-[length:var(--text-xs)] text-[var(--text-secondary)]">
            <span className="font-medium text-[var(--text-primary)]">
              {subOrder.trackingInfo.carrier}:
            </span>{' '}
            <span className="font-mono">{subOrder.trackingInfo.trackingNumber}</span>
          </p>
          {subOrder.trackingInfo.trackingUrl && (
            <a
              href={subOrder.trackingInfo.trackingUrl}
              target="_blank"
              rel="noreferrer"
              className={cn(
                'inline-flex items-center gap-1',
                'text-[length:var(--text-xs)] font-medium text-[var(--action-primary)]',
                'hover:underline focus-visible:outline-none focus-visible:ring-[var(--focus-ring-width)] focus-visible:ring-[var(--focus-ring-color)] rounded-[var(--radius-sm)]',
              )}
            >
              Track <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      )}
    </DashboardCard>
  )
}
