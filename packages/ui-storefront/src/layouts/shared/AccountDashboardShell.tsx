import React from 'react'

import { Menu } from 'lucide-react'

import { Button, Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, cn } from '@ecom/ui'

import { AccountSidebar } from '../../molecules/AccountSidebar/AccountSidebar'
import type { AccountSidebarProps } from '../../molecules/AccountSidebar/AccountSidebar'

export interface AccountDashboardShellProps {
  /** Account sidebar configuration. Required when rendering the dashboard chrome. */
  sidebarProps: AccountSidebarProps
  /**
   * Mobile-only nav trigger label, shown in the page-level affordance that
   * opens the sidebar in a Sheet on small screens. Defaults to "Account menu".
   */
  mobileTriggerLabel?: string
  children: React.ReactNode
  className?: string
}

/**
 * Shared chrome for any "My account" page (Profile, Orders, Order detail,
 * Wishlist, Addresses, Settings, ...). Renders the canonical AccountSidebar
 * sticky on `lg+` and behind a Sheet drawer on mobile, so every account-context
 * layout presents the same navigation without each layout reimplementing the
 * grid + sticky offset + responsive drawer pattern.
 *
 * The sticky `top` reads `--storefront-header-total` published by
 * StorefrontShell so it stays flush below the full sticky header even when the
 * header renders an optional category-nav row.
 */
export function AccountDashboardShell({
  sidebarProps,
  mobileTriggerLabel = 'Account menu',
  children,
  className,
}: AccountDashboardShellProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const handleItemClick = React.useCallback(
    (id: string) => {
      sidebarProps.onItemClick?.(id)
      setMobileOpen(false)
    },
    [sidebarProps],
  )

  const handleLogout = React.useCallback(() => {
    sidebarProps.onLogout?.()
    setMobileOpen(false)
  }, [sidebarProps])

  return (
    <div className={cn('grid gap-6 lg:grid-cols-[280px_1fr] lg:items-start', className)}>
      {/* Mobile-only trigger: opens the sidebar in a Sheet on < lg. */}
      <div className="lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1.5"
              aria-label={mobileTriggerLabel}
            >
              <Menu className="h-4 w-4" aria-hidden="true" />
              {mobileTriggerLabel}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[18rem] p-4 sm:w-[20rem]">
            <SheetHeader className="mb-4 text-left">
              <SheetTitle className="text-[length:var(--text-base)]">My account</SheetTitle>
            </SheetHeader>
            <AccountSidebar
              {...sidebarProps}
              onItemClick={handleItemClick}
              onLogout={sidebarProps.onLogout ? handleLogout : undefined}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sticky rail. */}
      <div className="hidden lg:sticky lg:top-[calc(var(--storefront-header-total)+var(--space-6))] lg:block">
        <AccountSidebar {...sidebarProps} />
      </div>

      <div className="min-w-0">{children}</div>
    </div>
  )
}
