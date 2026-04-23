import React from 'react'

import { cn } from '@ecom/ui'

import { AccountSidebar } from '../../molecules/AccountSidebar/AccountSidebar'
import type { AccountSidebarProps } from '../../molecules/AccountSidebar/AccountSidebar'
import { StorefrontFooter } from '../StorefrontFooter/StorefrontFooter'
import { StorefrontHeader } from '../StorefrontHeader/StorefrontHeader'
import { StorefrontShell } from '../StorefrontShell/StorefrontShell'

export interface AccountPageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  promoBar?: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  headerProps?: React.ComponentProps<typeof StorefrontHeader>
  footerProps?: React.ComponentProps<typeof StorefrontFooter>
  sidebarProps: AccountSidebarProps
  breadcrumb?: React.ReactNode
  newsletter?: React.ReactNode
  children: React.ReactNode
}

function AccountPageLayout({
  promoBar,
  header,
  footer,
  headerProps,
  footerProps,
  sidebarProps,
  breadcrumb,
  newsletter,
  children,
  className,
  ...props
}: AccountPageLayoutProps) {
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
        {breadcrumb && <div className="mb-6 text-sm text-muted-foreground">{breadcrumb}</div>}
        <div className="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start">
          {/* Sidebar */}
          <div className="lg:sticky lg:top-28">
            <AccountSidebar {...sidebarProps} />
          </div>

          {/* Content */}
          <div
            className={cn(
              'rounded-[var(--radius-xl)] border border-[var(--border-subtle)]',
              'bg-[var(--surface-base)] shadow-[var(--elevation-surface)]',
              'p-[var(--space-6)] min-h-[24rem]',
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </StorefrontShell>
  )
}

export { AccountPageLayout }
