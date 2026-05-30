import { Module } from '@nestjs/common'
import { NotificationModule as SharedNotificationModule } from '@ecom/nestjs-core/notification/notification.module'
import { AuthModule } from '../auth/auth.module'
import { ShopModule } from '../shop/shop.module'
import { NotificationController } from './notification.controller'
import { NotificationService } from './notification.service'

@Module({
  imports: [AuthModule, ShopModule, SharedNotificationModule],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
