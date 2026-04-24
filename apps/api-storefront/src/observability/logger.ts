import type { Params as LoggerModuleParams } from 'nestjs-pino'
import { randomUUID } from 'node:crypto'
import type { IncomingMessage } from 'node:http'

// Correlation / request ID header names we accept (in priority order).
const REQUEST_ID_HEADERS = ['x-request-id', 'x-correlation-id']

// Fields to redact from log output. `authorization` covers JWTs; `cookie` and
// `set-cookie` cover session cookies; `*.password`/`*.token` catch body fields
// that happen to leak. Extend as new sensitive fields are added to payloads.
const REDACT_PATHS = [
  'req.headers.authorization',
  'req.headers.cookie',
  'res.headers["set-cookie"]',
  'req.body.password',
  'req.body.token',
  'req.body.refreshToken',
  'req.body.idempotencyKey',
  '*.password',
  '*.token',
]

function resolveRequestId(req: IncomingMessage): string {
  for (const header of REQUEST_ID_HEADERS) {
    const value = req.headers[header]
    if (typeof value === 'string' && value.length > 0) return value
    if (Array.isArray(value) && value[0]) return value[0]
  }
  return randomUUID()
}

// nestjs-pino wires pino-http into the HTTP pipeline. Each request gets a
// `req.id` (correlation ID) injected into every downstream log line via
// ClsModule so module-level loggers like `Logger(ServiceName)` also carry it.
export function buildLoggerParams(): LoggerModuleParams {
  const isProd = process.env.NODE_ENV === 'production'
  const level = process.env.LOG_LEVEL ?? (isProd ? 'info' : 'debug')

  return {
    pinoHttp: {
      level,
      // Keep production logs as structured JSON (one record per line, consumed
      // by Datadog/CloudWatch/etc.). In dev, pipe through pino-pretty for
      // human-readable output.
      transport: isProd
        ? undefined
        : {
            target: 'pino-pretty',
            options: {
              singleLine: true,
              translateTime: 'SYS:HH:mm:ss.l',
              ignore: 'pid,hostname,req.headers,res.headers',
            },
          },
      genReqId: (req) => resolveRequestId(req),
      customProps: () => ({ service: 'api-storefront' }),
      redact: {
        paths: REDACT_PATHS,
        censor: '[REDACTED]',
      },
      // Reduce noise: health checks don't need full request logs, and 4xx are
      // operationally less interesting than 5xx.
      customLogLevel: (_req, res, err) => {
        if (err || res.statusCode >= 500) return 'error'
        if (res.statusCode >= 400) return 'warn'
        return 'info'
      },
      autoLogging: {
        ignore: (req) => {
          const url = req.url ?? ''
          return (
            url.startsWith('/health') ||
            url.startsWith('/metrics') ||
            url.startsWith('/api/v1/health') ||
            url.startsWith('/api/v1/metrics')
          )
        },
      },
    },
  }
}
