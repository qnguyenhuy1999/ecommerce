'use client'

import { useEffect, useMemo, useState } from 'react'
import { Messages } from '@ecom/ui-storefront'
import type { MessagesConversationRecord, MessagesMessageRecord } from '@ecom/ui-storefront'
import { api } from '../../lib/api'
import { type RealtimeChatMessagePayload } from '../../lib/realtime'
import { useStorefrontRealtime } from '../../providers/realtime-provider'

interface Conversation {
  id: string
  shopId: string
  productId: string | null
  lastMessageText: string | null
  lastMessageAt: string | null
  buyerUnread: number
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

function sortConversations(conversations: Conversation[]) {
  return [...conversations].sort((left, right) => {
    const leftTime = left.lastMessageAt ? new Date(left.lastMessageAt).getTime() : 0
    const rightTime = right.lastMessageAt ? new Date(right.lastMessageAt).getTime() : 0
    return rightTime - leftTime
  })
}

function getUnreadCount(conversations: Conversation[]) {
  return conversations.reduce((sum, c) => sum + c.buyerUnread, 0)
}

function appendMessage(messages: ChatMessage[], incoming: ChatMessage) {
  if (messages.some((m) => m.id === incoming.id)) return messages
  return [...messages, incoming]
}

function getSelectedConversationId(current: string | undefined, conversations: Conversation[]) {
  return current && conversations.some((c) => c.id === current) ? current : conversations[0]?.id
}

function markConversationRead(conversations: Conversation[], conversationId: string) {
  return conversations.map((c) => (c.id === conversationId ? { ...c, buyerUnread: 0 } : c))
}

function applyIncomingConversationUpdate(
  conversations: Conversation[],
  incoming: RealtimeChatMessagePayload,
  selectedConversationId: string,
) {
  return sortConversations(
    conversations.map((c) =>
      c.id === incoming.conversationId
        ? {
            ...c,
            lastMessageText: incoming.content,
            lastMessageAt: incoming.createdAt,
            buyerUnread: incoming.conversationId === selectedConversationId ? 0 : c.buyerUnread + 1,
          }
        : c,
    ),
  )
}

function mapConversation(c: Conversation): MessagesConversationRecord {
  return {
    id: c.id,
    shopIdShort: c.shopId.slice(0, 8),
    lastMessageText: c.lastMessageText,
    unreadCount: c.buyerUnread,
  }
}

function mapMessage(m: ChatMessage): MessagesMessageRecord {
  return {
    id: m.id,
    content: m.content,
    createdAtLabel: new Date(m.createdAt).toLocaleString(),
  }
}

export function MessagesPageClient() {
  const { socket, setChatUnreadCount } = useStorefrontRealtime()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [selectedConversationId, setSelectedConversationId] = useState<string>()
  const [draft, setDraft] = useState('')
  const [newShopId, setNewShopId] = useState('')
  const [newProductId, setNewProductId] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api<ConversationsResponse>('/chat/conversations')
        const next = sortConversations(response.data)
        setConversations(next)
        setSelectedConversationId((current) => getSelectedConversationId(current, next))
        setChatUnreadCount(getUnreadCount(next))
      } catch {
        setConversations([])
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [setChatUnreadCount])

  useEffect(() => {
    if (!selectedConversationId) {
      setMessages([])
      return
    }
    const loadMessages = async () => {
      try {
        const response = await api<MessagesResponse>(
          `/chat/conversations/${selectedConversationId}/messages`,
        )
        setMessages(response.data)
        await api(`/chat/conversations/${selectedConversationId}/read`, { method: 'POST' })
        setConversations((current) => {
          const next = markConversationRead(current, selectedConversationId)
          setChatUnreadCount(getUnreadCount(next))
          return next
        })
      } catch {
        setMessages([])
      }
    }
    void loadMessages()
  }, [selectedConversationId, setChatUnreadCount])

  useEffect(() => {
    if (!socket || !selectedConversationId) return

    socket.emit('join_conversation', { conversationId: selectedConversationId })

    const handleMessage = (incoming: RealtimeChatMessagePayload) => {
      setConversations((current) => {
        const next = applyIncomingConversationUpdate(current, incoming, selectedConversationId)
        setChatUnreadCount(getUnreadCount(next))
        return next
      })
      if (incoming.conversationId === selectedConversationId) {
        setMessages((current) => appendMessage(current, incoming))
        void api(`/chat/conversations/${selectedConversationId}/read`, { method: 'POST' })
      }
    }

    socket.on('new_message', handleMessage)
    return () => {
      socket.emit('leave_conversation', { conversationId: selectedConversationId })
      socket.off('new_message', handleMessage)
    }
  }, [selectedConversationId, setChatUnreadCount, socket])

  const handleStartConversation = async () => {
    const conversation = await api<Conversation>('/chat/conversations', {
      method: 'POST',
      body: JSON.stringify({
        shopId: newShopId,
        ...(newProductId ? { productId: newProductId } : {}),
      }),
    })
    setConversations((current) => sortConversations([conversation, ...current]))
    setSelectedConversationId(conversation.id)
    setNewShopId('')
    setNewProductId('')
  }

  const handleSendMessage = async () => {
    if (!selectedConversationId || draft.trim().length === 0) return
    await api(`/chat/conversations/${selectedConversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content: draft }),
    })
    const response = await api<MessagesResponse>(
      `/chat/conversations/${selectedConversationId}/messages`,
    )
    setMessages(response.data)
    setConversations((current) =>
      sortConversations(
        current.map((c) =>
          c.id === selectedConversationId
            ? { ...c, lastMessageText: draft, lastMessageAt: new Date().toISOString() }
            : c,
        ),
      ),
    )
    setDraft('')
  }

  const mappedConversations = useMemo<MessagesConversationRecord[]>(
    () => conversations.map(mapConversation),
    [conversations],
  )
  const mappedMessages = useMemo<MessagesMessageRecord[]>(
    () => messages.map(mapMessage),
    [messages],
  )

  return (
    <Messages
      loading={loading}
      conversations={mappedConversations}
      messages={mappedMessages}
      selectedConversationId={selectedConversationId}
      draft={draft}
      newShopId={newShopId}
      newProductId={newProductId}
      onSelectConversation={setSelectedConversationId}
      onDraftChange={setDraft}
      onSend={() => {
        void handleSendMessage()
      }}
      onNewShopIdChange={setNewShopId}
      onNewProductIdChange={setNewProductId}
      onStartConversation={() => {
        void handleStartConversation()
      }}
    />
  )
}
