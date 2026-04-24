// Idempotency primitives shared between any server that stores idempotency
// records and any tooling that inspects them.
//
// Design notes:
// - The `Idempotency-Key` header is client-supplied. We do NOT trust it as the
//   whole uniqueness guarantee; the stored unique key is the tuple
//   (key, userId, method, path) so two different tenants can safely reuse the
//   same UUID, and the same user hitting a different route with the same key
//   is treated as a different operation.
// - Request body hashing is done server-side (see IdempotencyInterceptor) to
//   keep this module free of Node-specific APIs — allowing it to be imported
//   by edge/browser code without pulling in @types/node.
// - `MIN_KEY_LENGTH`/`MAX_KEY_LENGTH` follow the Stripe/PayPal convention.

export const IDEMPOTENCY_HEADER = 'idempotency-key'

export const MIN_KEY_LENGTH = 8
export const MAX_KEY_LENGTH = 255

// Default retention for a stored idempotency record. Long enough that a mobile
// client on a flaky network can safely retry, short enough to keep the table
// small. Adjust per-route by passing `ttlMs` to the interceptor.
export const DEFAULT_IDEMPOTENCY_TTL_MS = 24 * 60 * 60 * 1000

export class IdempotencyKeyInvalidError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'IdempotencyKeyInvalidError'
  }
}

export function assertValidIdempotencyKey(key: string): void {
  if (typeof key !== 'string') {
    throw new IdempotencyKeyInvalidError('Idempotency-Key must be a string')
  }
  if (key.length < MIN_KEY_LENGTH || key.length > MAX_KEY_LENGTH) {
    throw new IdempotencyKeyInvalidError(
      `Idempotency-Key length must be between ${String(MIN_KEY_LENGTH)} and ${String(MAX_KEY_LENGTH)} characters`,
    )
  }
  // Restrict to printable ASCII to avoid log-injection / storage edge cases.
  // Using an explicit character class (no \x escapes) keeps the regex portable.
  if (!/^[ -~]+$/.test(key)) {
    throw new IdempotencyKeyInvalidError(
      'Idempotency-Key must contain only printable ASCII characters',
    )
  }
}

// Canonical JSON stringify: sort object keys so semantically-equal bodies hash
// the same. Arrays keep order (client intent). Undefined values are dropped.
// Exposed for the server-side hash helper and for tests.
export function canonicalStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value ?? null)
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => canonicalStringify(item)).join(',')}]`
  }
  const record = value as Record<string, unknown>
  const keys = Object.keys(record).sort()
  const parts: string[] = []
  for (const k of keys) {
    const v = record[k]
    if (v === undefined) continue
    parts.push(`${JSON.stringify(k)}:${canonicalStringify(v)}`)
  }
  return `{${parts.join(',')}}`
}

export function computeExpiresAt(
  ttlMs: number = DEFAULT_IDEMPOTENCY_TTL_MS,
  now: Date = new Date(),
): Date {
  return new Date(now.getTime() + ttlMs)
}
