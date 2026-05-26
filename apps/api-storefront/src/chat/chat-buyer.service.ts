import type { PrismaService} from '@ecom/database';
import { type Prisma } from '@ecom/database'
import { OUTBOX_EVENTS, type ChatMessageOutboxPayload } from '@ecom/shared'
import { NotFoundException, Injectable } from '@nestjs/common'

@Injectable()
export class ChatBuyerService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertConversationAccess(
    userId: string,
    conversationId: string,
  ): Promise<{ shopId: string }> {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id: conversationId, buyerId: userId },
      select: { id: true, shopId: true },
    })

    if (!conversation) {
      throw new NotFoundException('Conversation not found')
    }

    return {
      shopId: conversation.shopId,
    }
  }

  async sendMessage(
    userId: string,
    conversationId: string,
    content: string,
    type: 'TEXT' | 'IMAGE' | 'PRODUCT' = 'TEXT',
    metadata?: Record<string, unknown>,
  ) {
    const { shopId } = await this.assertConversationAccess(userId, conversationId)

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const message = await tx.chatMessage.create({
        data: {
          conversationId,
          senderId: userId,
          type,
          content,
          ...(metadata !== undefined ? { metadata: metadata as Prisma.InputJsonValue } : {}),
          isReadByBuyer: true,
        },
      })

      await tx.conversation.update({
        where: { id: conversationId },
        data: {
          lastMessageAt: new Date(),
          lastMessageText: content.substring(0, 200),
          sellerUnread: { increment: 1 },
        },
      })

      await tx.outboxEvent.create({
        data: {
          aggregateType: 'ChatMessage',
          aggregateId: message.id,
          eventType: OUTBOX_EVENTS.MESSAGE_CREATED,
          payload: {
            recipientKind: 'shop',
            recipientShopId: shopId,
            messageId: message.id,
            conversationId,
            senderId: userId,
            content: content.substring(0, 500),
          } satisfies ChatMessageOutboxPayload,
        },
      })

      return message
    })
  }

  async markAsRead(userId: string, conversationId: string): Promise<void> {
    await this.assertConversationAccess(userId, conversationId)

    await this.prisma.$transaction([
      this.prisma.chatMessage.updateMany({
        where: { conversationId, isReadByBuyer: false, senderId: { not: userId } },
        data: { isReadByBuyer: true },
      }),
      this.prisma.conversation.update({
        where: { id: conversationId },
        data: { buyerUnread: 0 },
      }),
    ])
  }

  async ensureConversationAccessByUser(userId: string, conversationId: string): Promise<void> {
    await this.assertConversationAccess(userId, conversationId)
  }
}
