import { Inject } from '@nestjs/common'
import { PrismaService } from '@ecom/database'
import { buildOffsetResponse } from '@ecom/shared/pagination/prisma/builders'
import { offsetPaginate } from '@ecom/shared/pagination/prisma/offset-paginate'

export interface GetMessagesQuery {
  page?: number
  limit?: number
}

export abstract class BaseChatService {
  constructor(@Inject(PrismaService) protected readonly prisma: PrismaService) {}

  protected async getMessagesForConversation(conversationId: string, query: GetMessagesQuery) {
    const { page = 1, limit = 50 } = query

    const { items, total } = await offsetPaginate(this.prisma.chatMessage, {
      page,
      limit,
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
    })

    return buildOffsetResponse(items.slice().reverse(), page, limit, total)
  }
}
