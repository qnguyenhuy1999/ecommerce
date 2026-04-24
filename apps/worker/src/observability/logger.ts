import type { Params as LoggerModuleParams } from 'nestjs-pino'

// Worker logs are NOT HTTP-scoped — pinoHttp is still used for the shape, but
// autoLogging is disabled so we don't get spurious request logs from the tiny
// health/metrics server. Job-level correlation is added later when processors
// attach the triggering outbox-event id to their CLS context.
const REDACT_PATHS = ['req.headers.authorization', 'req.headers.cookie', '*.password', '*.token']

export function buildWorkerLoggerParams(): LoggerModuleParams {
  const isProd = process.env.NODE_ENV === 'production'
  const level = process.env.LOG_LEVEL ?? (isProd ? 'info' : 'debug')

  return {
    pinoHttp: {
      level,
      transport: isProd
        ? undefined
        : {
            target: 'pino-pretty',
            options: {
              singleLine: true,
              translateTime: 'SYS:HH:mm:ss.l',
              ignore: 'pid,hostname,req,res,responseTime',
            },
          },
      customProps: () => ({ service: 'worker' }),
      redact: { paths: REDACT_PATHS, censor: '[REDACTED]' },
      autoLogging: false,
    },
  }
}
