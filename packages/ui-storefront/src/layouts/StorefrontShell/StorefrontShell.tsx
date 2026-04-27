import { StorefrontShellFooter, type StorefrontShellFooterProps } from './components/StorefrontShellFooter'
import { StorefrontShellHeader, type StorefrontShellHeaderProps } from './components/StorefrontShellHeader'
import { StorefrontShellMain, type StorefrontShellMainProps } from './components/StorefrontShellMain'
import { StorefrontShellPromoBar, type StorefrontShellPromoBarProps } from './components/StorefrontShellPromoBar'
import { StorefrontShellRoot, type StorefrontShellRootProps } from './components/StorefrontShellRoot'

export type { StorefrontShellRootProps as StorefrontShellProps }
export type { StorefrontShellPromoBarProps, StorefrontShellHeaderProps, StorefrontShellMainProps, StorefrontShellFooterProps }

export type StorefrontShellCompound = typeof StorefrontShellRoot & {
  PromoBar: typeof StorefrontShellPromoBar
  Header: typeof StorefrontShellHeader
  Main: typeof StorefrontShellMain
  Footer: typeof StorefrontShellFooter
}

const StorefrontShell = Object.assign(StorefrontShellRoot, {
  PromoBar: StorefrontShellPromoBar,
  Header: StorefrontShellHeader,
  Main: StorefrontShellMain,
  Footer: StorefrontShellFooter,
}) as StorefrontShellCompound

export { StorefrontShell }
