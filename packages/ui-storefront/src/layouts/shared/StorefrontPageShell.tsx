import React from 'react'

import { StorefrontFooter } from '../StorefrontFooter/StorefrontFooter'
import { StorefrontHeader } from '../StorefrontHeader/StorefrontHeader'
import { StorefrontShell } from '../StorefrontShell/StorefrontShell'

export interface StorefrontPageShellProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional promo bar rendered above the global header. */
  promoBar?: React.ReactNode
  /** Custom header. When omitted, the default StorefrontHeader is rendered with `headerProps`. */
  header?: React.ReactNode
  /** Custom footer. When omitted, the default StorefrontFooter is rendered with `footerProps` + `newsletter`. */
  footer?: React.ReactNode
  headerProps?: React.ComponentProps<typeof StorefrontHeader>
  footerProps?: React.ComponentProps<typeof StorefrontFooter>
  /** Convenience prop forwarded to the default footer's newsletter slot. */
  newsletter?: React.ReactNode
}

/**
 * Single source of truth for the storefront chrome: promo bar + header + footer
 * stack. Page layouts no longer need to repeat the
 *   `<StorefrontShell header={... <StorefrontHeader/> ...} footer={...}/>`
 * pattern — they compose this and render their content as children.
 */
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
  const resolvedHeader =
    header ?? (
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
