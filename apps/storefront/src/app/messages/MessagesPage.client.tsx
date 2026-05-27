'use client'

import { useEffect, useMemo, useState } from 'react'
import { Messages } from '@ecom/ui-storefront'
import type { MessagesConversationRecord, MessagesMessageRecord } from '@ecom/ui-storefront'
import { api } from '../../lib/api'
import {
  type ChatConversation,
  type ChatConversationsResponse,
  type ChatConversationResponse,
  type ChatMessagesResponse,
} from '../../lib/storefront-contracts'
import { type RealtimeChatMessagePayload } from '../../lib/realtime'
import { useProtectedRoute } from '../../hooks/use-protected-route'
import { useStorefrontRealtime } from '../../providers/realtime-provider'

type ChatMessageState = {
  id: string
  conversationId: string
  senderId: string
  content: string
  createdAt: string
}

function sortConversations(conversations: ChatConversation[]) {
  return [...conversations].sort((left, right) => {
    const leftTime = left.lastMessageAt ? new Date(left.lastMessageAt).getTime() : 0
    const rightTime = right.lastMessageAt ? new Date(right.lastMessageAt).getTime() : 0
    return rightTime - leftTime
  })
}

function getUnreadCount(conversations: ChatConversation[]) {
  return conversations.reduce((sum, conversation) => sum + conversation.buyerUnread, 0)
}

function appendMessage(messages: ChatMessageState[], incoming: ChatMessageState) {
  if (messages.some((message) => message.id === incoming.id)) {
    return messages
  }

  return [...messages, incoming]
}

function getSelectedConversationId(
  currentConversationId: string | undefined,
  conversations: ChatConversation[],
) {
  return currentConversationId &&
    conversations.some((conversation) => conversation.id === currentConversationId)
    ? currentConversationId
    : conversations[0]?.id
}

function markConversationRead(conversations: ChatConversation[], conversationId: string) {
  return conversations.map((conversation) =>
    conversation.id === conversationId ? { ...conversation, buyerUnread: 0 } : conversation,
  )
}

function applyIncomingConversationUpdate(
  conversations: ChatConversation[],
  incoming: RealtimeChatMessagePayload,
  selectedConversationId: string,
) {
  return sortConversations(
    conversations.map((conversation) =>
      conversation.id === incoming.conversationId
        ? {
            ...conversation,
            lastMessageText: incoming.content,
            lastMessageAt: incoming.createdAt,
            buyerUnread:
              incoming.conversationId === selectedConversationId ? 0 : conversation.buyerUnread + 1,
          }
        : conversation,
    ),
  )
}

function mapConversation(conversation: ChatConversation): MessagesConversationRecord {
  return {
    id: conversation.id,
    shopIdShort: conversation.shopId.slice(0, 8),
    lastMessageText: conversation.lastMessageText,
    unreadCount: conversation.buyerUnread,
  }
}

function mapMessage(message: ChatMessageState): MessagesMessageRecord {
  return {
    id: message.id,
    content: message.content,
    createdAtLabel: new Date(message.createdAt).toLocaleString(),
  }
}

function toRealtimeMessage(payload: RealtimeChatMessagePayload): ChatMessageState {
  return {
    id: payload.id,
    conversationId: payload.conversationId,
    senderId: payload.senderId,
    content: payload.content,
    createdAt: payload.createdAt,
  }
}

function toChatMessageState(
  message: ChatMessagesResponse['data']['items'][number],
): ChatMessageState {
  return {
    id: message.id ?? '',
    conversationId: message.conversationId ?? '',
    senderId: message.senderId ?? '',
    content: message.content ?? '',
    createdAt: message.createdAt ?? '',
  }
}

export function MessagesPageClient() {
  const { loading: routeLoading } = useProtectedRoute()
  const { socket, setChatUnreadCount } = useStorefrontRealtime()
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [messages, setMessages] = useState<ChatMessageState[]>([])
  const [selectedConversationId, setSelectedConversationId] = useState<string>()
  const [draft, setDraft] = useState('')
  const [newShopId, setNewShopId] = useState('')
  const [newProductId, setNewProductId] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api<ChatConversationsResponse>('/chat/conversations')
        const next = sortConversations(response.data.items)
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
        const response = await api<ChatMessagesResponse>(
          `/chat/conversations/${selectedConversationId}/messages`,
        )
        setMessages(response.data.items.map(toChatMessageState))
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
    if (!socket || !selectedConversationId) {
      return
    }

    socket.emit('join_conversation', { conversationId: selectedConversationId })

    const handleMessage = (incoming: RealtimeChatMessagePayload) => {
      setConversations((current) => {
        const next = applyIncomingConversationUpdate(current, incoming, selectedConversationId)
        setChatUnreadCount(getUnreadCount(next))
        return next
      })

      if (incoming.conversationId === selectedConversationId) {
        setMessages((current) => appendMessage(current, toRealtimeMessage(incoming)))
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
    const response = await api<ChatConversationResponse>('/chat/conversations', {
      method: 'POST',
      body: JSON.stringify({
        shopId: newShopId,
        ...(newProductId ? { productId: newProductId } : {}),
      }),
    })
    const conversation = response.data

    setConversations((current) => sortConversations([conversation, ...current]))
    setSelectedConversationId(conversation.id)
    setNewShopId('')
    setNewProductId('')
  }

  const handleSendMessage = async () => {
    if (!selectedConversationId || draft.trim().length === 0) {
      return
    }

    await api(`/chat/conversations/${selectedConversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content: draft }),
    })
    const response = await api<ChatMessagesResponse>(
      `/chat/conversations/${selectedConversationId}/messages`,
    )
    setMessages(response.data.items.map(toChatMessageState))
    setConversations((current) =>
      sortConversations(
        current.map((conversation) =>
          conversation.id === selectedConversationId
            ? {
                ...conversation,
                lastMessageText: draft,
                lastMessageAt: new Date().toISOString(),
              }
            : conversation,
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
      loading={loading || routeLoading}
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
