import 'reflect-metadata'
import 'dotenv/config'
import { ValidationPipe, type INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import cookieParser from 'cookie-parser'
import type { NextFunction, Request, Response } from 'express'
import helmet from 'helmet'
import { Logger } from 'nestjs-pino'

import { AppModule } from './app.module'

function hasErrorCode(error: unknown): error is { code: string } {
  return typeof error === 'object' && error !== null && 'code' in error && typeof error.code === 'string'
}

async function listenWithFallback(
  app: INestApplication,
  port: number,
  attemptsLeft = 10,
): Promise<number> {
  try {
    await app.listen(port)
    return port
  } catch (error: unknown) {
    if (hasErrorCode(error) && error.code === 'EADDRINUSE' && attemptsLeft > 1) {
      return listenWithFallback(app, port + 1, attemptsLeft - 1)
    }
    throw error
  }
}

async function bootstrap() {
  // `bufferLogs: true` queues bootstrap logs until the pino logger is resolved
  // from the ObservabilityModule. Without it, early logs (module init, route
  // discovery) fall through to the default Nest console logger and miss
  // correlation IDs / redaction.
  const app = await NestFactory.create(AppModule, { bufferLogs: true, rawBody: true })
  const logger = app.get(Logger)
  const configService = app.get(ConfigService)

  app.useLogger(logger)
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          baseUri: ["'self'"],
          frameAncestors: ["'none'"],
          objectSrc: ["'none'"],
          scriptSrc: ["'self'", 'https://js.stripe.com'],
          frameSrc: ["'self'", 'https://js.stripe.com', 'https://hooks.stripe.com'],
          connectSrc: ["'self'", 'https://api.stripe.com'],
          imgSrc: ["'self'", 'data:', 'https:'],
          styleSrc: ["'self'", "'unsafe-inline'"],
        },
      },
    }),
  )
  app.use(cookieParser())
  app.use((req: Request, res: Response, next: NextFunction) => {
    const method = req.method.toUpperCase()
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      next()
      return
    }
    if (req.path.endsWith('/payments/webhook')) {
      next()
      return
    }

    const allowedOrigin = configService.get<string>('cors.origin') ?? 'http://localhost:8000'
    const origin = req.headers.origin
    if (origin && origin !== allowedOrigin) {
      res.status(403).json({ success: false, error: { code: 'CSRF_ORIGIN_DENIED' } })
      return
    }
    next()
  })

  app.setGlobalPrefix('api/v1', {
    // Health + metrics probes MUST be reachable without the /api/v1 prefix —
    // orchestrators and Prometheus scrapers don't know about versioned APIs.
    exclude: ['health/(.*)', 'metrics', 'admin/queues/(.*)'],
  })

  app.enableCors({
    origin: configService.get<string>('cors.origin') ?? 'http://localhost:8000',
    credentials: true,
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  )

  try {
    const config = new DocumentBuilder()
      .setTitle('Ecommerce API')
      .setDescription('Multi-vendor ecommerce marketplace API')
      .setVersion('1.0')
      .addCookieAuth('access_token')
      .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('docs', app, document)
  } catch (error: unknown) {
    logger.warn({ error }, 'Swagger docs disabled: failed to generate document')
  }

  // Flush pending logs and close Redis/Postgres connections cleanly on SIGTERM.
  app.enableShutdownHooks()

  const requestedPort = parseInt(process.env.PORT ?? '3000', 10)
  const port = await listenWithFallback(app, requestedPort)
  if (port !== requestedPort) {
    logger.warn(`Port ${String(requestedPort)} is in use; listening on ${String(port)} instead`)
  }
  logger.log(`API listening on http://localhost:${String(port)}`)
}

// eslint-disable-next-line no-console -- Ensure startup errors are surfaced.
bootstrap().catch(console.error)
