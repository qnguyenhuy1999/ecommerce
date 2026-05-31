'use client'

import { useState } from 'react'
import type { MessagesProps } from '@ecom/ui-admin/pages/Messages'
import { useSendSupportReply, useSupportMessages, useSupportTickets } from './use-support'
import {
  mapApiMessageToSupportEntry,
  mapApiTicketToSupportConversation,
} from '../mappers/support.mapper'

interface SupportAdapterResult {
  loading: boolean
  error: Error | null
  props: MessagesProps
}

export function useSupportAdapter(): SupportAdapterResult {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)

  const ticketsQuery = useSupportTickets()
  const messagesQuery = useSupportMessages(selectedTicketId)
  const sendReplyMutation = useSendSupportReply(selectedTicketId)

  const conversations = (ticketsQuery.data ?? []).map(mapApiTicketToSupportConversation)
  const messages = (messagesQuery.data ?? []).map(mapApiMessageToSupportEntry)

  return {
    loading: ticketsQuery.isPending,
    error: ticketsQuery.error,
    props: {
      title: 'Support Messages',
      description: 'Customer support tickets as shared message threads.',
      conversations,
      messages,
      ...(selectedTicketId !== null && { selectedConversationId: selectedTicketId }),
      onSelectedConversationChange: setSelectedTicketId,
      loadingConversations: ticketsQuery.isPending,
      loadingMessages: messagesQuery.isPending,
      emptyConversationsMessage: 'No support tickets found.',
      emptyMessagesMessage: 'No support messages yet.',
      unselectedConversationMessage: 'Select a support ticket to view the conversation.',
      composerPlaceholder: 'Reply to customer...',
      onSendMessage: async (_conversation, content) => {
        await sendReplyMutation.mutateAsync({ content, isInternal: false })
      },
    },
  }
}
