import React from 'react'

import { Breadcrumb } from '@ecom/ui'
import type { BreadcrumbItem } from '@ecom/ui'

import { OrderDetailSection } from '../../organisms/OrderDetailSection/OrderDetailSection'
import type { OrderDetailSectionProps } from '../../organisms/OrderDetailSection/OrderDetailSection'
import { StorefrontFooter } from '../StorefrontFooter/StorefrontFooter'
import { StorefrontHeader } from '../StorefrontHeader/StorefrontHeader'
import { StorefrontShell } from '../StorefrontShell/StorefrontShell'

export interface OrderDetailPageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  promoBar?: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  headerProps?: React.ComponentProps<typeof StorefrontHeader>
  footerProps?: React.ComponentProps<typeof StorefrontFooter>
  orderDetail: Omit<OrderDetailSectionProps, 'className'>
  breadcrumbItems?: BreadcrumbItem[]
  newsletter?: React.ReactNode
}

function OrderDetailPageLayout({
  promoBar,
  header,
  footer,
  headerProps,
  footerProps,
  orderDetail,
  breadcrumbItems,
  newsletter,
  className,
  ...props
}: OrderDetailPageLayoutProps) {
  const defaultBreadcrumb: BreadcrumbItem[] = breadcrumbItems ?? [
    { label: 'Home', href: '/' },
    { label: 'My Orders', href: '/account/orders' },
    { label: `#${orderDetail.orderNumber}` },
  ]

  return (
    <StorefrontShell
      className={className}
      header={
        header ?? (
          <div>
            {promoBar}
            <StorefrontHeader {...headerProps} />
          </div>
        )
      }
      footer={footer ?? <StorefrontFooter newsletter={newsletter} {...footerProps} />}
      {...props}
    >
      <div className="px-4 py-8 md:px-8 md:py-12 mx-auto max-w-[var(--storefront-content-max-width)]">
        <div className="mb-6 text-sm text-muted-foreground">
          <Breadcrumb items={defaultBreadcrumb} />
        </div>
        <OrderDetailSection {...orderDetail} />
      </div>
    </StorefrontShell>
  )
}

export { OrderDetailPageLayout }
