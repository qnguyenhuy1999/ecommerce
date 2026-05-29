import type { ReactNode } from 'react'

export interface StorefrontNavItem {
  label: string
  href?: string
}

export interface StorefrontFooterColumn {
  title: string
  links: StorefrontNavItem[]
}

export interface StorefrontHeaderProps {
  cartCount?: number
  notificationCount?: number
  sellerLabel?: string
  chatHref?: string
  chatUnreadCount?: number
  userDisplayName?: string
  userEmail?: string
  userAvatarUrl?: string
  userInitials?: string
  onLogout?: () => void | Promise<void>
}

export interface StorefrontLayoutProps {
  children: ReactNode
  announcement?: string
  utilityLinks?: StorefrontNavItem[]
  header?: StorefrontHeaderProps | undefined
  navigation?: StorefrontNavItem[]
  footerColumns?: StorefrontFooterColumn[]
}
