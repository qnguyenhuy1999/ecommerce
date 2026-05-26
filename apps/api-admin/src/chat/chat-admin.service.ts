import type { PrismaService } from '@ecom/database'
import { Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class ChatAdminService {
  constructor(private readonly prisma: PrismaService) {}

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
