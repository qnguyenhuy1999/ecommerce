import { SetMetadata } from '@nestjs/common'

// Marker metadata key read by IdempotencyInterceptor. Only routes decorated
// with @Idempotent() opt into idempotency-key storage; every other route is
// a no-op for the interceptor. This keeps the rollout surgical — add the
// decorator on checkout, cart mutations, and webhooks; leave reads alone.
export const IDEMPOTENT_METADATA_KEY = 'idempotent'

export interface IdempotentOptions {
  // Override the default 24h retention window. Useful for short-lived flows
  // like flash-sale checkout (e.g. 10m) where a stale retry is a client bug.
  ttlMs?: number
  // Override whether a missing Idempotency-Key header is allowed. Default
  // `required: true` rejects requests without one (per payments convention).
  required?: boolean
}

// Use on controller handlers that MUST be safely retriable:
//   @Idempotent()                  POST /orders
//   @Idempotent({ ttlMs: 600000 }) POST /orders (flash-sale)
//   @Idempotent({ required: false}) POST /cart/items
export const Idempotent = (options: IdempotentOptions = {}): MethodDecorator =>
  SetMetadata(IDEMPOTENT_METADATA_KEY, { required: true, ...options })
