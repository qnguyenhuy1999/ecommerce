import React from 'react'

import { cn } from '@ecom/ui'

import { AccountSidebar } from '../../molecules/AccountSidebar/AccountSidebar'
import type { AccountSidebarProps } from '../../molecules/AccountSidebar/AccountSidebar'
import { PageContainer } from '../shared/PageContainer'
import { StorefrontPageShell } from '../shared/StorefrontPageShell'
import type { StorefrontFooter } from '../StorefrontFooter/StorefrontFooter'
import type { StorefrontHeader } from '../StorefrontHeader/StorefrontHeader'

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

/**
 * Account dashboard chrome — left rail (Orders / Wishlist / Profile / Addresses)
 * + content surface. Composed on top of StorefrontPageShell + PageContainer so
 * the spacing and container width always match the rest of the storefront.
 */
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
        {breadcrumb && (
          <div className="mb-[var(--space-6)] text-[length:var(--text-sm)] text-[var(--text-secondary)]">
            {breadcrumb}
          </div>
        )}
        <div className="grid gap-[var(--space-8)] lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start">
          {/* Sidebar — sticky offset uses the measured total header height so
              it never collides with an optional category nav row. */}
          <div className="lg:sticky lg:top-[calc(var(--storefront-header-total)+var(--space-6))]">
            <AccountSidebar {...sidebarProps} />
          </div>

          {/* Content surface */}
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
      </PageContainer>
    </StorefrontPageShell>
  )
}

export { AccountPageLayout }
