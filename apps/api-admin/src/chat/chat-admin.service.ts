import type { PrismaService } from '@ecom/database'
import { type Prisma } from '@ecom/database'
import { PAGINATION_DEFAULTS } from '@ecom/shared/pagination/core'
import { buildOffsetResponse, offsetPaginate } from '@ecom/shared/pagination/prisma'
import { Injectable, NotFoundException } from '@nestjs/common'
import type { ConversationQueryDto, MessageQueryDto } from './dto/chat-query.dto'

@Injectable()
export class ChatAdminService {
  constructor(private readonly prisma: PrismaService) {}

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

    return buildOffsetResponse(items, page, limit, total)
  }

  async getConversation(conversationId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    })

    if (!conversation) {
      throw new NotFoundException('Conversation not found')
    }

    return conversation
  }

  async getMessages(conversationId: string, query: MessageQueryDto) {
    await this.ensureConversationExists(conversationId)
    const { page = 1, limit = 50 } = query

    const { items, total } = await offsetPaginate(this.prisma.chatMessage, {
      page,
      limit,
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
    })

    return buildOffsetResponse(items.slice().reverse(), page, limit, total)
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
