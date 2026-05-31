import { describe, expect, it } from 'vitest'
import { mapChatMessageToRecord, mapChatToRecord } from './chat.mapper'

describe('mapChatToRecord', () => {
  it('maps summary dto fields into ChatConversation', () => {
    const record = mapChatToRecord({
      id: 'conv_1',
      buyerId: 'buyer_12345678',
      shopId: 'shop_12345678',
      lastMessageText: null,
      updatedAt: '2026-05-27T10:00:00.000Z',
    })

    expect(record).toEqual({
      id: 'conv_1',
      buyerName: 'Buyer buyer_12…',
      buyerInitials: 'B',
      shopIdLabel: 'Shop shop_123…',
      lastMessageAtLabel: new Date('2026-05-27T10:00:00.000Z').toLocaleString(),
      lastActivityAt: '2026-05-27T10:00:00.000Z',
    })
  })
})

describe('mapChatMessageToRecord', () => {
  it('maps non-buyer messages as seller messages', () => {
    const record = mapChatMessageToRecord(
      {
        id: 'msg_1',
        conversationId: 'conv_1',
        senderId: 'seller-user-uuid',
        content: 'Reply',
        createdAt: '2026-05-27T10:00:00.000Z',
      },
      {
        id: 'conv_1',
        buyerId: 'buyer-user-uuid',
        shopId: 'shop_12345678',
        lastMessageText: null,
        updatedAt: '2026-05-27T10:00:00.000Z',
      },
    )

    expect(record).toEqual({
      id: 'msg_1',
      content: 'Reply',
      sender: 'SELLER',
      sentAtLabel: new Date('2026-05-27T10:00:00.000Z').toLocaleString(),
    })
  })

  it('maps buyer messages by comparing the selected conversation buyer id', () => {
    const record = mapChatMessageToRecord(
      {
        id: 'msg_2',
        conversationId: 'conv_1',
        senderId: 'buyer-user-uuid',
        content: 'Question',
        createdAt: '2026-05-27T10:01:00.000Z',
      },
      {
        id: 'conv_1',
        buyerId: 'buyer-user-uuid',
        shopId: 'shop_12345678',
        lastMessageText: null,
        updatedAt: '2026-05-27T10:00:00.000Z',
      },
    )

    expect(record.sender).toBe('BUYER')
  })
})
