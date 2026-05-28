'use client'

import { useEffect, useMemo, useState } from 'react'
import { Messages } from '@ecom/ui-seller'
import {
  getConversationMessages,
  getMessageConversations,
  markConversationRead,
  sendConversationMessage,
} from '@/features/integration/seller-page-api'
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
} from '@/features/integration/seller-page-adapters'
import { DashboardLayout } from '../../components/dashboard-layout'
import { type RealtimeChatMessagePayload } from '../../lib/realtime'
import { useSellerRealtime } from '../../providers/realtime-provider'

export default function MessagesPage() {
  const [conversations, setConversations] = useState<SellerChatConversation[]>([])
  const [messages, setMessages] = useState<SellerChatMessage[]>([])
  const [selectedConversationId, setSelectedConversationId] = useState<string>()
  const [search, setSearch] = useState('')
  const [loadingConversations, setLoadingConversations] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const { socket, setChatUnreadCount } = useSellerRealtime()
  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === selectedConversationId),
    [conversations, selectedConversationId],
  )

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
      } catch {
        setConversations([])
        setSelectedConversationId(undefined)
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
        const { items: messages } = await getConversationMessages(selectedConversationId)
        setMessages(messages)
        await markConversationRead(selectedConversationId)
        setConversations(
          (current) => markConversationAsReadResult(current, selectedConversationId).conversations,
        )
      } catch {
        setMessages([])
      } finally {
        setLoadingMessages(false)
      }
    }

    void fetchMessages()
  }, [selectedConversationId, setChatUnreadCount])

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
  }, [selectedConversation?.buyerId, selectedConversationId, setChatUnreadCount, socket])

  useEffect(() => {
    setChatUnreadCount(getUnreadConversationCount(conversations))
  }, [conversations, setChatUnreadCount])

  const uiConversations = useMemo(() => mapConversationsToUi(conversations), [conversations])
  const uiMessages = useMemo(
    () => mapMessagesToUi(messages, selectedConversation),
    [messages, selectedConversation],
  )

  const handleSendMessage = async (conversationId: string, content: string) => {
    await sendConversationMessage(conversationId, { content })
    const { items: messages } = await getConversationMessages(conversationId)
    setMessages(messages)
    setConversations((current) => updateConversationsAfterSend(current, conversationId, content))
  }

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
        emptyConversationsMessage={
          loadingConversations ? 'Loading conversations...' : 'No conversations found.'
        }
        emptyMessagesMessage={loadingMessages ? 'Loading messages...' : 'No messages yet.'}
      />
    </DashboardLayout>
  )
}
