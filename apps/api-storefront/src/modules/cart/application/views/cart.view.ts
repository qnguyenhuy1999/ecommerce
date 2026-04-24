export interface CartItemView {
  id: string
  quantity: number
  variant: {
    id: string
    sku: string
    attributes: unknown
    priceOverride: number | null
    effectivePrice: number
    product: { id: string; name: string }
  }
  seller: { id: string; storeName: string }
}

export interface SellerGroupView {
  sellerId: string
  storeName: string
  items: CartItemView[]
  subtotal: number
}

export interface CartView {
  id: string
  items: CartItemView[]
  subtotal: number
  sellerGroups: SellerGroupView[]
  itemCount: number
}
