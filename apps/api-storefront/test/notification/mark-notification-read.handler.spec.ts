import 'reflect-metadata'

import { MarkNotificationReadCommand } from '../../src/modules/notification/application/commands/mark-notification-read/mark-notification-read.command'
import { MarkNotificationReadHandler } from '../../src/modules/notification/application/commands/mark-notification-read/mark-notification-read.handler'
import {
  NotNotificationOwnerException,
  NotificationNotFoundException,
} from '../../src/modules/notification/domain/exceptions/notification.exceptions'
import type { INotificationRepository } from '../../src/modules/notification/domain/ports/notification.repository.port'

function buildRepo(overrides: Partial<INotificationRepository> = {}): INotificationRepository {
  return {
    list: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    markRead: jest.fn(),
    ...overrides,
  }
}

describe('MarkNotificationReadHandler', () => {
  it('marks a notification as read for its owner', async () => {
    const repo = buildRepo({
      markRead: jest.fn().mockResolvedValue({ id: 'notif-1', isRead: true }),
    })
    const handler = new MarkNotificationReadHandler(repo)

    const result = await handler.execute(new MarkNotificationReadCommand('notif-1', 'user-1'))

    expect(result).toEqual({ id: 'notif-1', isRead: true })
    expect(repo.markRead).toHaveBeenCalledWith({
      notificationId: 'notif-1',
      userId: 'user-1',
    })
  })

  it('forwards NOTIFICATION_NOT_FOUND from the repository', async () => {
    const repo = buildRepo({
      markRead: jest.fn().mockRejectedValue(new NotificationNotFoundException('notif-1')),
    })
    const handler = new MarkNotificationReadHandler(repo)

    await expect(
      handler.execute(new MarkNotificationReadCommand('notif-1', 'user-1')),
    ).rejects.toBeInstanceOf(NotificationNotFoundException)
  })

  it('forwards NOT_NOTIFICATION_OWNER when another user attempts to mark it', async () => {
    const repo = buildRepo({
      markRead: jest.fn().mockRejectedValue(new NotNotificationOwnerException()),
    })
    const handler = new MarkNotificationReadHandler(repo)

    await expect(
      handler.execute(new MarkNotificationReadCommand('notif-1', 'user-2')),
    ).rejects.toBeInstanceOf(NotNotificationOwnerException)
  })
})
