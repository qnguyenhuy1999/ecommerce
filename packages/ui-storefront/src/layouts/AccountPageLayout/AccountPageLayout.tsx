import React from 'react'

import { cn } from '@ecom/ui'

import type { AccountSidebarProps } from '../../molecules/AccountSidebar/AccountSidebar'
import { AccountDashboardShell } from '../shared/AccountDashboardShell'
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
        <div className="w-full">
          {breadcrumb && (
            <div className="mb-6 text-sm text-[var(--text-secondary)]">{breadcrumb}</div>
          )}
          <AccountDashboardShell sidebarProps={sidebarProps}>
            <div className={cn('min-h-[24rem]')}>{children}</div>
          </AccountDashboardShell>
        </div>
      </PageContainer>
    </StorefrontPageShell>
  )
}

export { AccountPageLayout }
