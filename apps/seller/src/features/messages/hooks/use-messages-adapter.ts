'use client'

import { useEffect, useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getConversationMessages,
  getMessageConversations,
  markConversationRead,
  sendConversationMessage,
} from '../api'
import {
  appendMessage,
  applyIncomingMessageResult,
  getSelectedConversationId,
  getUnreadConversationCount,
  mapConversationsToUi,
  mapMessagesToUi,
  markConversationAsReadResult,
  sortConversationsByActivity,
  type SellerChatConversation,
  type SellerChatMessage,
  updateConversationsAfterSend,
} from '../mappers'
import { messageKeys } from '../query-keys'
import { type RealtimeChatMessagePayload } from '../../../lib/realtime'
import { useSellerRealtime } from '../../../core/providers/realtime-provider'

export function useMessagesAdapter() {
  const queryClient = useQueryClient()
  const { socket, setChatUnreadCount } = useSellerRealtime()
  const [selectedConversationId, setSelectedConversationId] = useState<string>()
  const [search, setSearch] = useState('')
  const [localConversations, setLocalConversations] = useState<SellerChatConversation[]>([])
  const [localMessages, setLocalMessages] = useState<SellerChatMessage[]>([])

  const conversationsQuery = useQuery({
    queryKey: messageKeys.conversations(search),
    queryFn: async () => {
      const { items } = await getMessageConversations(search)
      return sortConversationsByActivity(items)
    },
  })

  const conversations = conversationsQuery.data ?? localConversations

  useEffect(() => {
    if (conversationsQuery.data) {
      setLocalConversations(conversationsQuery.data)
      setSelectedConversationId((current) =>
        getSelectedConversationId(current, conversationsQuery.data!),
      )
    }
  }, [conversationsQuery.data])

  const messagesQuery = useQuery({
    queryKey: messageKeys.detail(selectedConversationId ?? ''),
    queryFn: async () => {
      const { items } = await getConversationMessages(selectedConversationId!)
      return items
    },
    enabled: !!selectedConversationId,
  })

  const messages = messagesQuery.data ?? localMessages

  useEffect(() => {
    if (messagesQuery.data) {
      setLocalMessages(messagesQuery.data)
    }
  }, [messagesQuery.data])

  useEffect(() => {
    if (!selectedConversationId) return

    void markConversationRead(selectedConversationId)
    setLocalConversations((current) =>
      markConversationAsReadResult(current, selectedConversationId).conversations,
    )
  }, [selectedConversationId])

  useEffect(() => {
    if (!socket || !selectedConversationId) return

    socket.emit('join_conversation', { conversationId: selectedConversationId })

    const handleIncomingMessage = (incoming: RealtimeChatMessagePayload) => {
      setLocalConversations((current) => applyIncomingMessageResult(current, incoming).conversations)

      if (incoming.conversationId === selectedConversationId) {
        setLocalMessages((current) => appendMessage(current, incoming))
        void markConversationRead(selectedConversationId)
        setLocalConversations(
          (current) => markConversationAsReadResult(current, selectedConversationId).conversations,
        )
      }
    }

    socket.on('new_message', handleIncomingMessage)

    return () => {
      socket.emit('leave_conversation', { conversationId: selectedConversationId })
      socket.off('new_message', handleIncomingMessage)
    }
  }, [selectedConversationId, socket])

  useEffect(() => {
    setChatUnreadCount(getUnreadConversationCount(conversations))
  }, [conversations, setChatUnreadCount])

  const sendMutation = useMutation({
    mutationFn: ({ conversationId, content }: { conversationId: string; content: string }) =>
      sendConversationMessage(conversationId, { content }),
  })

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId)

  const handleSendMessage = async (conversationId: string, content: string) => {
    const optimistic: SellerChatMessage = {
      id: `optimistic-${Date.now()}`,
      conversationId,
      senderId: '',
      content,
      createdAt: new Date().toISOString(),
    }
    setLocalMessages((current) => appendMessage(current, optimistic))
    setLocalConversations((current) => updateConversationsAfterSend(current, conversationId, content))

    try {
      await sendMutation.mutateAsync({ conversationId, content })
    } catch {
      setLocalMessages((current) => current.filter((m) => m.id !== optimistic.id))
      const { items: fresh } = await getConversationMessages(conversationId)
      setLocalMessages(fresh)
    }
  }

  const uiConversations = useMemo(() => mapConversationsToUi(conversations), [conversations])
  const uiMessages = useMemo(
    () => mapMessagesToUi(messages, selectedConversation),
    [messages, selectedConversation],
  )

  return {
    loadingConversations: conversationsQuery.isPending,
    loadingMessages: messagesQuery.isPending,
    conversationsError: conversationsQuery.error?.message ?? null,
    messagesError: messagesQuery.error?.message ?? null,
    conversations: uiConversations,
    messages: uiMessages,
    selectedConversationId,
    onSelectedConversationChange: setSelectedConversationId,
    search,
    onSearchChange: setSearch,
    onSendMessage: handleSendMessage,
  }
}
