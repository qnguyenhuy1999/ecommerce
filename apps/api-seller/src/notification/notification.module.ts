import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import { QUEUES } from '@ecom/shared'
import { NotificationModule as SharedNotificationModule } from '@ecom/notification'
import { AuthModule } from '../auth/auth.module'
import { ShopModule } from '../shop/shop.module'
import { NotificationController } from './notification.controller'
import { NotificationService } from './notification.service'

@Module({
  imports: [
    AuthModule,
    ShopModule,
    SharedNotificationModule,
    BullModule.registerQueue({ name: QUEUES.NOTIFICATION }),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
