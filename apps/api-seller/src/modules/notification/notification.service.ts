import { PrismaService, type NotificationType, type Prisma } from '@ecom/database'
import { BaseNotificationService } from '@ecom/notification'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NotificationService extends BaseNotificationService {
  constructor(prisma: PrismaService) {
    super(prisma)
  }

  protected getModel() {
    return this.prisma.notification
  }

  protected getSubjectKey(): 'userId' | 'shopId' {
    return 'shopId'
  }

  // Seller-specific method — stays in app
  async create(
    shopId: string,
    type: NotificationType,
    title: string,
    message: string,
    metadata?: Record<string, unknown>,
  ) {
    const data: Prisma.NotificationUncheckedCreateInput = {
      shopId,
      type,
      title,
      message,
    }
    if (metadata !== undefined) {
      data.metadata = metadata as Prisma.InputJsonValue
    }
    return this.prisma.notification.create({ data })
  }
}
