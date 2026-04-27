export type OrderStatusView =
  | 'PENDING_PAYMENT'
  | 'PAID'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'PENDING_REFUND'

export interface OrderItemSummaryView {
  id: string
  variantId: string
  productName: string
  variantSku: string
  attributes: unknown
  quantity: number
  unitPrice: number
  priceSnapshot: Record<string, unknown>
}

export interface SubOrderSummaryView {
  id: string
  sellerId: string
  storeName: string
  subtotal: number
  status: OrderStatusView
  items: OrderItemSummaryView[]
}

export interface OrderSummaryView {
  orderId: string
  orderNumber: string
  status: OrderStatusView
  subtotal: number
  shippingFee: number
  totalAmount: number
  shippingAddress?: unknown
  subOrders: SubOrderSummaryView[]
  createdAt?: string
  updatedAt?: string
}
