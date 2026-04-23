import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api/v1')

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

  const port = parseInt(process.env.PORT ?? '3000', 10)
  await app.listen(port)
  // eslint-disable-next-line no-console -- Startup log is useful in local/dev and containers.
  console.log(`[API] Running on http://localhost:${String(port)}`)
}

// eslint-disable-next-line no-console -- Ensure startup errors are surfaced.
bootstrap().catch(console.error)
