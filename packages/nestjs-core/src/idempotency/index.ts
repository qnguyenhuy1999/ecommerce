import { createHash } from 'node:crypto'

export const IDEMPOTENCY_KEY_HEADER = 'idempotency-key' as const

export const IDEMPOTENCY_STATUS = {
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const

export type IdempotencyStatus = (typeof IDEMPOTENCY_STATUS)[keyof typeof IDEMPOTENCY_STATUS]

export interface IdempotencyScope {
  resource: string
  action: string
}

export function normalizeIdempotencyKey(value: string | string[] | undefined): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value
  const normalized = raw?.trim()
  return normalized || undefined
}

export function createIdempotencyScope({ resource, action }: IdempotencyScope): string {
  return `${resource.trim()}:${action.trim()}`
}

export function hashIdempotentPayload(payload: unknown): string {
  return createHash('sha256')
    .update(JSON.stringify(payload ?? null))
    .digest('hex')
}
