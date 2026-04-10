// ─── Product Status ───────────────────────────────────────────
export const ProductStatus = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  DELETED: 'DELETED',
  OUT_OF_STOCK: 'OUT_OF_STOCK',
} as const
export type ProductStatus = (typeof ProductStatus)[keyof typeof ProductStatus]

// ─── Order Status ─────────────────────────────────────────────
export const OrderStatus = {
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  PAID: 'PAID',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
} as const
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus]

export const SubOrderStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const
export type SubOrderStatus = (typeof SubOrderStatus)[keyof typeof SubOrderStatus]

// ─── Payment Status ───────────────────────────────────────────
export const PaymentStatus = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
  PARTIAL_REFUND: 'PARTIAL_REFUND',
} as const
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus]

// ─── Inventory Reservation Status ────────────────────────────
export const ReservationStatus = {
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
} as const
export type ReservationStatus = (typeof ReservationStatus)[keyof typeof ReservationStatus]

// ─── Ledger Types ──────────────────────────────────────────────
export const LedgerType = {
  CREDIT: 'CREDIT',
  DEBIT: 'DEBIT',
} as const
export type LedgerType = (typeof LedgerType)[keyof typeof LedgerType]

// ─── Notification Types ───────────────────────────────────────
export const NotificationType = {
  ORDER_PLACED: 'ORDER_PLACED',
  ORDER_PAID: 'ORDER_PAID',
  ORDER_SHIPPED: 'ORDER_SHIPPED',
  ORDER_COMPLETED: 'ORDER_COMPLETED',
  REFUND_APPROVED: 'REFUND_APPROVED',
  SELLER_APPROVED: 'SELLER_APPROVED',
  SELLER_REJECTED: 'SELLER_REJECTED',
  LOW_STOCK: 'LOW_STOCK',
  GENERAL: 'GENERAL',
} as const
export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType]

// ─── Defaults ──────────────────────────────────────────────────
export const DEFAULT_COMMISSION_RATE = 0.05
export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100
export const DEFAULT_PAGE = 1
export const RESERVATION_TTL_MINUTES = 30
export const ORDER_EXPIRATION_MINUTES = 30
