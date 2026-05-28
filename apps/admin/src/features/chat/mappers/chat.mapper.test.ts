import { describe, expect, it } from 'vitest'
import { mapChatMessageToRecord, mapChatToRecord } from './chat.mapper'

describe('mapChatToRecord', () => {
  it('maps summary dto fields into ChatConversationRecord', () => {
    const record = mapChatToRecord({
      id: 'conv_1',
      buyerId: 'buyer_12345678',
      shopId: 'shop_12345678',
      lastMessageText: null,
      updatedAt: '2026-05-27T10:00:00.000Z',
    })

    expect(record).toEqual({
      id: 'conv_1',
      buyerIdShort: 'buyer_12…',
      shopIdShort: 'shop_123…',
      lastMessageText: null,
    })
  })
})

describe('mapChatMessageToRecord', () => {
  it('maps message dto fields into ChatMessageRecord', () => {
    const record = mapChatMessageToRecord({
      id: 'msg_1',
      conversationId: 'conv_1',
      senderId: 'seller_12345678',
      content: 'Reply',
      createdAt: '2026-05-27T10:00:00.000Z',
    })

    expect(record).toEqual({
      id: 'msg_1',
      content: 'Reply',
      senderIdShort: 'seller_1…',
      createdAtLabel: new Date('2026-05-27T10:00:00.000Z').toLocaleString(),
    })
  })
})
