import type { Socket } from 'socket.io'

const DEV_CORS_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
] as const

export function resolveSocketCorsOrigins(): string[] {
  const raw = process.env.CHAT_CORS_ORIGINS
  if (raw && raw.trim().length > 0) {
    return raw
      .split(',')
      .map((origin) => origin.trim())
      .filter((origin) => origin.length > 0)
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'CHAT_CORS_ORIGINS must be set in production to enable the chat WebSocket gateway',
    )
  }

  return [...DEV_CORS_ORIGINS]
}

export function parseCookieHeader(header: string | undefined): Record<string, string> {
  if (!header) return {}

  const out: Record<string, string> = {}
  for (const part of header.split(';')) {
    const [rawKey, ...rawVal] = part.split('=')
    if (!rawKey) continue

    const key = rawKey.trim()
    if (!key) continue

    const value = rawVal.join('=').trim()
    try {
      out[key] = decodeURIComponent(value)
    } catch {
      out[key] = value
    }
  }

  return out
}

export function extractSocketSessionId(client: Socket, cookieName: string): string | undefined {
  const cookieHeader =
    typeof client.handshake.headers.cookie === 'string'
      ? client.handshake.headers.cookie
      : undefined
  const cookies = parseCookieHeader(cookieHeader)
  const fromCookie = cookies[cookieName]
  if (typeof fromCookie === 'string' && fromCookie.length > 0) {
    return fromCookie
  }

  const auth = client.handshake.auth as unknown
  if (auth && typeof auth === 'object') {
    const token = (auth as Record<string, unknown>).token
    if (typeof token === 'string' && token.length > 0) {
      return token
    }
  }

  return undefined
}

export function createPresenceKey(scope: string, subjectId: string): string {
  return `presence:${scope}:${subjectId}`
}

export function toSocketError<TCode extends string>(
  err: unknown,
  statusCodeMap: Partial<Record<number, TCode>>,
  fallbackMessage: string,
  fallbackCode: TCode,
): { code: TCode; message: string } {
  if (err && typeof err === 'object' && 'status' in err) {
    const status = err.status
    const code = typeof status === 'number' ? statusCodeMap[status] : undefined
    if (code !== undefined) {
      return {
        code,
        message: err instanceof Error ? err.message : fallbackMessage,
      }
    }
  }

  return { code: fallbackCode, message: fallbackMessage }
}
