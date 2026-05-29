import type {
  ConsoleLayoutAccount,
  ConsoleLayoutProps as CoreConsoleLayoutProps,
  ConsoleLayoutSwitcher,
  ConsoleLayoutUserMenu,
  SidebarGroup,
} from '@ecom/core-ui'
import { sidebarGroups as defaultSidebarGroups } from './ConsoleLayout.fixtures'

export { defaultSidebarGroups }

export const defaultSidebarAccount: ConsoleLayoutAccount = {
  name: 'Halo Seller',
  subtitle: 'Lumen Audio Official',
  avatarUrl: 'https://github.com/evilrabbit.png',
  avatarAlt: 'Halo Seller',
  avatarFallback: 'HS',
}

export const defaultWorkspaceSwitcher: ConsoleLayoutSwitcher = {
  label: 'Seller Center',
  items: ['Seller Center', 'Buyer Account'],
}

export const defaultUserMenu: ConsoleLayoutUserMenu = {
  name: 'Evil Rabbit',
  email: 'evil.rabbit@example.com',
  avatarUrl: 'https://github.com/evilrabbit.png',
  avatarAlt: '@evilrabbit',
  avatarFallback: 'ER',
}

export type ConsoleLayoutProps = CoreConsoleLayoutProps & {
  pathname?: string
  loading?: boolean
  chatUnreadCount?: number
  onLogout?: () => void | Promise<void>
}

const normalizePath = (pathname: string) => {
  if (pathname === '/') return pathname

  let end = pathname.length

  while (end > 1 && pathname[end - 1] === '/') {
    end--
  }

  return pathname.slice(0, end)
}

const isActivePath = (pathname: string, href?: string) => {
  if (!href) return false
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function buildSidebarGroups({
  pathname,
  sidebarGroups = defaultSidebarGroups,
  chatUnreadCount = 0,
  notificationCount,
}: Pick<
  ConsoleLayoutProps,
  'pathname' | 'sidebarGroups' | 'chatUnreadCount' | 'notificationCount'
>) {
  const activePath = pathname ? normalizePath(pathname) : undefined

  return sidebarGroups.map((group) => ({
    ...group,
    items: group.items.map((item) => {
      let badge = item.badge
      if (item.href === '/messages' && chatUnreadCount > 0) badge = chatUnreadCount
      if (item.href === '/notifications' && (notificationCount ?? 0) > 0) badge = notificationCount

      return {
        ...item,
        badge,
        isActive: activePath ? isActivePath(activePath, item.href) : item.isActive,
      }
    }),
  })) satisfies SidebarGroup[]
}
