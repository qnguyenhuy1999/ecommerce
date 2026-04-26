import 'reflect-metadata'

import { ListNotificationsDto } from '../../src/modules/notification/application/dtos/list-notifications.dto'
import { ListNotificationsHandler } from '../../src/modules/notification/application/queries/list-notifications/list-notifications.handler'
import { ListNotificationsQuery } from '../../src/modules/notification/application/queries/list-notifications/list-notifications.query'
import type {
  NotificationListPage,
  NotificationView,
} from '../../src/modules/notification/application/views/notification.view'
import type { INotificationRepository } from '../../src/modules/notification/domain/ports/notification.repository.port'

function buildView(overrides: Partial<NotificationView> = {}): NotificationView {
  return {
    id: 'notif-1',
    type: 'ORDER_PAID',
    title: 'Order Paid',
    body: 'Your order ORD-1 has been paid.',
    data: { orderId: 'order-1' },
    isRead: false,
    createdAt: '2026-04-25T12:00:00.000Z',
    ...overrides,
  }
}

function buildFilters(overrides: Partial<ListNotificationsDto> = {}): ListNotificationsDto {
  const dto = new ListNotificationsDto()
  dto.page = 1
  dto.limit = 20
  Object.assign(dto, overrides)
  return dto
}

function buildRepo(page: NotificationListPage): INotificationRepository {
  return {
    list: jest.fn().mockResolvedValue(page),
    findById: jest.fn(),
    create: jest.fn(),
    markRead: jest.fn(),
  }
}

describe('ListNotificationsHandler', () => {
  it('forwards the userId from the authenticated query into the repository', async () => {
    const page: NotificationListPage = {
      data: [buildView()],
      page: 1,
      limit: 20,
      total: 1,
      totalPages: 1,
      unreadCount: 1,
    }
    const repo = buildRepo(page)
    const handler = new ListNotificationsHandler(repo)

    const result = await handler.execute(new ListNotificationsQuery('user-1', buildFilters()))

    expect(repo.list).toHaveBeenCalledWith({
      userId: 'user-1',
      page: 1,
      limit: 20,
      isRead: undefined,
    })
    expect(result).toEqual(page)
  })

  it('passes the optional isRead filter through', async () => {
    const page: NotificationListPage = {
      data: [],
      page: 2,
      limit: 5,
      total: 0,
      totalPages: 1,
      unreadCount: 0,
    }
    const repo = buildRepo(page)
    const handler = new ListNotificationsHandler(repo)

    await handler.execute(
      new ListNotificationsQuery('user-1', buildFilters({ page: 2, limit: 5, isRead: false })),
    )

    expect(repo.list).toHaveBeenCalledWith({
      userId: 'user-1',
      page: 2,
      limit: 5,
      isRead: false,
    })
  })

  it('returns the repository pagination metadata unchanged', async () => {
    const page: NotificationListPage = {
      data: Array.from({ length: 3 }, (_, i) =>
        buildView({ id: `notif-${i + 1}` }),
      ),
      page: 2,
      limit: 3,
      total: 7,
      totalPages: 3,
      unreadCount: 2,
    }
    const repo = buildRepo(page)
    const handler = new ListNotificationsHandler(repo)

    const result = await handler.execute(
      new ListNotificationsQuery('user-1', buildFilters({ page: 2, limit: 3 })),
    )

    expect(result.page).toBe(2)
    expect(result.limit).toBe(3)
    expect(result.total).toBe(7)
    expect(result.totalPages).toBe(3)
    expect(result.unreadCount).toBe(2)
    expect(result.data).toHaveLength(3)
  })
})
