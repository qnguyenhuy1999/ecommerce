import type { ListNotificationsDto } from '../../dtos/list-notifications.dto'

export class ListNotificationsQuery {
  constructor(
    readonly userId: string,
    readonly filters: ListNotificationsDto,
  ) {}
}
