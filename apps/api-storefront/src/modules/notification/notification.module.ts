import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'

import { AuthModule } from '@ecom/nest-auth'

import { MarkNotificationReadHandler } from './application/commands/mark-notification-read/mark-notification-read.handler'
import { ListNotificationsHandler } from './application/queries/list-notifications/list-notifications.handler'
import { NOTIFICATION_REPOSITORY } from './domain/ports/notification.repository.port'
import { PrismaNotificationRepository } from './infrastructure/repositories/prisma-notification.repository'
import { NotificationController } from './notification.controller'
import { NotificationService } from './notification.service'

const CommandHandlers = [MarkNotificationReadHandler]
const QueryHandlers = [ListNotificationsHandler]

@Module({
  imports: [CqrsModule, AuthModule, BullModule.registerQueue({ name: 'email' })],
  controllers: [NotificationController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    NotificationService,
    { provide: NOTIFICATION_REPOSITORY, useClass: PrismaNotificationRepository },
  ],
  exports: [NotificationService],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- NestJS modules are DI containers with no instance members.
export class NotificationModule {}
