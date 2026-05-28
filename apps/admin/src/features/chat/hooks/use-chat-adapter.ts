'use client'

import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { createChatConversation, type ChatSummaryDto } from '../api/chat.api'
import { mapChatMessageToRecord, mapChatToRecord } from '../mappers/chat.mapper'
import { useChatMessages, useChatRealtime, useChats } from './use-chat'
import { insertChatIntoList } from '../utils/chat-realtime'
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

  return {
    loading: chatsQuery.isPending,
    error: chatsQuery.error ?? messagesQuery.error ?? submitError ?? null,
    conversations: chatsQuery.data?.map(mapChatToRecord) ?? [],
    messages: messagesQuery.data?.map(mapChatMessageToRecord) ?? [],
    newBuyerId,
    newShopId,
    newProductId,
    ...(selectedChatId !== undefined ? { selectedConversationId: selectedChatId } : {}),
    onSelectConversation: setSelectedChatId,
    onNewBuyerIdChange: setNewBuyerId,
    onNewShopIdChange: setNewShopId,
    onNewProductIdChange: setNewProductId,
    onStartConversation: () => {
      void handleStartConversation()
    },
  }
}
