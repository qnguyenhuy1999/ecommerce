import type React from 'react'

import type { CartListProps } from './components/CartList'
import { CartList } from './components/CartList'
import type { CartFooterProps } from './components/CartFooter'
import { CartFooter } from './components/CartFooter'
import { type CartPageLayoutProps, CartPageLayoutRoot } from './components/CartPageLayoutRoot'
import {
  CartPageLayoutMain,
  type CartPageLayoutSectionProps,
} from './components/CartPageLayoutMain'
import { CartPageLayoutSidebar } from './components/CartPageLayoutSidebar'
import { CartPageEmptyState, type CartPageEmptyStateProps } from './components/CartPageEmptyState'
import { CartPageLayoutLoading, CartPageLoadingProps } from './components/CartPageLayoutLoading'

export interface CartPageLayoutComponent extends React.FC<CartPageLayoutProps> {
  Main: React.FC<CartPageLayoutSectionProps>
  Sidebar: React.FC<CartPageLayoutSectionProps>
  Cart: React.FC<CartPageLayoutSectionProps>
  Summary: React.FC<CartPageLayoutSectionProps>
  EmptyState: React.FC<CartPageEmptyStateProps>
  Loading: React.FC<CartPageLoadingProps>
}

const CartPageLayout = Object.assign(CartPageLayoutRoot, {
  Main: CartPageLayoutMain,
  Sidebar: CartPageLayoutSidebar,
  Cart: CartPageLayoutMain,
  Summary: CartPageLayoutSidebar,
  EmptyState: CartPageEmptyState,
  Loading: CartPageLayoutLoading,
}) as CartPageLayoutComponent

export { CartFooter, CartList, CartPageLayout, CartPageEmptyState, CartPageLayoutLoading }
export { CartItem } from './components/CartItem'
export { calculateDiscountPercent, clampQuantity, formatPrice } from './utils/cartPricing'
export type { CartItemProps } from './components/CartItem'
export type { FormatPriceOptions } from './utils/cartPricing'
export type { CartFooterProps, CartListProps, CartPageLayoutProps }
