import { PrismaService } from '@ecom/database'
import { type Prisma } from '@ecom/database'
import { PAGINATION_DEFAULTS } from '@ecom/shared/pagination/core'
import { buildOffsetResponse, offsetPaginate } from '@ecom/shared/pagination/prisma'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { BaseChatService } from '@ecom/chat'
import {
  ChatConversationDetailDto,
  ChatConversationSummaryDto,
  ChatMessageDto,
} from './dto/chat-response.dto'
import type { ConversationQueryDto, MessageQueryDto } from './dto/chat-query.dto'

@Injectable()
export class ChatAdminService extends BaseChatService {
  constructor(@Inject(PrismaService) prisma: PrismaService) {
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
      items: result.items.map((item) =>
        this.toMessageDto(item as Prisma.ChatMessageGetPayload<Record<string, never>>),
      ),
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
