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
  PaymentSucceeded: 'payment.succeeded',
  PaymentFailed: 'payment.failed',
  InventoryReserved: 'inventory.reserved',
  InventoryReleased: 'inventory.released',
  SellerApproved: 'seller.approved',
  SellerRejected: 'seller.rejected',
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
