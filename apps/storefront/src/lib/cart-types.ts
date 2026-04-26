/**
 * Shape of the cart payload returned by the storefront `/api/v1/cart`
 * endpoint. The api-client returns `unknown` so we narrow it here for
 * page-level consumers. Mirrors `CartView` from the api-storefront app.
 */
export interface CartItemView {
  id: string
  quantity: number
  lineSubtotal: number
  variant: {
    id: string
    sku: string
    attributes: Record<string, string>
    priceOverride: number | null
    effectivePrice: number
    product: { id: string; name: string; images?: string[] }
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

export interface CartEnvelope {
  success: true
  data: CartView
}
