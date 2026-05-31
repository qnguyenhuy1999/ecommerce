import { PrismaService } from '@ecom/database'
import { type Prisma } from '@ecom/database'
import {
  CHAT_MESSAGE_CREATED_CHANNEL,
  LAST_MESSAGE_PREVIEW_LENGTH,
} from '@ecom/shared/constants/events'
import {
  OUTBOX_EVENTS,
  type ChatMessageOutboxPayload,
} from '@ecom/shared/constants/notification-jobs'
import { PAGINATION_DEFAULTS } from '@ecom/shared/pagination/core/constants'
import { buildOffsetResponse } from '@ecom/shared/pagination/prisma/builders'
import { offsetPaginate } from '@ecom/shared/pagination/prisma/offset-paginate'
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { BaseChatService } from '@ecom/nestjs-core/chat/base-chat.service'
import { REDIS_CLIENT } from '@ecom/redis'
import type Redis from 'ioredis'
import {
  ChatConversationDetailDto,
  ChatConversationSummaryDto,
  ChatMessageDto,
} from './dto/chat-response.dto'
import type { ConversationQueryDto, MessageQueryDto } from './dto/chat-query.dto'

@Injectable()
export class ChatAdminService extends BaseChatService {
  private readonly logger = new Logger(ChatAdminService.name)

  constructor(
    @Inject(PrismaService) prisma: PrismaService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {
    super(prisma)
  }

  private toConversationSummary(
    conversation: Prisma.ConversationGetPayload<Record<string, never>>,
  ): ChatConversationSummaryDto {
    return {
      id: conversation.id,
      buyerId: conversation.buyerId,
      shopId: conversation.shopId,
      lastMessageText: conversation.lastMessageText,
      updatedAt: conversation.updatedAt.toISOString(),
    }
  }

  private toConversationDetail(
    conversation: Prisma.ConversationGetPayload<Record<string, never>>,
  ): ChatConversationDetailDto {
    return {
      conversation: this.toConversationSummary(conversation),
    }
  }

  private toMessageDto(
    message: Prisma.ChatMessageGetPayload<Record<string, never>>,
  ): ChatMessageDto {
    return {
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      content: message.content,
      createdAt: message.createdAt.toISOString(),
    }
  }

  async listConversations(query: ConversationQueryDto) {
    const { page = 1, limit = PAGINATION_DEFAULTS.DEFAULT_LIMIT, search } = query
    const where: Prisma.ConversationWhereInput = search
      ? {
          OR: [
            { lastMessageText: { contains: search, mode: 'insensitive' } },
            { buyer: { firstName: { contains: search, mode: 'insensitive' } } },
            { buyer: { lastName: { contains: search, mode: 'insensitive' } } },
          ],
        }
      : {}

    const { items, total } = await offsetPaginate(this.prisma.conversation, {
      page,
      limit,
      where,
      orderBy: { lastMessageAt: { sort: 'desc', nulls: 'last' } },
    })

    return buildOffsetResponse(
      items.map((item) => this.toConversationSummary(item)),
      page,
      limit,
      total,
    )
  }

  async getConversation(conversationId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    })

    if (!conversation) {
      throw new NotFoundException('Conversation not found')
    }

    return this.toConversationDetail(conversation)
  }

  async getMessages(conversationId: string, query: MessageQueryDto) {
    await this.ensureConversationExists(conversationId)
    const result = await this.getMessagesForConversation(conversationId, query)
    return {
      items: result.items.map((item) => this.toMessageDto(item)),
      meta: result.meta,
    }
  }

  async createConversation(buyerId: string, shopId: string, productId?: string) {
    const existing = await this.prisma.conversation.findFirst({
      where: {
        buyerId,
        shopId,
        ...(productId !== undefined ? { productId } : { productId: null }),
      },
    })

    if (existing) {
      return this.toConversationSummary(existing)
    }

    const conversation = await this.prisma.conversation.create({
      data: {
        buyerId,
        shopId,
        ...(productId !== undefined ? { productId } : {}),
      },
    })

    return this.toConversationSummary(conversation)
  }

  async sendMessage(
    conversationId: string,
    content: string,
    type: 'TEXT' | 'IMAGE' | 'PRODUCT' = 'TEXT',
    metadata?: Record<string, unknown>,
  ) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { id: true, buyerId: true, shopId: true },
    })

    if (!conversation) {
      throw new NotFoundException('Conversation not found')
    }

    const shop = await this.prisma.shop.findUnique({
      where: { id: conversation.shopId },
      select: { seller: { select: { userId: true } } },
    })

    if (!shop) {
      throw new NotFoundException('Conversation shop not found')
    }

    const senderId = shop.seller.userId
    const message = await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const message = await tx.chatMessage.create({
        data: {
          conversationId,
          senderId,
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
          lastMessageText: content.substring(0, LAST_MESSAGE_PREVIEW_LENGTH),
          buyerUnread: { increment: 1 },
        },
      })

      await tx.outboxEvent.create({
        data: {
          aggregateType: 'ChatMessage',
          aggregateId: message.id,
          eventType: OUTBOX_EVENTS.MESSAGE_CREATED,
          payload: {
            recipientKind: 'user',
            messageId: message.id,
            conversationId,
            senderId,
            recipientUserId: conversation.buyerId,
            content: content.substring(0, LAST_MESSAGE_PREVIEW_LENGTH),
          } satisfies ChatMessageOutboxPayload,
        },
      })

      return message
    })

    try {
      await this.redis.publish(
        CHAT_MESSAGE_CREATED_CHANNEL,
        JSON.stringify({ messageId: message.id }),
      )
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'unknown error'
      this.logger.warn(`Failed to publish immediate chat event ${message.id}: ${errorMessage}`)
    }

    return this.toMessageDto(message)
  }

  async getMessage(messageId: string) {
    const message = await this.prisma.chatMessage.findUnique({
      where: { id: messageId },
    })

    if (!message) {
      throw new NotFoundException('Message not found')
    }

    return this.toMessageDto(message)
  }

  async ensureConversationExists(conversationId: string): Promise<void> {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { id: true },
    })

    if (!conversation) {
      throw new NotFoundException('Conversation not found')
    }
  }
}
