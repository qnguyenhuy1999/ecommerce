'use client'

import { useEffect, useMemo, useState } from 'react'
import { io, type Socket } from 'socket.io-client'
import { apiFetch } from '@/lib/api'

interface Conversation {
  id: string
  buyerId: string
  shopId: string
  productId: string | null
  lastMessageText: string | null
  lastMessageAt: string | null
}

interface ChatMessage {
  id: string
  conversationId: string
  senderId: string
  content: string
  createdAt: string
}

interface ConversationsResponse {
  data: Conversation[]
}

interface MessagesResponse {
  data: ChatMessage[]
}

function createAdminSocket(): Socket {
  return io(`${process.env.NEXT_PUBLIC_ADMIN_API_URL ?? 'http://localhost:4002'}/chat`, {
    withCredentials: true,
    transports: ['websocket'],
  })
}

function sortConversations(conversations: Conversation[]) {
  return [...conversations].sort((left, right) => {
    const leftTime = left.lastMessageAt ? new Date(left.lastMessageAt).getTime() : 0
    const rightTime = right.lastMessageAt ? new Date(right.lastMessageAt).getTime() : 0
    return rightTime - leftTime
  })
}

function updateConversationPreview(conversations: Conversation[], incoming: ChatMessage) {
  return sortConversations(
    conversations.map((conversation) =>
      conversation.id === incoming.conversationId
        ? {
            ...conversation,
            lastMessageText: incoming.content,
            lastMessageAt: incoming.createdAt,
          }
        : conversation,
    ),
  )
}

function appendLiveMessage(messages: ChatMessage[], incoming: ChatMessage) {
  return messages.some((message) => message.id === incoming.id) ? messages : [...messages, incoming]
}

export function ChatPageClient() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [selectedConversationId, setSelectedConversationId] = useState<string>()

  useEffect(() => {
    const load = async () => {
      const response = await apiFetch<ConversationsResponse>('/admin/chat/conversations')
      const next = sortConversations(response.data)
      setConversations(next)
      setSelectedConversationId(next[0]?.id)
    }

    void load()
  }, [])

  useEffect(() => {
    if (!selectedConversationId) {
      setMessages([])
      return
    }

    const loadMessages = async () => {
      const response = await apiFetch<MessagesResponse>(
        `/admin/chat/conversations/${selectedConversationId}/messages`,
      )
      setMessages(response.data)
    }

    void loadMessages()
  }, [selectedConversationId])

  useEffect(() => {
    if (!selectedConversationId) {
      return
    }

    const socket = createAdminSocket()
    const heartbeat = window.setInterval(() => {
      socket.emit('heartbeat')
    }, 30_000)
    socket.emit('join_conversation', { conversationId: selectedConversationId })

    const handleMessage = (incoming: ChatMessage) => {
      setConversations((current) => updateConversationPreview(current, incoming))

      if (incoming.conversationId === selectedConversationId) {
        setMessages((current) => appendLiveMessage(current, incoming))
      }
    }

    socket.on('new_message', handleMessage)

    return () => {
      window.clearInterval(heartbeat)
      socket.emit('leave_conversation', { conversationId: selectedConversationId })
      socket.off('new_message', handleMessage)
      socket.disconnect()
    }
  }, [selectedConversationId])

  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === selectedConversationId),
    [conversations, selectedConversationId],
  )

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Chat Monitor</h1>
        <p className="text-muted-foreground text-sm">
          Read-only live view of buyer and seller conversations.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <aside className="bg-card rounded-xl border p-4">
          <h2 className="mb-3 font-medium">Conversations</h2>
          <div className="grid gap-2">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversationId(conversation.id)}
                className={`rounded-lg border p-3 text-left ${
                  conversation.id === selectedConversationId ? 'bg-accent' : 'bg-background'
                }`}
              >
                <div className="font-medium">Shop {conversation.shopId.slice(0, 8)}</div>
                <div className="text-muted-foreground text-sm">
                  Buyer {conversation.buyerId.slice(0, 8)}
                </div>
                <div className="mt-1 text-sm">
                  {conversation.lastMessageText ?? 'No messages yet'}
                </div>
              </button>
            ))}
          </div>
        </aside>

        <section className="bg-card rounded-xl border p-4">
          <div className="mb-4">
            <h2 className="font-medium">
              {selectedConversation
                ? `Conversation ${selectedConversation.id.slice(0, 8)}`
                : 'Conversation'}
            </h2>
            <p className="text-muted-foreground text-sm">
              Admin chat is currently monitor-only. Sending as admin is not available in the current
              schema.
            </p>
          </div>

          <div className="grid gap-2">
            {messages.map((message) => (
              <div key={message.id} className="rounded-lg border p-3">
                <div className="text-sm">{message.content}</div>
                <div className="text-muted-foreground mt-1 text-xs">
                  Sender {message.senderId.slice(0, 8)} ·{' '}
                  {new Date(message.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
