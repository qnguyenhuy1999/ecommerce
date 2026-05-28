'use client'

import { useEffect, useRef } from 'react'
import { useEffectEvent } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { io, type Socket } from 'socket.io-client'
import { getChats, getChatMessages } from '../api/chat.api'
import { chatKeys } from '../query-keys'
import type { ChatMessageDto, ChatSummaryDto } from '../api/chat.api'
import {
  applyIncomingMessageToChats,
  mergeIncomingChatMessage,
  sortChatsByLastMessage,
} from '../utils/chat-realtime'
import { acquireChatSocket, releaseChatSocket } from '../utils/chat-socket-manager'

export function useChats() {
  return useQuery({
    queryKey: chatKeys.chats(),
    queryFn: async () => {
      const res = await getChats()
      return sortChatsByLastMessage(res.data?.items ?? [])
    },
  })
}

export function useChatMessages(chatId: string | undefined) {
  return useQuery({
    queryKey: chatKeys.messages(chatId ?? '__none__'),
    queryFn: async () => {
      const res = await getChatMessages(chatId!)
      return res.data?.items ?? []
    },
    enabled: chatId !== undefined,
  })
}

export function useChatRealtime(chatId: string | undefined) {
  const queryClient = useQueryClient()
  const socketRef = useRef<Socket | null>(null)

  const handleIncomingChatMessage = useEffectEvent((incoming: ChatMessageDto) => {
    let chatFound = false

    queryClient.setQueryData<ChatSummaryDto[]>(chatKeys.chats(), (current = []) => {
      chatFound = current.some((chat) => chat.id === incoming.conversationId)
      return chatFound ? applyIncomingMessageToChats(current, incoming) : current
    })

    if (!chatFound) {
      void queryClient.invalidateQueries({ queryKey: chatKeys.chats() })
    }

    if (!chatId || incoming.conversationId !== chatId) {
      return
    }

    queryClient.setQueryData<ChatMessageDto[]>(chatKeys.messages(chatId), (current = []) =>
      mergeIncomingChatMessage(current, incoming),
    )
  })

  useEffect(() => {
    const socket = acquireChatSocket(() =>
      io(`${process.env.NEXT_PUBLIC_ADMIN_API_URL ?? 'http://localhost:4002'}/chat`, {
        withCredentials: true,
        transports: ['websocket'],
      }),
    )

    socketRef.current = socket

    const heartbeat = window.setInterval(() => {
      socket.emit('heartbeat')
    }, 30_000)

    socket.on('new_message', handleIncomingChatMessage)

    return () => {
      socketRef.current = null
      window.clearInterval(heartbeat)
      socket.off('new_message', handleIncomingChatMessage)
      releaseChatSocket(socket)
    }
  }, [handleIncomingChatMessage])

  useEffect(() => {
    const socket = socketRef.current

    if (!socket || !chatId) {
      return
    }

    socket.emit('join_conversation', { conversationId: chatId })

    return () => {
      socket.emit('leave_conversation', { conversationId: chatId })
    }
  }, [chatId])
}
