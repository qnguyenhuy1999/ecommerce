import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import { NotificationsController } from './notifications.controller'
import { NotificationsService } from './notifications.service'
import { NotificationsProducer } from './notifications.producer'
import { AuditLogsModule } from '../audit-logs/audit-logs.module'
import { QUEUES } from '@ecom/shared'

@Module({
  imports: [AuditLogsModule, BullModule.registerQueue({ name: QUEUES.NOTIFICATION })],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsProducer],
})
export class NotificationsModule {}
