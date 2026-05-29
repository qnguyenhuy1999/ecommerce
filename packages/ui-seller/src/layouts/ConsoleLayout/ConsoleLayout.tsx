'use client'

import {
  ConsoleLayout as CoreConsoleLayout,
  Root as CoreRoot,
  type SidebarGroup,
} from '@ecom/core-ui'
import { LogOut } from 'lucide-react'
import { withDefined } from '@ecom/shared'
import {
  buildSidebarGroups,
  type ConsoleLayoutProps,
  defaultSidebarAccount,
  defaultSidebarGroups,
  defaultUserMenu,
  defaultWorkspaceSwitcher,
} from './ConsoleLayout.utils'

function ConsoleLayoutBase({
  children,
  pathname,
  loading = false,
  chatUnreadCount = 0,
  sidebarGroups = defaultSidebarGroups,
  sidebarAccount = defaultSidebarAccount,
  workspaceSwitcher = defaultWorkspaceSwitcher,
  searchPlaceholder = 'Search orders, products, buyers...',
  balanceLabel = 'Balance · $4,820',
  notificationCount = 3,
  storefrontLabel = 'Storefront',
  userMenu = defaultUserMenu,
  contentClassName,
  onLogout,
}: ConsoleLayoutProps) {
  const resolvedSidebarGroups: SidebarGroup[] = buildSidebarGroups({
    pathname,
    sidebarGroups,
    chatUnreadCount,
    notificationCount,
  })

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2" />
      </div>
    )
  }

  return (
    <CoreConsoleLayout
      sidebarGroups={resolvedSidebarGroups}
      sidebarAccount={sidebarAccount}
      workspaceSwitcher={workspaceSwitcher}
      searchPlaceholder={searchPlaceholder}
      balanceLabel={balanceLabel}
      notificationCount={notificationCount}
      storefrontLabel={storefrontLabel}
      userMenu={userMenu}
      {...withDefined({
        contentClassName,
        sidebarFooter: onLogout ? (
          <button
            type="button"
            onClick={() => {
              void onLogout()
            }}
            className="hover:bg-muted hover:text-foreground text-muted-foreground flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors"
          >
            <LogOut className="size-4 shrink-0" />
            Logout
          </button>
        ) : undefined,
      })}
    >
      {children}
    </CoreConsoleLayout>
  )
}

type ConsoleLayoutComponent = typeof ConsoleLayoutBase & {
  Root: typeof CoreRoot
}

export const ConsoleLayout: ConsoleLayoutComponent = Object.assign(ConsoleLayoutBase, {
  Root: CoreRoot,
})

export const Root: typeof CoreRoot = CoreRoot
