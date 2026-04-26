import { Inject, Injectable } from '@nestjs/common'
import { Prisma, PrismaClient } from '@prisma/client'

import type {
  MarkNotificationReadView,
  NotificationListPage,
  NotificationView,
} from '../../application/views/notification.view'
import {
  NotNotificationOwnerException,
  NotificationNotFoundException,
} from '../../domain/exceptions/notification.exceptions'
import type {
  CreateNotificationInput,
  INotificationRepository,
  ListNotificationsInput,
  MarkReadInput,
} from '../../domain/ports/notification.repository.port'

type NotificationRow = Prisma.NotificationGetPayload<Record<string, never>>

@Injectable()
export class PrismaNotificationRepository implements INotificationRepository {
  constructor(@Inject(PrismaClient) private readonly prisma: PrismaClient) {}

  async list(input: ListNotificationsInput): Promise<NotificationListPage> {
    const where: Prisma.NotificationWhereInput = { userId: input.userId }
    if (input.isRead !== undefined) {
      where.isRead = input.isRead
    }

    const [rows, total, unreadCount] = await this.prisma.$transaction([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (input.page - 1) * input.limit,
        take: input.limit,
      }),
      this.prisma.notification.count({ where }),
      this.prisma.notification.count({
        where: { userId: input.userId, isRead: false },
      }),
    ])

    return {
      data: rows.map(toView),
      page: input.page,
      limit: input.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / input.limit)),
      unreadCount,
    }
  }

  async findById(id: string): Promise<NotificationView | null> {
    const row = await this.prisma.notification.findUnique({ where: { id } })
    return row ? toView(row) : null
  }

  async create(input: CreateNotificationInput): Promise<NotificationView> {
    const client: Prisma.TransactionClient | PrismaClient = input.tx ?? this.prisma
    const row = await client.notification.create({
      data: {
        userId: input.userId,
        type: input.type,
        title: input.title,
        body: input.body,
        data: input.data ? toJson(input.data) : Prisma.JsonNull,
      },
    })
    return toView(row)
  }

  async markRead(input: MarkReadInput): Promise<MarkNotificationReadView> {
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.notification.findUnique({
        where: { id: input.notificationId },
        select: { id: true, userId: true, isRead: true },
      })

      if (!existing) {
        throw new NotificationNotFoundException(input.notificationId)
      }
      if (existing.userId !== input.userId) {
        throw new NotNotificationOwnerException()
      }

      if (existing.isRead) {
        return { id: existing.id, isRead: true }
      }

      const updated = await tx.notification.update({
        where: { id: existing.id },
        data: { isRead: true },
        select: { id: true, isRead: true },
      })
      return updated
    })
  }
}

function toView(row: NotificationRow): NotificationView {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    body: row.body,
    data: (row.data as Record<string, unknown> | null) ?? null,
    isRead: row.isRead,
    createdAt: row.createdAt.toISOString(),
  }
}

function toJson(value: Record<string, unknown>): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue
}
