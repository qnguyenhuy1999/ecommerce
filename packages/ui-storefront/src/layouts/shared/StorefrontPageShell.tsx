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
  return (
    <StorefrontShell {...props}>
      {promoBar && <StorefrontShell.PromoBar>{promoBar}</StorefrontShell.PromoBar>}
      <StorefrontShell.Header>
        {header ?? <StorefrontHeader {...headerProps} />}
      </StorefrontShell.Header>
      <StorefrontShell.Main>{children}</StorefrontShell.Main>
      <StorefrontShell.Footer>
        {footer ?? <StorefrontFooter newsletter={newsletter} {...footerProps} />}
      </StorefrontShell.Footer>
    </StorefrontShell>
  )
}

export { StorefrontPageShell }
