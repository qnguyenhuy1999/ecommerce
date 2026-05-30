import { Module } from '@nestjs/common'
import { NotificationModule } from '@ecom/nestjs-core/notification/notification.module'
import { AuditLogsModule } from '../audit-logs/audit-logs.module'
import { NotificationsController } from './notifications.controller'
import { NotificationsService } from './notifications.service'

@Module({
  imports: [AuditLogsModule, NotificationModule],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
