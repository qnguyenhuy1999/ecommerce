import { createHash } from 'node:crypto'
import type { IdempotencyScope } from './idempotency.types'

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
