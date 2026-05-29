import { describe, expect, it } from 'vitest'
import {
  applyIncomingMessageToChats,
  insertChatIntoList,
  mergeIncomingChatMessage,
  sortChatsByLastMessage,
} from './chat-realtime'

describe('sortChatsByLastMessage', () => {
  it('orders chats by most recent update first', () => {
    const result = sortChatsByLastMessage([
      {
        id: 'conv_1',
        buyerId: 'buyer_1',
        shopId: 'shop_1',
        lastMessageText: 'first',
        updatedAt: '2026-05-27T10:00:00.000Z',
      },
      {
        id: 'conv_2',
        buyerId: 'buyer_2',
        shopId: 'shop_2',
        lastMessageText: 'second',
        updatedAt: '2026-05-27T11:00:00.000Z',
      },
    ])

    expect(result.map((chat) => chat.id)).toEqual(['conv_2', 'conv_1'])
  })
})

describe('applyIncomingMessageToChats', () => {
  it('updates the matching chat preview and moves it to the top', () => {
    const result = applyIncomingMessageToChats(
      [
        {
          id: 'conv_1',
          buyerId: 'buyer_1',
          shopId: 'shop_1',
          lastMessageText: 'older',
          updatedAt: '2026-05-27T10:00:00.000Z',
        },
        {
          id: 'conv_2',
          buyerId: 'buyer_2',
          shopId: 'shop_2',
          lastMessageText: 'newer',
          updatedAt: '2026-05-27T11:00:00.000Z',
        },
      ],
      {
        id: 'msg_3',
        conversationId: 'conv_1',
        senderId: 'user_3',
        content: 'latest',
        createdAt: '2026-05-27T12:00:00.000Z',
      },
    )

    expect(result).toEqual([
      {
        id: 'conv_1',
        buyerId: 'buyer_1',
        shopId: 'shop_1',
        lastMessageText: 'latest',
        updatedAt: '2026-05-27T12:00:00.000Z',
      },
      {
        id: 'conv_2',
        buyerId: 'buyer_2',
        shopId: 'shop_2',
        lastMessageText: 'newer',
        updatedAt: '2026-05-27T11:00:00.000Z',
      },
    ])
  })
})

describe('insertChatIntoList', () => {
  it('adds a newly created chat and keeps the list sorted by recency', () => {
    const result = insertChatIntoList(
      [
        {
          id: 'conv_1',
          buyerId: 'buyer_1',
          shopId: 'shop_1',
          lastMessageText: 'older',
          updatedAt: '2026-05-27T10:00:00.000Z',
        },
      ],
      {
        id: 'conv_2',
        buyerId: 'buyer_2',
        shopId: 'shop_2',
        lastMessageText: null,
        updatedAt: '2026-05-27T12:00:00.000Z',
      },
    )

    expect(result).toEqual([
      {
        id: 'conv_2',
        buyerId: 'buyer_2',
        shopId: 'shop_2',
        lastMessageText: null,
        updatedAt: '2026-05-27T12:00:00.000Z',
      },
      {
        id: 'conv_1',
        buyerId: 'buyer_1',
        shopId: 'shop_1',
        lastMessageText: 'older',
        updatedAt: '2026-05-27T10:00:00.000Z',
      },
    ])
  })
})

describe('mergeIncomingChatMessage', () => {
  it('deduplicates an already-present message event', () => {
    const current = [
      {
        id: 'msg_1',
        conversationId: 'conv_1',
        senderId: 'user_1',
        content: 'Hello',
        createdAt: '2026-05-27T10:01:00.000Z',
      },
    ]

    if (!current[0]) {
      throw new Error('Test setup failed: current[0] is undefined')
    }

    const result = mergeIncomingChatMessage(current, current[0])

    expect(result).toEqual(current)
  })
})
