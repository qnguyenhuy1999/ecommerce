import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { MarkNotificationReadCommand } from './mark-notification-read.command'
import {
  INotificationRepository,
  NOTIFICATION_REPOSITORY,
} from '../../../domain/ports/notification.repository.port'
import type { MarkNotificationReadView } from '../../views/notification.view'

@CommandHandler(MarkNotificationReadCommand)
export class MarkNotificationReadHandler
  implements ICommandHandler<MarkNotificationReadCommand, MarkNotificationReadView>
{
  constructor(
    @Inject(NOTIFICATION_REPOSITORY) private readonly notifications: INotificationRepository,
  ) {}

  async execute(command: MarkNotificationReadCommand): Promise<MarkNotificationReadView> {
    return this.notifications.markRead({
      notificationId: command.notificationId,
      userId: command.userId,
    })
  }
}
