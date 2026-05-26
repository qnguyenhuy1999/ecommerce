'use client'

import { useEffect, useMemo, useState } from 'react'
import { api } from '../../lib/api'
import { type RealtimeChatMessagePayload } from '../../lib/realtime'
import { useStorefrontRealtime } from '../../providers/realtime-provider'
import { useProtectedRoute } from '../../hooks/use-protected-route'

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

interface StartConversationFormProps {
  newShopId: string
  newProductId: string
  onShopIdChange: (value: string) => void
  onProductIdChange: (value: string) => void
  onSubmit: () => void
}

interface ConversationListProps {
  conversations: Conversation[]
  selectedConversationId?: string | undefined
  onSelect: (conversationId: string) => void
}

interface MessagePanelProps {
  selectedConversation?: Conversation | undefined
  messages: ChatMessage[]
  draft: string
  onDraftChange: (value: string) => void
  onSend: () => void
  sendDisabled: boolean
}

function sortConversations(conversations: Conversation[]) {
  return [...conversations].sort((left, right) => {
    const leftTime = left.lastMessageAt ? new Date(left.lastMessageAt).getTime() : 0
    const rightTime = right.lastMessageAt ? new Date(right.lastMessageAt).getTime() : 0
    return rightTime - leftTime
  })
}

function getUnreadCount(conversations: Conversation[]) {
  return conversations.reduce((sum, conversation) => sum + conversation.buyerUnread, 0)
}

function appendMessage(messages: ChatMessage[], incoming: ChatMessage) {
  if (messages.some((message) => message.id === incoming.id)) {
    return messages
  }
  return [...messages, incoming]
}

function getSelectedConversationId(
  currentConversationId: string | undefined,
  conversations: Conversation[],
) {
  return currentConversationId &&
    conversations.some((conversation) => conversation.id === currentConversationId)
    ? currentConversationId
    : conversations[0]?.id
}

function markConversationRead(conversations: Conversation[], conversationId: string) {
  return conversations.map((conversation) =>
    conversation.id === conversationId ? { ...conversation, buyerUnread: 0 } : conversation,
  )
}

function applyIncomingConversationUpdate(
  conversations: Conversation[],
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

function StartConversationForm({
  newShopId,
  newProductId,
  onShopIdChange,
  onProductIdChange,
  onSubmit,
}: StartConversationFormProps) {
  return (
    <div style={{ border: '1px solid #e5e7eb', padding: 16 }}>
      <h2>Start conversation</h2>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input
          value={newShopId}
          onChange={(e) => onShopIdChange(e.target.value)}
          placeholder="Shop ID"
        />
        <input
          value={newProductId}
          onChange={(e) => onProductIdChange(e.target.value)}
          placeholder="Product ID (optional)"
        />
        <button onClick={onSubmit}>Start</button>
      </div>
    </div>
  )
}

function ConversationList({
  conversations,
  selectedConversationId,
  onSelect,
}: ConversationListProps) {
  return (
    <aside style={{ border: '1px solid #e5e7eb', padding: 16 }}>
      <h2>Conversations</h2>
      <div style={{ display: 'grid', gap: 8 }}>
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => onSelect(conversation.id)}
            style={{
              textAlign: 'left',
              padding: 12,
              border: '1px solid #d1d5db',
              background: conversation.id === selectedConversationId ? '#eff6ff' : '#fff',
            }}
          >
            <div>Shop {conversation.shopId.slice(0, 8)}</div>
            <div>{conversation.lastMessageText ?? 'No messages yet'}</div>
            {conversation.buyerUnread > 0 ? <div>Unread: {conversation.buyerUnread}</div> : null}
          </button>
        ))}
      </div>
    </aside>
  )
}

function MessagePanel({
  selectedConversation,
  messages,
  draft,
  onDraftChange,
  onSend,
  sendDisabled,
}: MessagePanelProps) {
  return (
    <section style={{ border: '1px solid #e5e7eb', padding: 16, display: 'grid', gap: 12 }}>
      <h2>
        {selectedConversation ? `Conversation ${selectedConversation.id.slice(0, 8)}` : 'Messages'}
      </h2>
      <div style={{ display: 'grid', gap: 8, minHeight: 320 }}>
        {messages.map((message) => (
          <div key={message.id} style={{ border: '1px solid #e5e7eb', padding: 12 }}>
            <div>{message.content}</div>
            <small>{new Date(message.createdAt).toLocaleString()}</small>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          placeholder="Write a message"
          style={{ flex: 1 }}
        />
        <button disabled={sendDisabled} onClick={onSend}>
          Send
        </button>
      </div>
    </section>
  )
}

export default function StorefrontMessagesPage() {
  const { loading } = useProtectedRoute()
  const { socket, setChatUnreadCount } = useStorefrontRealtime()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [selectedConversationId, setSelectedConversationId] = useState<string>()
  const [draft, setDraft] = useState('')
  const [newShopId, setNewShopId] = useState('')
  const [newProductId, setNewProductId] = useState('')
  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === selectedConversationId),
    [conversations, selectedConversationId],
  )

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
    if (!selectedConversationId || draft.trim().length === 0) {
      return
    }

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

  if (loading) {
    return <div>Loading…</div>
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <StartConversationForm
        newShopId={newShopId}
        newProductId={newProductId}
        onShopIdChange={setNewShopId}
        onProductIdChange={setNewProductId}
        onSubmit={() => {
          void handleStartConversation()
        }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 16 }}>
        <ConversationList
          conversations={conversations}
          selectedConversationId={selectedConversationId}
          onSelect={setSelectedConversationId}
        />
        <MessagePanel
          selectedConversation={selectedConversation}
          messages={messages}
          draft={draft}
          onDraftChange={setDraft}
          onSend={() => {
            void handleSendMessage()
          }}
          sendDisabled={!selectedConversationId || draft.trim().length === 0}
        />
      </div>
    </div>
  )
}
