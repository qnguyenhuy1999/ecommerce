import type React from 'react'

import type { StorefrontFooter } from '../../StorefrontFooter/StorefrontFooter'
import type { StorefrontHeader } from '../../StorefrontHeader/StorefrontHeader'
import { PageContainer } from '../../shared/PageContainer'
import { StorefrontPageShell } from '../../shared/StorefrontPageShell'

export interface CartPageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  promoBar?: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  headerProps?: React.ComponentProps<typeof StorefrontHeader>
  footerProps?: React.ComponentProps<typeof StorefrontFooter>
  newsletter?: React.ReactNode
}

export function CartPageLayoutRoot({
  children,
  promoBar,
  header,
  footer,
  headerProps,
  footerProps,
  newsletter,
  className,
  ...props
}: CartPageLayoutProps) {
  return (
    <StorefrontPageShell
      promoBar={promoBar}
      header={header}
      footer={footer}
      headerProps={headerProps}
      footerProps={footerProps}
      newsletter={newsletter}
    >
      <PageContainer>
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-[var(--text-primary)]">
          Your Cart
        </h1>
        <div
          className={
            'grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start' +
            (className ? ` ${className}` : '')
          }
          {...props}
        >
          {children}
        </div>
      </PageContainer>
    </StorefrontPageShell>
  )
}
