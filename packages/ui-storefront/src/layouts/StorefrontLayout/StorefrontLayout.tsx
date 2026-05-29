import type { ReactNode } from 'react'
import {
  storefrontFooterColumns,
  storefrontHeader,
  storefrontNavigation,
  storefrontUtilityLinks,
} from './StorefrontLayout.fixtures'
import { StorefrontFooter } from './StorefrontFooter'
import { StorefrontAnnouncement, StorefrontHeader, StorefrontNavigation } from './StorefrontHeader'
import type { StorefrontLayoutProps } from './StorefrontLayout.types'

function Content({ children }: { children: ReactNode }) {
  return <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">{children}</main>
}

function StorefrontLayoutBase({
  children,
  announcement = 'Free shipping on orders over $30 · 7-day returns · Verified shops',
  utilityLinks = storefrontUtilityLinks,
  header = storefrontHeader,
  navigation = storefrontNavigation,
  footerColumns = storefrontFooterColumns,
}: StorefrontLayoutProps) {
  return (
    <div className="bg-accent min-h-screen">
      <StorefrontAnnouncement announcement={announcement} links={utilityLinks} />
      <StorefrontHeader header={header} />
      <StorefrontNavigation navigation={navigation} />
      {children}
      <StorefrontFooter columns={footerColumns} />
    </div>
  )
}

type StorefrontLayoutComponent = typeof StorefrontLayoutBase & {
  Content: typeof Content
  Header: typeof StorefrontHeader
  Footer: typeof StorefrontFooter
}

export const StorefrontLayout: StorefrontLayoutComponent = Object.assign(StorefrontLayoutBase, {
  Content,
  Header: StorefrontHeader,
  Footer: StorefrontFooter,
})
