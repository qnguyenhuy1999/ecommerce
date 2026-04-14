import { NestFactory } from '@nestjs/core'

import { WorkerModule } from './worker.module'

async function bootstrap() {
  const app = await NestFactory.create(WorkerModule)
  await app.listen(0)
  // eslint-disable-next-line no-console
  console.log('[Worker] BullMQ processors running')
}

void bootstrap()
