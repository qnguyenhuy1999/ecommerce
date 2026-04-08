import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@ecom/database';
import { EmailProcessor } from './processors/email.processor';
import { OrderExpirationProcessor } from './processors/order-expiration.processor';
import { CommissionProcessor } from './processors/commission.processor';
import { InventoryReconciliationProcessor } from './processors/inventory-reconciliation.processor';

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
    ),
  ],
  providers: [
    EmailProcessor,
    OrderExpirationProcessor,
    CommissionProcessor,
    InventoryReconciliationProcessor,
  ],
})
export class WorkerModule {}
