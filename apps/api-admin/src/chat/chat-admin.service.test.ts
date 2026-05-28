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

    const service = new ChatAdminService(
      prisma as unknown as ConstructorParameters<typeof ChatAdminService>[0],
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
