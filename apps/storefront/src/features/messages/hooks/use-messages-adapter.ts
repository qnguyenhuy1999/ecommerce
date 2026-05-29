'use client'

import { useEffect, useMemo, useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
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
import { messageKeys } from '../query-keys'
import type { ChatMessageState } from '../types'

export function useMessagesAdapter() {
  const { loading: routeLoading } = useProtectedRoute()
  const { socket, setChatUnreadCount } = useStorefrontRealtime()
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [messages, setMessages] = useState<ChatMessageState[]>([])
  const [selectedConversationId, setSelectedConversationId] = useState<string>()
  const [draft, setDraft] = useState('')
  const [newShopId, setNewShopId] = useState('')
  const [newProductId, setNewProductId] = useState('')

  const conversationsQuery = useQuery({
    queryKey: messageKeys.conversations(),
    queryFn: async () => {
      const items = await getConversations()
      return sortConversations(items)
    },
  })

  useEffect(() => {
    const nextConversations = conversationsQuery.data
    if (nextConversations) {
      setConversations(nextConversations)
      setSelectedConversationId((current) => getSelectedConversationId(current, nextConversations))
      setChatUnreadCount(getUnreadCount(nextConversations))
    }
  }, [conversationsQuery.data, setChatUnreadCount])

  const messagesQuery = useQuery({
    queryKey: messageKeys.detail(selectedConversationId ?? ''),
    queryFn: async () => {
      if (!selectedConversationId) {
        return []
      }
      const items = await getConversationMessages(selectedConversationId)
      return items.map(toChatMessageState)
    },
    enabled: !!selectedConversationId,
  })

  useEffect(() => {
    if (messagesQuery.data) {
      setMessages(messagesQuery.data)
    }
  }, [messagesQuery.data])

  useEffect(() => {
    if (!selectedConversationId) return

    void markConversationRead(selectedConversationId)
    setConversations((current) => {
      const next = markConversationReadState(current, selectedConversationId)
      setChatUnreadCount(getUnreadCount(next))
      return next
    })
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

  const startConversationMutation = useMutation({
    mutationFn: (input: { shopId: string; productId?: string }) => startConversation(input),
  })

  const handleStartConversation = async () => {
    const conversation = await startConversationMutation.mutateAsync({
      shopId: newShopId,
      ...(newProductId ? { productId: newProductId } : {}),
    })
    setConversations((current) => sortConversations([conversation, ...current]))
    setSelectedConversationId(conversation.id)
    setNewShopId('')
    setNewProductId('')
  }

  const handleSendMessage = async () => {
    if (!selectedConversationId || draft.trim().length === 0) return

    const nextMessages = await sendConversationMessage(selectedConversationId, draft)
    setMessages(nextMessages.map(toChatMessageState))
    setConversations((current) =>
      sortConversations(
        current.map((conversation) =>
          conversation.id === selectedConversationId
            ? { ...conversation, lastMessageText: draft, lastMessageAt: new Date().toISOString() }
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

  return {
    loading: routeLoading || conversationsQuery.isPending,
    conversations: mappedConversations,
    messages: mappedMessages,
    selectedConversationId,
    onSelectConversation: setSelectedConversationId,
    draft,
    onDraftChange: setDraft,
    onSend: handleSendMessage,
    onStartConversation: handleStartConversation,
    newShopId,
    onNewShopIdChange: setNewShopId,
    newProductId,
    onNewProductIdChange: setNewProductId,
  }
}
