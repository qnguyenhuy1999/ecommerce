'use client'

import { useEffect, useMemo, useState } from 'react'
import { Messages } from '@ecom/ui-seller'
import {
  getConversationMessages,
  getMessageConversations,
  markConversationRead,
  sendConversationMessage,
} from '@/features/messages/api'
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
} from '@/features/messages/mappers'
import { DashboardLayout } from '../../shared/components/dashboard-layout'
import { type RealtimeChatMessagePayload } from '../../lib/realtime'
import { useSellerRealtime } from '../../core/providers/realtime-provider'

export default function MessagesPage() {
  const [conversations, setConversations] = useState<SellerChatConversation[]>([])
  const [messages, setMessages] = useState<SellerChatMessage[]>([])
  const [selectedConversationId, setSelectedConversationId] = useState<string>()
  const [search, setSearch] = useState('')
  const [loadingConversations, setLoadingConversations] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [conversationsError, setConversationsError] = useState<string | null>(null)
  const [messagesError, setMessagesError] = useState<string | null>(null)
  const { socket, setChatUnreadCount } = useSellerRealtime()
  const selectedConversation = conversations.find((c) => c.id === selectedConversationId)

  useEffect(() => {
    const fetchConversations = async () => {
      setLoadingConversations(true)

      try {
        const { items: response } = await getMessageConversations(search)
        const sortedConversations = sortConversationsByActivity(response)

        setConversations(sortedConversations)
        setSelectedConversationId((current) =>
          getSelectedConversationId(current, sortedConversations),
        )
        setConversationsError(null)
      } catch {
        setConversations([])
        setSelectedConversationId(undefined)
        setConversationsError('Failed to load conversations.')
      } finally {
        setLoadingConversations(false)
      }
    }

    void fetchConversations()
  }, [search])

  useEffect(() => {
    if (!selectedConversationId) {
      setMessages([])
      return
    }

    const fetchMessages = async () => {
      setLoadingMessages(true)

      try {
        const { items: fetched } = await getConversationMessages(selectedConversationId)
        setMessages(fetched)
        await markConversationRead(selectedConversationId)
        setConversations(
          (current) => markConversationAsReadResult(current, selectedConversationId).conversations,
        )
        setMessagesError(null)
      } catch {
        setMessages([])
        setMessagesError('Failed to load messages.')
      } finally {
        setLoadingMessages(false)
      }
    }

    void fetchMessages()
  }, [selectedConversationId])

  useEffect(() => {
    if (!socket || !selectedConversationId) {
      return
    }

    socket.emit('join_conversation', { conversationId: selectedConversationId })

    const handleIncomingMessage = (incoming: RealtimeChatMessagePayload) => {
      setConversations((current) => applyIncomingMessageResult(current, incoming).conversations)

      if (incoming.conversationId === selectedConversationId) {
        setMessages((current) => appendMessage(current, incoming))
        if (selectedConversation?.buyerId === incoming.senderId) {
          void markConversationRead(selectedConversationId)
          setConversations(
            (current) =>
              markConversationAsReadResult(current, selectedConversationId).conversations,
          )
        }
      }
    }

    socket.on('new_message', handleIncomingMessage)

    return () => {
      socket.emit('leave_conversation', { conversationId: selectedConversationId })
      socket.off('new_message', handleIncomingMessage)
    }
  }, [selectedConversation?.buyerId, selectedConversationId, socket])

  useEffect(() => {
    setChatUnreadCount(getUnreadConversationCount(conversations))
  }, [conversations, setChatUnreadCount])

  const uiConversations = useMemo(() => mapConversationsToUi(conversations), [conversations])
  const uiMessages = useMemo(
    () => mapMessagesToUi(messages, selectedConversation),
    [messages, selectedConversation],
  )

  const handleSendMessage = async (conversationId: string, content: string) => {
    const optimistic: SellerChatMessage = {
      id: `optimistic-${Date.now()}`,
      conversationId,
      senderId: '',
      content,
      createdAt: new Date().toISOString(),
    }
    setMessages((current) => appendMessage(current, optimistic))
    setConversations((current) => updateConversationsAfterSend(current, conversationId, content))

    try {
      await sendConversationMessage(conversationId, { content })
    } catch {
      setMessages((current) => current.filter((m) => m.id !== optimistic.id))
      const { items: fresh } = await getConversationMessages(conversationId)
      setMessages(fresh)
    }
  }

  const emptyConversationsMessage = conversationsError
    ? conversationsError
    : loadingConversations
      ? 'Loading conversations...'
      : 'No conversations found.'

  const emptyMessagesMessage = messagesError
    ? messagesError
    : loadingMessages
      ? 'Loading messages...'
      : 'No messages yet.'

  return (
    <DashboardLayout>
      <Messages
        conversations={uiConversations}
        messages={uiMessages}
        {...(selectedConversationId ? { selectedConversationId } : {})}
        onSelectedConversationChange={setSelectedConversationId}
        search={search}
        onSearchChange={setSearch}
        loadingConversations={loadingConversations}
        loadingMessages={loadingMessages}
        onSendMessage={(conversation, content) => handleSendMessage(conversation.id, content)}
        emptyConversationsMessage={emptyConversationsMessage}
        emptyMessagesMessage={emptyMessagesMessage}
      />
    </DashboardLayout>
  )
}
