export interface OrderItemRecord {
  id: string
  productName: string
  quantity: number
  unitPriceLabel: string
  totalPriceLabel: string
}

export interface OrderShipmentRecord {
  id: string
  status: string
  trackingNumber: string | null
}

export interface SellerOrderRecord {
  id: string
  shopName: string
  status: string
  subtotalLabel: string
  items: OrderItemRecord[]
  shipment: OrderShipmentRecord | null
}

export interface OrderDetailRecord {
  id: string
  shortId: string
  status: string
  totalAmountLabel: string
  sellerCount: number
  createdAtLabel: string
  canForceCancel: boolean
  canForceComplete: boolean
  sellerOrders: SellerOrderRecord[]
}

export interface OrderDetailProps {
  order?: OrderDetailRecord
  loading?: boolean
  backHref?: string
  forceCancelLabel?: string
  forceCompleteLabel?: string
  onForceCancel?: (() => void | Promise<void>) | undefined
  onForceComplete?: (() => void | Promise<void>) | undefined
}
