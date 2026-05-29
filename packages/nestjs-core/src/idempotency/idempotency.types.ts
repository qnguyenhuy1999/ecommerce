import type { IDEMPOTENCY_STATUS } from './idempotency.constants'

export type IdempotencyStatus = (typeof IDEMPOTENCY_STATUS)[keyof typeof IDEMPOTENCY_STATUS]

export interface IdempotencyScope {
  resource: string
  action: string
}
