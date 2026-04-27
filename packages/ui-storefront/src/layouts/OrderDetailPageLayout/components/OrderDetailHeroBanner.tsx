import { ExternalLink, Package } from 'lucide-react'

import { Button } from '@ecom/ui'
import { cn } from '@ecom/ui/utils'

import { OrderStatusBadge } from '../../../atoms/OrderStatusBadge/OrderStatusBadge'
import { DashboardCard } from './DashboardCard'

export interface OrderDetailHeroBannerProps {
  orderNumber: string
  createdAt: string
  status: React.ComponentProps<typeof OrderStatusBadge>['status']
  estimatedArrival?: string
  estimatedArrivalCountdown?: string
  totalItemCount: number
  sellerCount: number
  trackingInfo?: {
    carrier: string
    trackingNumber: string
    trackingUrl?: string
  }
  isLiveTrackable: boolean
}

export function OrderDetailHeroBanner({
  orderNumber,
  createdAt,
  status,
  estimatedArrival,
  estimatedArrivalCountdown,
  totalItemCount,
  sellerCount,
  trackingInfo,
  isLiveTrackable,
}: OrderDetailHeroBannerProps) {
  return (
    <DashboardCard className="mb-6 p-6 sm:p-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between md:gap-8">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[length:var(--text-xs)] font-semibold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
              Order #{orderNumber}
            </span>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[var(--text-tertiary)]" />
            <span className="text-[length:var(--text-xs)] text-[var(--text-tertiary)]">
              Placed {createdAt}
            </span>
          </div>
          <h1
            className={cn(
              'text-[length:var(--font-size-heading-xl)] font-bold tracking-[-0.015em] leading-[var(--line-height-tight)] text-[var(--text-primary)]',
              'sm:text-[length:var(--font-size-display-sm)]',
            )}
          >
            {estimatedArrival
              ? `Estimated arrival: ${estimatedArrival}`
              : 'Your order is on its way'}
          </h1>
          <p className="text-sm text-[var(--text-secondary)] leading-[var(--line-height-relaxed)]">
            {totalItemCount} item{totalItemCount === 1 ? '' : 's'} from {sellerCount} seller
            {sellerCount === 1 ? '' : 's'}
            {trackingInfo ? ` · Tracked via ${trackingInfo.carrier}` : ''}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <OrderStatusBadge status={status} />
            {estimatedArrivalCountdown && (
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-3 py-1',
                  'bg-[rgb(var(--brand-500-rgb)/0.1)] text-[var(--action-primary)]',
                  'text-[length:var(--text-xs)] font-semibold',
                )}
              >
                {estimatedArrivalCountdown}
              </span>
            )}
            {isLiveTrackable && (
              <span
                className={cn(
                  'inline-flex items-center gap-2 rounded-full',
                  'bg-[var(--intent-success-muted)] px-3 py-1',
                  'text-[length:var(--text-xs)] font-medium text-[var(--intent-success)]',
                )}
                aria-live="polite"
              >
                <span className="relative flex h-2 w-2">
                  <span
                    aria-hidden="true"
                    className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--intent-success)] opacity-60"
                  />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--intent-success)]" />
                </span>
                Live update
              </span>
            )}
          </div>
        </div>

        {trackingInfo && (
          <div
            className={cn(
              'flex shrink-0 items-center gap-3',
              'rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-subtle)]',
              'px-4 py-3',
            )}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-base)] text-[var(--text-secondary)]">
              <Package className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-[length:var(--text-xs)] uppercase tracking-[0.1em] text-[var(--text-tertiary)]">
                {trackingInfo.carrier}
              </p>
              <p className="font-mono text-sm font-semibold text-[var(--text-primary)]">
                {trackingInfo.trackingNumber}
              </p>
            </div>
            {trackingInfo.trackingUrl && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1 text-[length:var(--text-xs)]"
                onClick={() => window.open(trackingInfo.trackingUrl, '_blank')}
              >
                Track <ExternalLink className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </div>
    </DashboardCard>
  )
}
