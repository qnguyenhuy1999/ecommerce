import { describe, expect, it, vi } from 'vitest'
import { ChatGateway } from './chat.gateway'

describe('ChatGateway.afterInit', () => {
  it('broadcasts admin chat updates from the immediate chat event channel', async () => {
    type MessageHandler = (channel: string, rawMessage: string) => void

    const redisSubscriber = {
      on: vi.fn(),
      psubscribe: vi.fn().mockResolvedValue(null),
      subscribe: vi.fn().mockResolvedValue(null),
    }
    const redis = {
      duplicate: vi.fn().mockReturnValue(redisSubscriber),
    }
    const chatAdminService = {
      getMessage: vi.fn().mockResolvedValue({
        id: 'msg_1',
        conversationId: 'conv_1',
        senderId: 'seller_1',
        content: 'hello',
        createdAt: '2026-05-28T10:00:00.000Z',
      }),
    }

    const gateway = new ChatGateway(
      chatAdminService as never,
      { get: vi.fn() } as never,
      redis as never,
    )
    const emit = vi.fn()
    const to = vi.fn().mockReturnValue({ emit })
    gateway.server = {
      to,
    } as never

    gateway.afterInit()

    const messageHandler = redisSubscriber.on.mock.calls.find(
      (call): call is ['message', MessageHandler] => call[0] === 'message',
    )?.[1]

    expect(redisSubscriber.subscribe).toHaveBeenCalled()
    expect(messageHandler).toBeTypeOf('function')

    messageHandler?.('chat:message:created', JSON.stringify({ messageId: 'msg_1' }))
    await Promise.resolve()

    expect(chatAdminService.getMessage).toHaveBeenCalledWith('msg_1')
    expect(to).toHaveBeenCalledWith('admins')
  })
})
