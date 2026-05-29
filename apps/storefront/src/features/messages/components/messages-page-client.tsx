'use client'

import { useEffect, useMemo, useState } from 'react'
import { Messages } from '@ecom/ui-storefront'
import type { MessagesConversationRecord, MessagesMessageRecord } from '@ecom/ui-storefront'
import type { ChatConversation } from '../../../lib/storefront-contracts'
import type { RealtimeChatMessagePayload } from '../../../lib/realtime'
import { useProtectedRoute } from '../../../core/auth/use-protected-route'
import { useStorefrontRealtime } from '../../../core/providers/realtime-provider'
import { mapConversation, mapMessage, toChatMessageState, toRealtimeMessage } from '../mappers'
import { markConversationRead, sendConversationMessage, startConversation } from '../mutations'
import { getConversationMessages, getConversations } from '../queries'
import {
  appendMessage,
  applyIncomingConversationUpdate,
  getSelectedConversationId,
  getUnreadCount,
  markConversationReadState,
  sortConversations,
} from '../realtime'
import type { ChatMessageState } from '../types'

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
        const next = sortConversations(await getConversations())
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
        const nextMessages = await getConversationMessages(selectedConversationId)
        setMessages(nextMessages.map(toChatMessageState))
        await markConversationRead(selectedConversationId)
        setConversations((current) => {
          const next = markConversationReadState(current, selectedConversationId)
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
        void markConversationRead(selectedConversationId)
      }
    }

    socket.on('new_message', handleMessage)

    return () => {
      socket.emit('leave_conversation', { conversationId: selectedConversationId })
      socket.off('new_message', handleMessage)
    }
  }, [selectedConversationId, setChatUnreadCount, socket])

  const handleStartConversation = async () => {
    const conversation = await startConversation({
      shopId: newShopId,
      ...(newProductId ? { productId: newProductId } : {}),
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

    const nextMessages = await sendConversationMessage(selectedConversationId, draft)
    setMessages(nextMessages.map(toChatMessageState))
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
      onSelectConversation={setSelectedConversationId}
      draft={draft}
      onDraftChange={setDraft}
      onSend={() => {
        void handleSendMessage()
      }}
      onStartConversation={() => {
        void handleStartConversation()
      }}
      newShopId={newShopId}
      onNewShopIdChange={setNewShopId}
      newProductId={newProductId}
      onNewProductIdChange={setNewProductId}
    />
  )
}
