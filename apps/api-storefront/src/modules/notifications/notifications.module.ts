import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import { QUEUES } from '@ecom/shared/constants/queues'
import { NotificationModule } from '@ecom/nestjs-core/notification'
import { AuthModule } from '../auth/auth.module'
import { NotificationsController } from './notifications.controller'
import { NotificationsService } from './notifications.service'

@Module({
  imports: [
    AuthModule,
    NotificationModule,
    BullModule.registerQueue({ name: QUEUES.NOTIFICATION }),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [],
})
export class NotificationsModule {}
