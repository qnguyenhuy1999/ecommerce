import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import { QUEUES } from '@ecom/shared'
import { AuthModule } from '../auth/auth.module'
import { NotificationsController } from './notifications.controller'
import { NotificationsService } from './notifications.service'
import { NotificationsProducer } from './notifications.producer'

@Module({
  imports: [AuthModule, BullModule.registerQueue({ name: QUEUES.NOTIFICATION })],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsProducer],
  exports: [NotificationsProducer],
})
export class NotificationsModule {}
