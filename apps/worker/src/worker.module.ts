import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from '@ecom/database';
import { OUTBOX_QUEUE_NAME } from '@ecom/shared';

import { CommissionProcessor } from './processors/commission.processor';
import { EmailProcessor } from './processors/email.processor';
import { InventoryReconciliationProcessor } from './processors/inventory-reconciliation.processor';
import { OrderExpirationProcessor } from './processors/order-expiration.processor';
import { OutboxDrainerProcessor } from './processors/outbox-drainer.processor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
      },
    }),
    PrismaModule,
    BullModule.registerQueue(
      { name: 'email' },
      { name: 'order-expiration' },
      { name: 'commission' },
      { name: 'inventory-reconciliation' },
      { name: OUTBOX_QUEUE_NAME },
    ),
  ],
  providers: [
    EmailProcessor,
    OrderExpirationProcessor,
    CommissionProcessor,
    InventoryReconciliationProcessor,
    OutboxDrainerProcessor,
  ],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- NestJS modules are DI containers with no instance members.
export class WorkerModule {}
