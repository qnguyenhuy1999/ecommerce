import type React from 'react'

import { type CartPageLayoutProps, CartPageLayoutRoot } from './components/CartPageLayoutRoot'
import {
  CartPageLayoutItems,
  type CartPageLayoutSectionProps,
} from './components/CartPageLayoutItems'
import { CartPageLayoutAside } from './components/CartPageLayoutAside'
import { CartPageEmptyState, type CartPageEmptyStateProps } from './components/CartPageEmptyState'
import {
  CartPageLayoutLoading,
  type CartPageLoadingProps,
} from './components/CartPageLayoutLoading'

interface CartPageLayoutCompound {
  Items: React.FC<CartPageLayoutSectionProps>
  Aside: React.FC<CartPageLayoutSectionProps>
  EmptyState: React.FC<CartPageEmptyStateProps>
  Loading: React.FC<CartPageLoadingProps>
}

export type CartPageLayoutComponent = React.FC<CartPageLayoutProps> & CartPageLayoutCompound

const CartPageLayout = Object.assign(CartPageLayoutRoot, {
  Items: CartPageLayoutItems,
  Aside: CartPageLayoutAside,
  EmptyState: CartPageEmptyState,
  Loading: CartPageLayoutLoading,
}) as CartPageLayoutComponent

export { CartPageLayout }
export type { CartPageLayoutProps }
