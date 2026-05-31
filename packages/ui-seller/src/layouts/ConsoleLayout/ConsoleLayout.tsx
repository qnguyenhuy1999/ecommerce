import {
  ConsoleLayout as CoreConsoleLayout,
  Root as CoreRoot,
} from '@ecom/core-ui/layouts/ConsoleLayout'
import type { SidebarGroup } from '@ecom/core-ui/organisms/Sidebar'
import { withDefined } from '@ecom/shared/utils/optional-object'
import { ConsoleLogoutButton } from './ConsoleLogoutButton.client'
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
    sidebarGroups,
    chatUnreadCount,
    notificationCount,
    ...(pathname !== undefined ? { pathname } : {}),
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
        sidebarFooter: onLogout ? <ConsoleLogoutButton onLogout={onLogout} /> : undefined,
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
