'use client'

import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createChatConversation,
  sendChatMessage,
  type ChatMessageDto,
  type ChatSummaryDto,
} from '../api/chat.api'
import { mapChatMessageToRecord, mapChatToRecord } from '../mappers/chat.mapper'
import { useChatMessages, useChatRealtime, useChats } from './use-chat'
import {
  applyIncomingMessageToChats,
  insertChatIntoList,
  mergeIncomingChatMessage,
} from '../utils/chat-realtime'
import { chatKeys } from '../query-keys'

export function useChatAdapter() {
  const queryClient = useQueryClient()
  const [selectedChatId, setSelectedChatId] = useState<string>()
  const [newBuyerId, setNewBuyerId] = useState('')
  const [newShopId, setNewShopId] = useState('')
  const [newProductId, setNewProductId] = useState('')
  const [submitError, setSubmitError] = useState<Error | null>(null)
  const chatsQuery = useChats()
  const messagesQuery = useChatMessages(selectedChatId)
  const selectedChat = chatsQuery.data?.find((chat) => chat.id === selectedChatId)

  useChatRealtime(selectedChatId)

  useEffect(() => {
    const firstChatId = chatsQuery.data?.[0]?.id

    if (!selectedChatId && firstChatId) {
      setSelectedChatId(firstChatId)
      return
    }

    if (selectedChatId && chatsQuery.data?.every((chat) => chat.id !== selectedChatId)) {
      setSelectedChatId(firstChatId)
    }
  }, [selectedChatId, chatsQuery.data])

  const handleStartConversation = async () => {
    if (newBuyerId.trim().length === 0 || newShopId.trim().length === 0) {
      return
    }

    try {
      setSubmitError(null)
      const response = await createChatConversation({
        buyerId: newBuyerId.trim(),
        shopId: newShopId.trim(),
        ...(newProductId.trim().length > 0 ? { productId: newProductId.trim() } : {}),
      })
      const conversation = response.data

      queryClient.setQueryData<ChatSummaryDto[]>(chatKeys.chats(), (current = []) =>
        insertChatIntoList(current, conversation),
      )
      setSelectedChatId(conversation.id)
      setNewBuyerId('')
      setNewShopId('')
      setNewProductId('')
    } catch (error: unknown) {
      setSubmitError(error instanceof Error ? error : new Error('Failed to create conversation'))
    }
  }

  const sendMutation = useMutation({
    mutationFn: ({ conversationId, content }: { conversationId: string; content: string }) =>
      sendChatMessage(conversationId, { content }),
  })

  const handleSendMessage = async (conversationId: string, content: string) => {
    const sentAt = new Date().toISOString()
    const optimisticMessage: ChatMessageDto = {
      id: `optimistic-${sentAt}`,
      conversationId,
      senderId: '__admin_outbound__',
      content,
      createdAt: sentAt,
    }

    queryClient.setQueryData<ChatMessageDto[]>(chatKeys.messages(conversationId), (current = []) =>
      mergeIncomingChatMessage(current, optimisticMessage),
    )
    queryClient.setQueryData<ChatSummaryDto[]>(chatKeys.chats(), (current = []) =>
      applyIncomingMessageToChats(current, optimisticMessage),
    )

    try {
      const response = await sendMutation.mutateAsync({ conversationId, content })
      queryClient.setQueryData<ChatMessageDto[]>(
        chatKeys.messages(conversationId),
        (current = []) => [
          ...current.filter((message) => message.id !== optimisticMessage.id),
          response.data,
        ],
      )
      queryClient.setQueryData<ChatSummaryDto[]>(chatKeys.chats(), (current = []) =>
        applyIncomingMessageToChats(current, response.data),
      )
    } catch (error) {
      queryClient.setQueryData<ChatMessageDto[]>(
        chatKeys.messages(conversationId),
        (current = []) => current.filter((message) => message.id !== optimisticMessage.id),
      )
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: chatKeys.chats() }),
        queryClient.invalidateQueries({ queryKey: chatKeys.messages(conversationId) }),
      ])
      throw error
    }
  }

  return {
    error: chatsQuery.error ?? messagesQuery.error ?? submitError ?? null,
    conversations: chatsQuery.data?.map(mapChatToRecord) ?? [],
    messages:
      messagesQuery.data?.map((message) => mapChatMessageToRecord(message, selectedChat)) ?? [],
    newBuyerId,
    newShopId,
    newProductId,
    ...(selectedChatId !== undefined ? { selectedConversationId: selectedChatId } : {}),
    onSelectedConversationChange: setSelectedChatId,
    loadingConversations: chatsQuery.isPending,
    loadingMessages: messagesQuery.isPending,
    onNewBuyerIdChange: setNewBuyerId,
    onNewShopIdChange: setNewShopId,
    onNewProductIdChange: setNewProductId,
    onSendMessage: (conversation: { id: string }, content: string) =>
      handleSendMessage(conversation.id, content),
    onStartConversation: () => {
      void handleStartConversation()
    },
  }
}
