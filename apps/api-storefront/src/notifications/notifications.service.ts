import { Injectable } from '@nestjs/common'
import { PrismaService } from '@ecom/database'
import type { SessionData } from '@ecom/auth'

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getUnreadCount(user: SessionData): Promise<{ count: number }> {
    const result = await this.prisma.conversation.aggregate({
      where: { buyerId: user.userId },
      _sum: { buyerUnread: true },
    })
    return { count: result._sum.buyerUnread ?? 0 }
  }
}
