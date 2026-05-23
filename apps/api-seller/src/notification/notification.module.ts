import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import { NotificationController } from './notification.controller'
import { NotificationService } from './notification.service'
import { NotificationProducer } from './notification.producer'
import { AuthModule } from '../auth/auth.module'
import { ShopModule } from '../shop/shop.module'
import { QUEUES } from '@ecom/shared'

@Module({
  imports: [AuthModule, ShopModule, BullModule.registerQueue({ name: QUEUES.NOTIFICATION })],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationProducer],
  exports: [NotificationService, NotificationProducer],
})
export class NotificationModule {}
