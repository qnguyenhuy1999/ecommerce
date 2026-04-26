import { Inject } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'

import { ListNotificationsQuery } from './list-notifications.query'
import {
  INotificationRepository,
  NOTIFICATION_REPOSITORY,
} from '../../../domain/ports/notification.repository.port'
import type { NotificationListPage } from '../../views/notification.view'

@QueryHandler(ListNotificationsQuery)
export class ListNotificationsHandler
  implements IQueryHandler<ListNotificationsQuery, NotificationListPage>
{
  constructor(
    @Inject(NOTIFICATION_REPOSITORY) private readonly notifications: INotificationRepository,
  ) {}

  async execute(query: ListNotificationsQuery): Promise<NotificationListPage> {
    return this.notifications.list({
      userId: query.userId,
      page: query.filters.page,
      limit: query.filters.limit,
      isRead: query.filters.isRead,
    })
  }
}
