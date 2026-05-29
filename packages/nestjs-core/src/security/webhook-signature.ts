import { createHmac, timingSafeEqual } from 'node:crypto'

export const WEBHOOK_SIGNATURE_HEADER = 'x-webhook-signature' as const
export const WEBHOOK_TIMESTAMP_HEADER = 'x-webhook-timestamp' as const
export const DEFAULT_WEBHOOK_TIMESTAMP_TOLERANCE_SECONDS = 300

export function createWebhookSignature(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('hex')
}

export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string,
): boolean {
  const expected = createWebhookSignature(payload, secret)
  const expectedBytes = Buffer.from(expected, 'hex')
  const signatureBytes = Buffer.from(signature, 'hex')
  return (
    expectedBytes.length === signatureBytes.length && timingSafeEqual(expectedBytes, signatureBytes)
  )
}

export function isWebhookTimestampWithinTolerance(
  timestampSeconds: number,
  toleranceSeconds = DEFAULT_WEBHOOK_TIMESTAMP_TOLERANCE_SECONDS,
  now = Date.now(),
): boolean {
  const timestampMs = timestampSeconds * 1000
  return Math.abs(now - timestampMs) <= toleranceSeconds * 1000
}
