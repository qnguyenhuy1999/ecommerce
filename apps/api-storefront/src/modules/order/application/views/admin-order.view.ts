import type { OrderStatusView } from './order-summary.view'

export interface AdminOrderShippingTracking {
  carrier: string
  trackingNumber: string
}

export interface AdminOrderItemView {
  id: string
  variantId: string
  productName: string
  variantSku: string
  attributes: Record<string, unknown>
  quantity: number
  unitPrice: number
}

export interface AdminSubOrderView {
  id: string
  sellerId: string
  storeName: string
  subtotal: number
  status: OrderStatusView
  shippingTracking: AdminOrderShippingTracking | null
  items: AdminOrderItemView[]
}

export interface AdminOrderSummaryView {
  id: string
  orderNumber: string
  buyerId: string
  buyerEmail: string
  status: OrderStatusView
  subtotal: number
  shippingFee: number
  totalAmount: number
  itemCount: number
  sellerCount: number
  placedAt: string
}

export interface AdminOrderDetailView extends AdminOrderSummaryView {
  shippingAddress: Record<string, unknown>
  subOrders: AdminSubOrderView[]
  updatedAt: string
}

export interface AdminOrderListInput {
  page: number
  limit: number
  status?: OrderStatusView
  sellerId?: string
  buyerEmail?: string
  placedFrom?: Date
  placedTo?: Date
}

export interface AdminOrderListPage {
  data: AdminOrderSummaryView[]
  page: number
  limit: number
  total: number
  totalPages: number
}
