import type { ReactNode } from 'react'

export interface StorefrontNavItem {
  label: string
  href?: string
}

export interface StorefrontFooterColumn {
  title: string
  links: StorefrontNavItem[]
}

export interface StorefrontLayoutProps {
  children: ReactNode
  announcement?: string
  utilityLinks?: StorefrontNavItem[]
  navigation?: StorefrontNavItem[]
  footerColumns?: StorefrontFooterColumn[]
}
