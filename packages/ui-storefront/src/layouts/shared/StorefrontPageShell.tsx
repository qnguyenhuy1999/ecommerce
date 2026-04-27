import React from 'react'

import { StorefrontFooter } from '../StorefrontFooter/StorefrontFooter'
import { StorefrontHeader } from '../StorefrontHeader/StorefrontHeader'
import { StorefrontShell } from '../StorefrontShell/StorefrontShell'

export interface StorefrontPageShellProps extends React.HTMLAttributes<HTMLDivElement> {
  promoBar?: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  headerProps?: React.ComponentProps<typeof StorefrontHeader>
  footerProps?: React.ComponentProps<typeof StorefrontFooter>
  newsletter?: React.ReactNode
}

function StorefrontPageShell({
  promoBar,
  header,
  footer,
  headerProps,
  footerProps,
  newsletter,
  children,
  ...props
}: StorefrontPageShellProps) {
  const resolvedHeader = header ?? (
    <>
      {promoBar}
      <StorefrontHeader {...headerProps} />
    </>
  )

  const resolvedFooter = footer ?? <StorefrontFooter newsletter={newsletter} {...footerProps} />

  return (
    <StorefrontShell header={resolvedHeader} footer={resolvedFooter} {...props}>
      {children}
    </StorefrontShell>
  )
}

export { StorefrontPageShell }
