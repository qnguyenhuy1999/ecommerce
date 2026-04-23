import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { Logger } from 'nestjs-pino'

import { AppModule } from './app.module'

async function bootstrap() {
  // `bufferLogs: true` queues bootstrap logs until the pino logger is resolved
  // from the ObservabilityModule. Without it, early logs (module init, route
  // discovery) fall through to the default Nest console logger and miss
  // correlation IDs / redaction.
  const app = await NestFactory.create(AppModule, { bufferLogs: true })
  app.useLogger(app.get(Logger))

  app.setGlobalPrefix('api/v1', {
    // Health + metrics probes MUST be reachable without the /api/v1 prefix —
    // orchestrators and Prometheus scrapers don't know about versioned APIs.
    exclude: ['health/(.*)', 'metrics', 'admin/queues/(.*)'],
  })

  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:8000',
    credentials: true,
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  )

  const config = new DocumentBuilder()
    .setTitle('Ecommerce API')
    .setDescription('Multi-vendor ecommerce marketplace API')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)

  // Flush pending logs and close Redis/Postgres connections cleanly on SIGTERM.
  app.enableShutdownHooks()

  const port = parseInt(process.env.PORT ?? '3000', 10)
  await app.listen(port)
  app.get(Logger).log(`API listening on http://localhost:${String(port)}`)
}

// eslint-disable-next-line no-console -- Ensure startup errors are surfaced.
bootstrap().catch(console.error)
