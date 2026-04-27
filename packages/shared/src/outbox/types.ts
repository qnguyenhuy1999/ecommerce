// Shared outbox/event contracts. Kept in @ecom/shared so both the API
// (producer) and the worker (consumer/publisher) agree on the envelope without
// pulling in the Prisma client in frontend packages.

// BullMQ queue name used by the outbox drainer to publish events to the
// in-process event bus (today) or to a Kafka topic forwarder (tomorrow).
export const OUTBOX_QUEUE_NAME = 'outbox'
export const OUTBOX_DRAIN_JOB_NAME = 'drain-batch'

// Aggregate types we emit events for. Kept narrow on purpose: every new
// aggregate should be a conscious architectural decision, not drive-by.
export const OutboxAggregateType = {
  Order: 'Order',
  SubOrder: 'SubOrder',
  Payment: 'Payment',
  InventoryReservation: 'InventoryReservation',
  Seller: 'Seller',
} as const
export type OutboxAggregateType = (typeof OutboxAggregateType)[keyof typeof OutboxAggregateType]

// Event types. Add new events here; the string value is what consumers match
// on, so treat these as a public contract (semver on changes).
export const OutboxEventType = {
  OrderCreated: 'order.created',
  OrderPaid: 'order.paid',
  OrderCancelled: 'order.cancelled',
  OrderPaidLegacy: 'ORDER_PAID',
  OrderCancelledLegacy: 'ORDER_CANCELLED',
  OrderRefundedLegacy: 'ORDER_REFUNDED',
  OrderPendingRefundLegacy: 'ORDER_PENDING_REFUND',
  OrderRefundPendingLegacy: 'ORDER_REFUND_PENDING',
  OrderShippedLegacy: 'ORDER_SHIPPED',
  SubOrderProcessingLegacy: 'SUB_ORDER_PROCESSING',
  SubOrderShippedLegacy: 'SUB_ORDER_SHIPPED',
  SubOrderCompletedLegacy: 'SUB_ORDER_COMPLETED',
  SubOrderCancelledLegacy: 'SUB_ORDER_CANCELLED',
  PaymentSucceeded: 'payment.succeeded',
  PaymentFailed: 'payment.failed',
  PaymentSucceededLegacy: 'PAYMENT_SUCCESS',
  PaymentFailedLegacy: 'PAYMENT_FAILED',
  InventoryReserved: 'inventory.reserved',
  InventoryReleased: 'inventory.released',
  InventoryAdjusted: 'inventory.adjusted',
  InventoryDriftDetected: 'inventory.drift_detected',
  SellerApproved: 'seller.approved',
  SellerRejected: 'seller.rejected',
  SellerKycApprovedLegacy: 'SELLER_KYC_APPROVED',
  SellerKycRejectedLegacy: 'SELLER_KYC_REJECTED',
} as const
export type OutboxEventType = (typeof OutboxEventType)[keyof typeof OutboxEventType]

// Drain job input. The drainer polls PENDING rows; the batchSize tunes
// throughput vs. latency. maxAttempts caps retry and forces a row into FAILED.
export interface OutboxDrainJobData {
  batchSize?: number
  maxAttempts?: number
}

// Envelope shipped onto the BullMQ queue once a row is drained. Consumers
// receive this directly and MUST NOT reach back into the OutboxEvent table.
export interface OutboxEnvelope<TPayload = unknown> {
  outboxId: string
  aggregateType: OutboxAggregateType
  aggregateId: string
  eventType: OutboxEventType
  payload: TPayload
  createdAt: string
}
