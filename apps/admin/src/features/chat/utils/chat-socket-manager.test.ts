import { beforeEach, describe, expect, it, vi } from 'vitest'
import { acquireChatSocket, releaseChatSocket, resetChatSocketManager } from './chat-socket-manager'

interface MockSocket {
  disconnect: () => void
}

describe('chat-socket-manager', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    resetChatSocketManager()
  })

  it('reuses the same socket when a subscriber remounts before deferred cleanup runs', () => {
    const disconnect = vi.fn()
    const createSocket = vi.fn<() => MockSocket>(() => ({
      disconnect,
    }))

    const firstSocket = acquireChatSocket(createSocket)
    releaseChatSocket(firstSocket)
    const secondSocket = acquireChatSocket(createSocket)

    expect(secondSocket).toBe(firstSocket)
    expect(createSocket).toHaveBeenCalledTimes(1)

    vi.runAllTimers()
    expect(disconnect).not.toHaveBeenCalled()
  })

  it('disconnects the socket after the last subscriber releases it', () => {
    const disconnect = vi.fn()
    const socket: MockSocket = { disconnect }
    const createSocket = vi.fn(() => socket)

    const currentSocket = acquireChatSocket(createSocket)
    releaseChatSocket(currentSocket)

    vi.runAllTimers()

    expect(disconnect).toHaveBeenCalledTimes(1)
  })
})
