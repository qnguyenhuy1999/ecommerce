interface DisconnectableSocket {
  disconnect: () => void
}

type CreateSocket<TSocket extends DisconnectableSocket> = () => TSocket

let activeSocket: DisconnectableSocket | null = null
let subscriberCount = 0
let disconnectTimer: ReturnType<typeof globalThis.setTimeout> | null = null

function clearPendingDisconnect() {
  if (disconnectTimer === null) {
    return
  }

  globalThis.clearTimeout(disconnectTimer)
  disconnectTimer = null
}

function scheduleDisconnect(expectedSocket: DisconnectableSocket) {
  clearPendingDisconnect()
  disconnectTimer = globalThis.setTimeout(() => {
    disconnectTimer = null

    if (subscriberCount > 0 || activeSocket !== expectedSocket) {
      return
    }

    expectedSocket.disconnect()
    activeSocket = null
  }, 0)
}

export function acquireChatSocket<TSocket extends DisconnectableSocket>(
  createSocket: CreateSocket<TSocket>,
): TSocket {
  clearPendingDisconnect()

  if (!activeSocket) {
    activeSocket = createSocket()
  }

  subscriberCount += 1

  return activeSocket as TSocket
}

export function releaseChatSocket(socket: DisconnectableSocket) {
  if (activeSocket !== socket) {
    return
  }

  subscriberCount = Math.max(0, subscriberCount - 1)

  if (subscriberCount === 0) {
    scheduleDisconnect(socket)
  }
}

export function resetChatSocketManager() {
  clearPendingDisconnect()
  activeSocket?.disconnect()
  activeSocket = null
  subscriberCount = 0
}
