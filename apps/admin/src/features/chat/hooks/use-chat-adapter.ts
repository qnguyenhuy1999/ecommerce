'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client'
import { apiFetch } from '@/lib/api'
import type { ChatConversationRecord, ChatMessageRecord, ChatProps } from '@ecom/ui-admin'

interface ApiConversation {
  id: string
  buyerId: string
  shopId: string
  lastMessageText: string | null
  lastMessageAt: string | null
}

interface ApiMessage {
  id: string
  conversationId: string
  senderId: string
  content: string
  createdAt: string
}

function sortByLastMessage(conversations: ApiConversation[]): ApiConversation[] {
  return [...conversations].sort((a, b) => {
    const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0
    const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0
    return bTime - aTime
  })
}

function applyIncomingToConversations(
  current: ApiConversation[],
  incoming: ApiMessage,
): ApiConversation[] {
  const updated = current.map((c) =>
    c.id === incoming.conversationId
      ? { ...c, lastMessageText: incoming.content, lastMessageAt: incoming.createdAt }
      : c,
  )
  return sortByLastMessage(updated)
}

function appendIfNew(current: ApiMessage[], incoming: ApiMessage): ApiMessage[] {
  return current.some((m) => m.id === incoming.id) ? current : [...current, incoming]
}

function mapConversation(c: ApiConversation): ChatConversationRecord {
  return {
    id: c.id,
    shopIdShort: `${c.shopId.slice(0, 8)}…`,
    buyerIdShort: `${c.buyerId.slice(0, 8)}…`,
    lastMessageText: c.lastMessageText,
  }
}

function mapMessage(m: ApiMessage): ChatMessageRecord {
  return {
    id: m.id,
    content: m.content,
    senderIdShort: `${m.senderId.slice(0, 8)}…`,
    createdAtLabel: new Date(m.createdAt).toLocaleString(),
  }
}

export function useChatAdapter(): ChatProps & { loading: boolean } {
  const [rawConversations, setRawConversations] = useState<ApiConversation[]>([])
  const [rawMessages, setRawMessages] = useState<ApiMessage[]>([])
  const [selectedId, setSelectedId] = useState<string>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const res = await apiFetch<{ data: ApiConversation[] }>('/admin/chat/conversations')
      const sorted = sortByLastMessage(res.data)
      setRawConversations(sorted)
      setSelectedId(sorted[0]?.id)
      setLoading(false)
    }
    void load()
  }, [])

  useEffect(() => {
    if (!selectedId) {
      setRawMessages([])
      return
    }
    const load = async () => {
      const res = await apiFetch<{ data: ApiMessage[] }>(
        `/admin/chat/conversations/${selectedId}/messages`,
      )
      setRawMessages(res.data)
    }
    void load()
  }, [selectedId])

  useEffect(() => {
    if (!selectedId) return

    const socket = io(`${process.env.NEXT_PUBLIC_ADMIN_API_URL ?? 'http://localhost:4002'}/chat`, {
      withCredentials: true,
      transports: ['websocket'],
    })
    const heartbeat = window.setInterval(() => socket.emit('heartbeat'), 30_000)
    socket.emit('join_conversation', { conversationId: selectedId })

    const handleMessage = (incoming: ApiMessage) => {
      setRawConversations((current) => applyIncomingToConversations(current, incoming))
      if (incoming.conversationId === selectedId) {
        setRawMessages((current) => appendIfNew(current, incoming))
      }
    }

    socket.on('new_message', handleMessage)

    return () => {
      window.clearInterval(heartbeat)
      socket.emit('leave_conversation', { conversationId: selectedId })
      socket.off('new_message', handleMessage)
      socket.disconnect()
    }
  }, [selectedId])

  const conversations = useMemo(() => rawConversations.map(mapConversation), [rawConversations])
  const messages = useMemo(() => rawMessages.map(mapMessage), [rawMessages])
  const onSelectConversation = useCallback((id: string) => setSelectedId(id), [])

  return {
    loading,
    conversations,
    messages,
    ...(selectedId !== undefined ? { selectedConversationId: selectedId } : {}),
    onSelectConversation,
  }
}
