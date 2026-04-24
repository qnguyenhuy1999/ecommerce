import { Injectable } from '@nestjs/common'

import type { CartItemEntity } from '../../domain/entities/cart-item.entity'
import type { CartEntity } from '../../domain/entities/cart.entity'
import type { CartItemView, CartView, SellerGroupView } from '../views/cart.view'

@Injectable()
export class CartViewService {
  toView(cart: CartEntity): CartView {
    const items = cart.items.map((item) => this.toItemView(item))
    const subtotal = cart.subtotal()
    const itemCount = cart.itemCount()
    const sellerGroups = this.groupBySeller(cart.items, items)

    return {
      id: cart.id,
      items,
      subtotal,
      sellerGroups,
      itemCount,
    }
  }

  private toItemView(item: CartItemEntity): CartItemView {
    const variant = item.variant
    if (!variant) {
      throw new Error(
        `Cart item ${item.id} is missing its variant. Repository must hydrate variants before building the view.`,
      )
    }
    return {
      id: item.id,
      quantity: item.quantity,
      variant: {
        id: variant.props.id,
        sku: variant.props.sku,
        attributes: variant.props.attributes,
        priceOverride: variant.props.priceOverride,
        effectivePrice: variant.effectivePrice,
        product: { id: variant.props.product.id, name: variant.props.product.name },
      },
      seller: {
        id: variant.props.product.seller.id,
        storeName: variant.props.product.seller.storeName,
      },
    }
  }

  private groupBySeller(entities: CartItemEntity[], views: CartItemView[]): SellerGroupView[] {
    const groups = new Map<string, SellerGroupView>()
    for (const [index, view] of views.entries()) {
      const entity = entities[index]
      const lineTotal = entity.lineSubtotal()
      const existing = groups.get(view.seller.id)
      if (existing) {
        existing.items.push(view)
        existing.subtotal += lineTotal
      } else {
        groups.set(view.seller.id, {
          sellerId: view.seller.id,
          storeName: view.seller.storeName,
          items: [view],
          subtotal: lineTotal,
        })
      }
    }
    return Array.from(groups.values())
  }
}
