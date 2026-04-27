import React from 'react'

import type { BreadcrumbItem } from '@ecom/ui'

import type { AccountSidebarProps } from '../../molecules/AccountSidebar/AccountSidebar'
import type { OrderDetailSectionProps } from '../../organisms/OrderDetailSection/OrderDetailSection'
import { OrderDetailBreadcrumbBar } from './components/OrderDetailBreadcrumbBar'
import { OrderDetailHeroBanner } from './components/OrderDetailHeroBanner'
import { OrderDetailSidebar } from './components/OrderDetailSidebar'
import { OrderDetailSubOrdersList } from './components/OrderDetailSubOrdersList'
import { OrderDetailTrackingCard } from './components/OrderDetailTrackingCard'
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
  const flatItems = subOrders.reduce<(typeof subOrders)[number]['items'][number][]>(
    (items, subOrder) => items.concat(subOrder.items),
    [],
  )
  const previewItems = flatItems.slice(0, 3)
  const remainingCount = flatItems.length - previewItems.length

  const trackingInfo = subOrders.find((s) => s.trackingInfo)?.trackingInfo

  // Status flag — only render the live indicator on truly active states.
  const isLiveTrackable = status === 'PROCESSING' || status === 'SHIPPED' || status === 'PAID'

  const body = (
    <>
      <OrderDetailBreadcrumbBar items={defaultBreadcrumb} onBack={onBack} />

      <OrderDetailHeroBanner
        orderNumber={orderNumber}
        createdAt={createdAt}
        status={status}
        estimatedArrival={estimatedArrival}
        estimatedArrivalCountdown={estimatedArrivalCountdown}
        totalItemCount={totalItemCount}
        sellerCount={subOrders.length}
        trackingInfo={trackingInfo}
        isLiveTrackable={isLiveTrackable}
      />

      {/* DASHBOARD GRID — 65/35 split */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.65fr_1fr] lg:gap-8">
        {/* LEFT — Tracking engine */}
        <div className="space-y-6 min-w-0">
          <OrderDetailTrackingCard timelineSteps={timelineSteps} />

          <OrderDetailSubOrdersList subOrders={subOrders} />
        </div>

        <OrderDetailSidebar
          previewItems={previewItems}
          remainingCount={remainingCount}
          subtotal={subtotal}
          shippingFee={shippingFee}
          totalAmount={totalAmount}
          paymentMethod={paymentMethod}
          shippingAddress={shippingAddress}
          onContactSeller={onContactSeller}
          onContactSupport={onContactSupport}
          onCancelOrder={onCancelOrder}
        />
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
