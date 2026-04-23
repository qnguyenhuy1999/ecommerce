import { NestFactory } from '@nestjs/core'
import { Logger } from 'nestjs-pino'

import { WorkerModule } from './worker.module'

async function bootstrap() {
  // Buffer logs until the pino logger is resolved so module-init records are
  // captured structurally instead of via the default Nest console logger.
  const app = await NestFactory.create(WorkerModule, { bufferLogs: true })
  app.useLogger(app.get(Logger))
  app.enableShutdownHooks()

  // Dedicated health/metrics port, separate from the API's 3000 so operators
  // can scrape workers independently. 0 (ephemeral) stays supported for tests.
  const port = parseInt(process.env.WORKER_PORT ?? '3100', 10)
  await app.listen(port)
  app.get(Logger).log(`Worker listening on http://localhost:${String(port)}`)
}

void bootstrap()
