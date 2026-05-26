import type { PrismaService } from '@ecom/database'
import { type Prisma } from '@ecom/database'
import { OUTBOX_EVENTS, type ChatMessageOutboxPayload } from '@ecom/shared'
import { PAGINATION_DEFAULTS } from '@ecom/shared/pagination/core'
import { buildOffsetResponse, offsetPaginate } from '@ecom/shared/pagination/prisma'
import { QUEUES } from '@ecom/shared'
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bullmq'
import type { Queue } from 'bullmq'
import type { ConversationQueryDto, MessageQueryDto } from './dto/chat-query.dto'

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(QUEUES.NOTIFICATION) private readonly notificationQueue: Queue,
  ) {}

  private async assertSellerOwnsShop(userId: string, shopId: string): Promise<void> {
    const shop = await this.prisma.shop.findFirst({
      where: { id: shopId, seller: { userId } },
      select: { id: true },
    })
    if (!shop) throw new ForbiddenException('You do not have access to this shop')
  }

  private async assertConversationAccess(
    userId: string,
    shopId: string,
    conversationId: string,
  ): Promise<{ buyerId: string }> {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id: conversationId, shopId, shop: { seller: { userId } } },
      select: { id: true, buyerId: true },
    })
    if (!conversation) throw new NotFoundException('Conversation not found')
    return { buyerId: conversation.buyerId }
  }

  async listConversations(userId: string, shopId: string, query: ConversationQueryDto) {
    await this.assertSellerOwnsShop(userId, shopId)
    const { page = 1, limit = PAGINATION_DEFAULTS.DEFAULT_LIMIT, search } = query
    const where: Prisma.ConversationWhereInput = {
      shopId,
      ...(search ? { lastMessageText: { contains: search, mode: 'insensitive' } } : {}),
    }
    const { items, total } = await offsetPaginate(this.prisma.conversation, {
      page,
      limit,
      where,
      orderBy: { lastMessageAt: { sort: 'desc', nulls: 'last' } },
    })
    return buildOffsetResponse(items, page, limit, total)
  }

  async getConversation(userId: string, shopId: string, conversationId: string) {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id: conversationId, shopId, shop: { seller: { userId } } },
    })
    if (!conversation) throw new NotFoundException('Conversation not found')
    return conversation
  }

  async getMessages(
    userId: string,
    shopId: string,
    conversationId: string,
    query: MessageQueryDto,
  ) {
    await this.assertConversationAccess(userId, shopId, conversationId)
    const { page = 1, limit = 50 } = query
    const { items, total } = await offsetPaginate(this.prisma.chatMessage, {
      page,
      limit,
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
    })
    return buildOffsetResponse(items.slice().reverse(), page, limit, total)
  }

  async sendMessage(
    userId: string,
    shopId: string,
    conversationId: string,
    content: string,
    type: 'TEXT' | 'IMAGE' | 'PRODUCT' = 'TEXT',
    metadata?: Record<string, unknown>,
  ) {
    const { buyerId } = await this.assertConversationAccess(userId, shopId, conversationId)

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const message = await tx.chatMessage.create({
        data: {
          conversationId,
          senderId: userId,
          type,
          content,
          metadata: metadata as Prisma.InputJsonValue,
          isReadBySeller: true,
        },
      })

      await tx.conversation.update({
        where: { id: conversationId },
        data: {
          lastMessageAt: new Date(),
          lastMessageText: content.substring(0, 200),
          buyerUnread: { increment: 1 },
        },
      })

      // Outbox event — atomic with message write; poller drains → BullMQ.
      await tx.outboxEvent.create({
        data: {
          aggregateType: 'ChatMessage',
          aggregateId: message.id,
          eventType: OUTBOX_EVENTS.MESSAGE_CREATED,
          payload: {
            recipientKind: 'user',
            messageId: message.id,
            conversationId,
            senderId: userId,
            recipientUserId: buyerId,
            content: content.substring(0, 500),
          } satisfies ChatMessageOutboxPayload,
        },
      })

      return message
    })
  }

  async markAsRead(userId: string, shopId: string, conversationId: string) {
    await this.assertConversationAccess(userId, shopId, conversationId)
    await this.prisma.$transaction([
      this.prisma.chatMessage.updateMany({
        where: { conversationId, isReadBySeller: false, senderId: { not: userId } },
        data: { isReadBySeller: true },
      }),
      this.prisma.conversation.update({
        where: { id: conversationId },
        data: { sellerUnread: 0 },
      }),
    ])
  }

  async getUnreadCount(userId: string, shopId: string) {
    await this.assertSellerOwnsShop(userId, shopId)
    const result = await this.prisma.conversation.aggregate({
      where: { shopId },
      _sum: { sellerUnread: true },
    })
    return { unreadCount: result._sum.sellerUnread ?? 0 }
  }

  async ensureConversationAccessByUser(userId: string, conversationId: string): Promise<void> {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id: conversationId, shop: { seller: { userId } } },
      select: { id: true },
    })
    if (!conversation) throw new NotFoundException('Conversation not found')
  }
}
