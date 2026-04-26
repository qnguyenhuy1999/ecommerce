import React from 'react'

import {
  ArrowLeft,
  CreditCard,
  ExternalLink,
  HelpCircle,
  MapPin,
  MessageSquare,
  Package,
  XCircle,
} from 'lucide-react'

import { Breadcrumb, Button, Separator, cn } from '@ecom/ui'
import type { BreadcrumbItem } from '@ecom/ui'

import { OrderStatusBadge } from '../../atoms/OrderStatusBadge/OrderStatusBadge'
import { PriceDisplay } from '../../atoms/PriceDisplay/PriceDisplay'
import type { AccountSidebarProps } from '../../molecules/AccountSidebar/AccountSidebar'
import { OrderTimeline } from '../../molecules/OrderTimeline/OrderTimeline'
import type { OrderDetailSectionProps } from '../../organisms/OrderDetailSection/OrderDetailSection'
import { AccountDashboardShell } from '../shared/AccountDashboardShell'
import { PageContainer } from '../shared/PageContainer'
import { StorefrontPageShell } from '../shared/StorefrontPageShell'
import type { StorefrontFooter } from '../StorefrontFooter/StorefrontFooter'
import type { StorefrontHeader } from '../StorefrontHeader/StorefrontHeader'

export interface OrderDetailPageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  promoBar?: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  headerProps?: React.ComponentProps<typeof StorefrontHeader>
  footerProps?: React.ComponentProps<typeof StorefrontFooter>
  /**
   * Optional account sidebar. When provided, the order detail renders inside
   * the My Account dashboard chrome (sticky desktop rail + mobile drawer).
   * Standalone mode (no sidebarProps) is preserved for back-compat.
   */
  sidebarProps?: AccountSidebarProps
  orderDetail: Omit<OrderDetailSectionProps, 'className'>
  breadcrumbItems?: BreadcrumbItem[]
  newsletter?: React.ReactNode
  /**
   * Optional ETA copy shown in the hero status banner. Free-form so consumers can
   * format it however they want (e.g. "April 27" or "Tomorrow, by 5pm").
   */
  estimatedArrival?: string
  /** Optional countdown copy shown next to the ETA (e.g. "3 days left"). */
  estimatedArrivalCountdown?: string
  /** Cancel order action. When provided, a destructive ghost button is shown in the sidebar. */
  onCancelOrder?: () => void
  /** Open a thread with the seller (e.g. messaging, store contact form). */
  onContactSeller?: () => void
  /** Reach platform-level order help / customer support. */
  onContactSupport?: () => void
}

/**
 * Card surface — uniform corner radius, border and elevation so every panel on
 * the dashboard reads as part of the same family.
 */
function DashboardCard({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-base)]',
        'shadow-[var(--elevation-card)]',
        'transition-shadow duration-[var(--motion-normal)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function OrderDetailPageLayout({
  promoBar,
  header,
  footer,
  headerProps,
  footerProps,
  sidebarProps,
  orderDetail,
  breadcrumbItems,
  newsletter,
  estimatedArrival,
  estimatedArrivalCountdown,
  onCancelOrder,
  onContactSeller,
  onContactSupport,
  className,
  ...props
}: OrderDetailPageLayoutProps) {
  const {
    orderNumber,
    status,
    createdAt,
    subtotal,
    shippingFee,
    totalAmount,
    shippingAddress,
    subOrders,
    timelineSteps,
    paymentMethod,
    onBack,
  } = orderDetail

  const defaultBreadcrumb: BreadcrumbItem[] = breadcrumbItems ?? [
    { label: 'Home', href: '/' },
    { label: 'My Orders', href: '/account/orders' },
    { label: `#${orderNumber}` },
  ]

  const totalItemCount = subOrders.reduce(
    (sum, sub) => sum + sub.items.reduce((s, item) => s + item.quantity, 0),
    0,
  )

  // Flatten items for the sidebar summary (show first 3, then "+N more").
  const flatItems = subOrders.flatMap((s) => s.items)
  const previewItems = flatItems.slice(0, 3)
  const remainingCount = flatItems.length - previewItems.length

  const trackingInfo = subOrders.find((s) => s.trackingInfo)?.trackingInfo

  // Status flag — only render the live indicator on truly active states.
  const isLiveTrackable = status === 'PROCESSING' || status === 'SHIPPED' || status === 'PAID'

  const body = (
    <>
        {/* Breadcrumb + back */}
        <div className="mb-[var(--space-4)] flex items-center justify-between gap-[var(--space-3)]">
          <Breadcrumb items={defaultBreadcrumb} />
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="-mr-[var(--space-2)] gap-[var(--space-1)] text-[length:var(--text-xs)] text-[var(--text-secondary)]"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Orders
            </Button>
          )}
        </div>

        {/* HERO STATUS BANNER */}
        <DashboardCard className="mb-[var(--space-6)] p-[var(--space-6)] sm:p-[var(--space-8)]">
          <div className="flex flex-col gap-[var(--space-5)] md:flex-row md:items-start md:justify-between md:gap-[var(--space-8)]">
            <div className="min-w-0 flex-1 space-y-[var(--space-2)]">
              <div className="flex flex-wrap items-center gap-[var(--space-2)]">
                <span className="text-[length:var(--text-xs)] font-semibold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
                  Order #{orderNumber}
                </span>
                <span
                  aria-hidden="true"
                  className="h-1 w-1 rounded-full bg-[var(--text-tertiary)]"
                />
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
              <p className="text-[length:var(--text-sm)] text-[var(--text-secondary)] leading-[var(--line-height-relaxed)]">
                {totalItemCount} item{totalItemCount === 1 ? '' : 's'} from {subOrders.length}{' '}
                seller{subOrders.length === 1 ? '' : 's'}
                {trackingInfo ? ` · Tracked via ${trackingInfo.carrier}` : ''}
              </p>

              <div className="flex flex-wrap items-center gap-[var(--space-2)] pt-[var(--space-2)]">
                <OrderStatusBadge status={status} />
                {estimatedArrivalCountdown && (
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full px-[var(--space-3)] py-[var(--space-1)]',
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
                      'inline-flex items-center gap-[var(--space-2)] rounded-full',
                      'bg-[var(--intent-success-muted)] px-[var(--space-3)] py-[var(--space-1)]',
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
                  'flex shrink-0 items-center gap-[var(--space-3)]',
                  'rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-subtle)]',
                  'px-[var(--space-4)] py-[var(--space-3)]',
                )}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-base)] text-[var(--text-secondary)]">
                  <Package className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-[length:var(--text-xs)] uppercase tracking-[0.1em] text-[var(--text-tertiary)]">
                    {trackingInfo.carrier}
                  </p>
                  <p className="font-mono text-[length:var(--text-sm)] font-semibold text-[var(--text-primary)]">
                    {trackingInfo.trackingNumber}
                  </p>
                </div>
                {trackingInfo.trackingUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-[var(--space-1)] text-[length:var(--text-xs)]"
                    onClick={() => window.open(trackingInfo.trackingUrl, '_blank')}
                  >
                    Track <ExternalLink className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </DashboardCard>

        {/* DASHBOARD GRID — 65/35 split */}
        <div className="grid grid-cols-1 gap-[var(--space-6)] lg:grid-cols-[1.65fr_1fr] lg:gap-[var(--space-8)]">
          {/* LEFT — Tracking engine */}
          <div className="space-y-[var(--space-6)] min-w-0">
            <DashboardCard className="p-[var(--space-6)] sm:p-[var(--space-8)]">
              <div className="mb-[var(--space-6)] flex items-center justify-between gap-[var(--space-3)]">
                <h2 className="text-[length:var(--font-size-heading-md)] font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
                  Tracking
                </h2>
                {timelineSteps && (
                  <span className="text-[length:var(--text-xs)] text-[var(--text-tertiary)]">
                    {timelineSteps.filter((s) => s.status === 'complete').length} of{' '}
                    {timelineSteps.length} steps complete
                  </span>
                )}
              </div>
              {timelineSteps ? (
                <OrderTimeline steps={timelineSteps} />
              ) : (
                <p className="text-[length:var(--text-sm)] text-[var(--text-secondary)]">
                  Tracking information is not available yet. Check back once your order has been
                  processed.
                </p>
              )}
            </DashboardCard>

            {/* Items per sub-order */}
            {subOrders.map((sub) => (
              <DashboardCard key={sub.id} className="overflow-hidden">
                <div
                  className={cn(
                    'flex items-center justify-between gap-[var(--space-3)]',
                    'border-b border-[var(--border-subtle)] bg-[var(--surface-subtle)]',
                    'px-[var(--space-5)] py-[var(--space-3)] sm:px-[var(--space-6)]',
                  )}
                >
                  <div className="min-w-0">
                    <p className="text-[length:var(--text-xs)] uppercase tracking-[0.1em] text-[var(--text-tertiary)]">
                      Sold by
                    </p>
                    <p className="text-[length:var(--text-sm)] font-semibold text-[var(--text-primary)] truncate">
                      {sub.storeName}
                    </p>
                  </div>
                  <OrderStatusBadge status={sub.status} size="sm" />
                </div>

                <ul className="divide-y divide-[var(--border-subtle)]">
                  {sub.items.map((item) => (
                    <li
                      key={item.id}
                      className={cn(
                        'flex items-center gap-[var(--space-4)]',
                        'px-[var(--space-5)] py-[var(--space-4)] sm:px-[var(--space-6)]',
                      )}
                    >
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
                        <p className="text-[length:var(--text-sm)] font-semibold text-[var(--text-primary)] truncate">
                          {item.productName}
                        </p>
                        <p className="font-mono text-[length:var(--text-xs)] text-[var(--text-tertiary)]">
                          {item.variantSku}
                        </p>
                        {Object.entries(item.attributes).length > 0 && (
                          <p className="mt-[var(--space-1)] text-[length:var(--text-xs)] text-[var(--text-secondary)]">
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

                {sub.trackingInfo && (
                  <div
                    className={cn(
                      'flex flex-wrap items-center justify-between gap-[var(--space-2)]',
                      'border-t border-[var(--border-subtle)] bg-[var(--surface-subtle)]',
                      'px-[var(--space-5)] py-[var(--space-3)] sm:px-[var(--space-6)]',
                    )}
                  >
                    <p className="text-[length:var(--text-xs)] text-[var(--text-secondary)]">
                      <span className="font-medium text-[var(--text-primary)]">
                        {sub.trackingInfo.carrier}:
                      </span>{' '}
                      <span className="font-mono">{sub.trackingInfo.trackingNumber}</span>
                    </p>
                    {sub.trackingInfo.trackingUrl && (
                      <a
                        href={sub.trackingInfo.trackingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={cn(
                          'inline-flex items-center gap-[var(--space-1)]',
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
            ))}
          </div>

          {/* RIGHT — Context sidebar */}
          <aside className="space-y-[var(--space-6)] lg:sticky lg:top-[calc(var(--storefront-header-total)+var(--space-6))] lg:self-start">
            {/* Order summary */}
            <DashboardCard className="p-[var(--space-6)]">
              <h3 className="mb-[var(--space-4)] text-[length:var(--font-size-heading-sm)] font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
                Order summary
              </h3>

              <ul className="mb-[var(--space-5)] space-y-[var(--space-3)]">
                {previewItems.map((item) => (
                  <li key={item.id} className="flex items-center gap-[var(--space-3)]">
                    {item.image ? (
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-muted)]">
                        <img
                          src={item.image}
                          alt={item.productName}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-12 shrink-0 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-muted)]" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-[length:var(--text-sm)] font-medium text-[var(--text-primary)] truncate">
                        {item.productName}
                      </p>
                      <p className="text-[length:var(--text-xs)] text-[var(--text-tertiary)]">
                        Qty {item.quantity}
                      </p>
                    </div>
                    <PriceDisplay price={item.unitPrice * item.quantity} size="sm" />
                  </li>
                ))}
                {remainingCount > 0 && (
                  <li className="text-[length:var(--text-xs)] text-[var(--text-tertiary)]">
                    +{remainingCount} more item{remainingCount === 1 ? '' : 's'}
                  </li>
                )}
              </ul>

              <Separator className="bg-[var(--border-subtle)]" />

              <dl className="mt-[var(--space-4)] space-y-[var(--space-2)] text-[length:var(--text-sm)]">
                <div className="flex justify-between">
                  <dt className="text-[var(--text-secondary)]">Subtotal</dt>
                  <dd>
                    <PriceDisplay price={subtotal} size="sm" />
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--text-secondary)]">Shipping</dt>
                  <dd>
                    <PriceDisplay price={shippingFee} size="sm" />
                  </dd>
                </div>
                <Separator className="my-[var(--space-2)] bg-[var(--border-subtle)]" />
                <div className="flex justify-between font-bold">
                  <dt className="text-[var(--text-primary)]">Total</dt>
                  <dd>
                    <PriceDisplay price={totalAmount} size="lg" />
                  </dd>
                </div>
              </dl>

              {paymentMethod && (
                <>
                  <Separator className="my-[var(--space-4)] bg-[var(--border-subtle)]" />
                  <div className="flex items-center gap-[var(--space-3)]">
                    <span className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] bg-[var(--surface-muted)] text-[var(--text-secondary)]">
                      <CreditCard className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[length:var(--text-xs)] uppercase tracking-[0.1em] text-[var(--text-tertiary)]">
                        Paid with
                      </p>
                      <p className="text-[length:var(--text-sm)] font-medium text-[var(--text-primary)]">
                        {paymentMethod.label}
                        {paymentMethod.last4 && (
                          <span className="ml-[var(--space-1)] font-mono text-[var(--text-secondary)]">
                            •••• {paymentMethod.last4}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </DashboardCard>

            {/* Quick actions */}
            <DashboardCard className="p-[var(--space-6)]">
              <h3 className="mb-[var(--space-4)] text-[length:var(--font-size-heading-sm)] font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
                Need help?
              </h3>
              <div className="space-y-[var(--space-2)]">
                <Button
                  type="button"
                  variant="outline"
                  size="default"
                  className="w-full justify-start gap-[var(--space-2)] rounded-[var(--radius-lg)]"
                  onClick={onContactSeller}
                  disabled={!onContactSeller}
                >
                  <MessageSquare className="h-4 w-4" aria-hidden="true" />
                  Contact seller
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="default"
                  className="w-full justify-start gap-[var(--space-2)] rounded-[var(--radius-lg)]"
                  onClick={onContactSupport}
                  disabled={!onContactSupport}
                >
                  <HelpCircle className="h-4 w-4" aria-hidden="true" />
                  Help with this order
                </Button>
                {onCancelOrder && (
                  <Button
                    type="button"
                    variant="outline"
                    size="default"
                    onClick={onCancelOrder}
                    className={cn(
                      'w-full justify-start gap-[var(--space-2)] rounded-[var(--radius-lg)]',
                      'border-[color-mix(in_srgb,var(--intent-danger)_30%,transparent)]',
                      'text-[var(--intent-danger)]',
                      'hover:bg-[var(--intent-danger-muted)] hover:text-[var(--intent-danger)] hover:border-[var(--intent-danger)]',
                    )}
                  >
                    <XCircle className="h-4 w-4" aria-hidden="true" />
                    Cancel order
                  </Button>
                )}
              </div>
            </DashboardCard>

            {/* Shipping address */}
            <DashboardCard className="p-[var(--space-6)]">
              <div className="flex items-start gap-[var(--space-3)]">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--surface-muted)] text-[var(--text-secondary)]">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[length:var(--text-xs)] uppercase tracking-[0.1em] text-[var(--text-tertiary)]">
                    Shipping to
                  </p>
                  <address className="not-italic mt-[var(--space-1)] space-y-0.5 text-[length:var(--text-sm)] leading-[var(--line-height-relaxed)] text-[var(--text-secondary)]">
                    <p className="font-semibold text-[var(--text-primary)]">
                      {shippingAddress.fullName}
                    </p>
                    <p>{shippingAddress.addressLine1}</p>
                    {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
                    <p>
                      {shippingAddress.city}, {shippingAddress.postalCode}
                    </p>
                    <p>{shippingAddress.country}</p>
                    {shippingAddress.phone && (
                      <p className="pt-[var(--space-1)] font-mono text-[var(--text-tertiary)]">
                        {shippingAddress.phone}
                      </p>
                    )}
                  </address>
                </div>
              </div>
            </DashboardCard>
          </aside>
        </div>
    </>
  )

  return (
    <StorefrontPageShell
      className={className}
      promoBar={promoBar}
      header={header}
      footer={footer}
      headerProps={headerProps}
      footerProps={footerProps}
      newsletter={newsletter}
      {...props}
    >
      <PageContainer>
        {sidebarProps ? (
          <AccountDashboardShell sidebarProps={sidebarProps}>{body}</AccountDashboardShell>
        ) : (
          body
        )}
      </PageContainer>
    </StorefrontPageShell>
  )
}

export { OrderDetailPageLayout }
