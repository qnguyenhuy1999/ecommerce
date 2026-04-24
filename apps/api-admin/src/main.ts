import 'reflect-metadata'
import 'dotenv/config'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import cookieParser from 'cookie-parser'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(cookieParser())

  app.setGlobalPrefix('api/v1')

  app.enableCors({
    origin: app.get(ConfigService).get('cors.origin', 'http://localhost:8001'),
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
    .setTitle('Ecommerce Admin API')
    .setDescription('Admin API for ecommerce platform management')
    .setVersion('1.0')
    .addCookieAuth('access_token')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)

  // Flush pending logs and close Redis/Postgres connections cleanly on SIGTERM.
  app.enableShutdownHooks()

  const port = parseInt(process.env.PORT ?? '3001', 10)
  await app.listen(port)
  // eslint-disable-next-line no-console -- Startup log is useful in local/dev and containers.
  console.log(`[API-ADMIN] Running on http://localhost:${String(port)}`)
}

// eslint-disable-next-line no-console -- Ensure startup errors are surfaced.
bootstrap().catch(console.error)
