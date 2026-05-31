import { describe, expect, it, vi } from 'vitest'
import { ChatAdminService } from './chat-admin.service'

describe('ChatAdminService.createConversation', () => {
  it('returns the existing conversation for the same buyer, shop, and product', async () => {
    const existingConversation = {
      id: 'conv_1',
      buyerId: 'buyer_1',
      shopId: 'shop_1',
      productId: 'prod_1',
      lastMessageText: null,
      updatedAt: new Date('2026-05-27T10:00:00.000Z'),
    }

    const prisma = {
      conversation: {
        findFirst: vi.fn().mockResolvedValue(existingConversation),
        create: vi.fn(),
      },
    }
    const redis = {
      publish: vi.fn(),
    }

    const service = new ChatAdminService(
      prisma as unknown as ConstructorParameters<typeof ChatAdminService>[0],
      redis as unknown as ConstructorParameters<typeof ChatAdminService>[1],
    )

    const result = await service.createConversation('buyer_1', 'shop_1', 'prod_1')

    expect(prisma.conversation.findFirst).toHaveBeenCalledWith({
      where: {
        buyerId: 'buyer_1',
        shopId: 'shop_1',
        productId: 'prod_1',
      },
    })
    expect(prisma.conversation.create).not.toHaveBeenCalled()
    expect(result).toEqual({
      id: 'conv_1',
      buyerId: 'buyer_1',
      shopId: 'shop_1',
      lastMessageText: null,
      updatedAt: '2026-05-27T10:00:00.000Z',
    })
  })
})

describe('ChatAdminService.sendMessage', () => {
  it('creates a seller-side message for the conversation and increments buyer unread count', async () => {
    const createdAt = new Date('2026-05-27T10:02:00.000Z')
    const conversation = {
      id: 'conv_1',
      buyerId: 'buyer_1',
      shopId: 'shop_1',
    }
    const shop = {
      seller: {
        userId: 'seller_user_1',
      },
    }
    const message = {
      id: 'msg_1',
      conversationId: 'conv_1',
      senderId: 'seller_user_1',
      content: 'Admin reply',
      createdAt,
    }
    const tx = {
      chatMessage: {
        create: vi.fn().mockResolvedValue(message),
      },
      conversation: {
        update: vi.fn().mockResolvedValue({ id: 'conv_1' }),
      },
      outboxEvent: {
        create: vi.fn().mockResolvedValue({ id: 'outbox_1' }),
      },
    }
    const redis = {
      publish: vi.fn().mockResolvedValue(1),
    }
    const prisma = {
      conversation: {
        findUnique: vi.fn().mockResolvedValue(conversation),
      },
      shop: {
        findUnique: vi.fn().mockResolvedValue(shop),
      },
      $transaction: vi.fn((callback: (client: typeof tx) => Promise<unknown>) => callback(tx)),
    }

    const service = new ChatAdminService(
      prisma as unknown as ConstructorParameters<typeof ChatAdminService>[0],
      redis as unknown as ConstructorParameters<typeof ChatAdminService>[1],
    )

    const result = await service.sendMessage('conv_1', 'Admin reply')

    expect(prisma.conversation.findUnique).toHaveBeenCalledWith({
      where: { id: 'conv_1' },
      select: { id: true, buyerId: true, shopId: true },
    })
    expect(prisma.shop.findUnique).toHaveBeenCalledWith({
      where: { id: 'shop_1' },
      select: { seller: { select: { userId: true } } },
    })
    expect(tx.chatMessage.create).toHaveBeenCalledWith({
      data: {
        conversationId: 'conv_1',
        senderId: 'seller_user_1',
        type: 'TEXT',
        content: 'Admin reply',
        metadata: undefined,
        isReadBySeller: true,
      },
    })
    expect(tx.conversation.update).toHaveBeenCalledWith({
      where: { id: 'conv_1' },
      data: {
        lastMessageAt: expect.any(Date) as Date,
        lastMessageText: 'Admin reply',
        buyerUnread: { increment: 1 },
      },
    })
    expect(tx.outboxEvent.create).toHaveBeenCalledWith({
      data: {
        aggregateType: 'ChatMessage',
        aggregateId: 'msg_1',
        eventType: 'message.created',
        payload: {
          recipientKind: 'user',
          messageId: 'msg_1',
          conversationId: 'conv_1',
          senderId: 'seller_user_1',
          recipientUserId: 'buyer_1',
          content: 'Admin reply',
        },
      },
    })
    expect(redis.publish).toHaveBeenCalledWith(
      'chat:message:created',
      JSON.stringify({ messageId: 'msg_1' }),
    )
    expect(result).toEqual({
      id: 'msg_1',
      conversationId: 'conv_1',
      senderId: 'seller_user_1',
      content: 'Admin reply',
      createdAt: '2026-05-27T10:02:00.000Z',
    })
  })
})
