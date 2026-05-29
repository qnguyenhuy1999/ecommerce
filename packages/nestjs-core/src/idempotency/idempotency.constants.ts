export const IDEMPOTENCY_KEY_HEADER = 'idempotency-key' as const

export const IDEMPOTENCY_STATUS = {
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const
