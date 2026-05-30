import { NestFactory } from '@nestjs/core'
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common'
import cookieParser from 'cookie-parser'
import { ensureWorkspaceEnvFileLoaded } from '@ecom/config'
async function bootstrap() {
  ensureWorkspaceEnvFileLoaded()

  const [
    { AppModule },
    { AllExceptionsFilter, RedisIoAdapter, ResponseInterceptor, requestIdMiddleware },
    { buildSwaggerDocument },
    { getCorsOrigins, getStorefrontPort },
  ] = await Promise.all([
    import('./app.module'),
    import('@ecom/nestjs-core'),
    import('@ecom/nestjs-core/openapi'),
    import('@ecom/config'),
  ])

  const app = await NestFactory.create(AppModule)
  const logger = new Logger('Bootstrap')

  const redisIoAdapter = new RedisIoAdapter(app)
  redisIoAdapter.connectToRedis()
  app.useWebSocketAdapter(redisIoAdapter)

  app.use(cookieParser())
  app.use(requestIdMiddleware)
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  })

  app.enableCors({
    origin: getCorsOrigins(),
    credentials: true,
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  app.useGlobalFilters(new AllExceptionsFilter())
  app.useGlobalInterceptors(new ResponseInterceptor())

  const document = buildSwaggerDocument(app, {
    title: 'Storefront API',
    description: 'E-commerce Storefront API documentation',
    version: '1.0.0',
    path: 'docs',
  })

  if (process.env.GENERATE_SWAGGER === 'true') {
    const fs = await import('node:fs')
    const path = await import('node:path')
    const outputPath = path.join(process.cwd(), 'openapi', 'storefront.json')
    if (!fs.existsSync(path.dirname(outputPath))) {
      fs.mkdirSync(path.dirname(outputPath), { recursive: true })
    }
    fs.writeFileSync(outputPath, JSON.stringify(document, null, 2))
    logger.log(`OpenAPI schema generated at ${outputPath}`)
    await app.close()
    process.exit(0)
  }

  const port = getStorefrontPort()
  await app.listen(port)
  logger.log(`API running on http://localhost:${port}`)
}

void bootstrap()
