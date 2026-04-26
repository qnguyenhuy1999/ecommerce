import 'reflect-metadata'

import type { PrismaClient } from '@prisma/client'

import {
  NotNotificationOwnerException,
  NotificationNotFoundException,
} from '../../src/modules/notification/domain/exceptions/notification.exceptions'
import { PrismaNotificationRepository } from '../../src/modules/notification/infrastructure/repositories/prisma-notification.repository'

function buildPrismaForMarkRead(existing: { id: string; userId: string; isRead: boolean } | null) {
  const tx = {
    notification: {
      findUnique: jest.fn().mockResolvedValue(existing),
      update: jest.fn().mockResolvedValue({ id: existing?.id ?? 'x', isRead: true }),
    },
  }
  const prisma = {
    $transaction: jest.fn(async (cb: (txArg: typeof tx) => Promise<unknown>) => cb(tx)),
  } as unknown as PrismaClient
  return { prisma, tx }
}

describe('PrismaNotificationRepository.markRead', () => {
  it('marks a notification as read when called by its owner', async () => {
    const { prisma, tx } = buildPrismaForMarkRead({
      id: 'notif-1',
      userId: 'user-1',
      isRead: false,
    })
    const repo = new PrismaNotificationRepository(prisma)

    const result = await repo.markRead({ notificationId: 'notif-1', userId: 'user-1' })

    expect(tx.notification.update).toHaveBeenCalledWith({
      where: { id: 'notif-1' },
      data: { isRead: true },
      select: { id: true, isRead: true },
    })
    expect(result.isRead).toBe(true)
  })

  it('throws NOTIFICATION_NOT_FOUND when the row does not exist', async () => {
    const { prisma, tx } = buildPrismaForMarkRead(null)
    const repo = new PrismaNotificationRepository(prisma)

    await expect(
      repo.markRead({ notificationId: 'missing', userId: 'user-1' }),
    ).rejects.toBeInstanceOf(NotificationNotFoundException)
    expect(tx.notification.update).not.toHaveBeenCalled()
  })

  it('throws NOT_NOTIFICATION_OWNER when another user tries to mark it read', async () => {
    const { prisma, tx } = buildPrismaForMarkRead({
      id: 'notif-1',
      userId: 'user-1',
      isRead: false,
    })
    const repo = new PrismaNotificationRepository(prisma)

    await expect(
      repo.markRead({ notificationId: 'notif-1', userId: 'user-2' }),
    ).rejects.toBeInstanceOf(NotNotificationOwnerException)
    expect(tx.notification.update).not.toHaveBeenCalled()
  })

  it('returns short-circuit response when the row is already read without updating', async () => {
    const { prisma, tx } = buildPrismaForMarkRead({
      id: 'notif-1',
      userId: 'user-1',
      isRead: true,
    })
    const repo = new PrismaNotificationRepository(prisma)

    const result = await repo.markRead({ notificationId: 'notif-1', userId: 'user-1' })

    expect(result).toEqual({ id: 'notif-1', isRead: true })
    expect(tx.notification.update).not.toHaveBeenCalled()
  })
})
