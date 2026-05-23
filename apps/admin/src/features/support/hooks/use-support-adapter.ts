'use client'

import { useState } from 'react'
import type { SupportProps } from '@ecom/ui-admin'
import {
  useChangeSupportAssignee,
  useChangeSupportStatus,
  useSendSupportReply,
  useSupportMessages,
  useSupportTickets,
} from './use-support'
import { mapApiMessageToSupportMessage, mapApiTicketToSupportTicket } from '../mappers/support.mapper'

interface SupportAdapterResult {
  loading: boolean
  error: Error | null
  props: SupportProps
}

export function useSupportAdapter(): SupportAdapterResult {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)

  const ticketsQuery = useSupportTickets()
  const messagesQuery = useSupportMessages(selectedTicketId)
  const sendReplyMutation = useSendSupportReply(selectedTicketId)
  const changeStatusMutation = useChangeSupportStatus()
  const changeAssigneeMutation = useChangeSupportAssignee()

  const tickets = (ticketsQuery.data ?? []).map(mapApiTicketToSupportTicket)
  const messages = (messagesQuery.data ?? []).map(mapApiMessageToSupportMessage)

  return {
    loading: ticketsQuery.isPending,
    error: ticketsQuery.error,
    props: {
      tickets,
      messages,
      ...(selectedTicketId !== null && { selectedTicketId }),
      onSelectedTicketChange: setSelectedTicketId,
      loadingTickets: ticketsQuery.isPending,
      loadingMessages: messagesQuery.isPending,
      onSendReply: async (_ticket, content, isInternal) => {
        await sendReplyMutation.mutateAsync({ content, isInternal })
      },
      onStatusChange: async (ticket, status) => {
        await changeStatusMutation.mutateAsync({ ticketId: ticket.id, status })
      },
      onAssigneeChange: async (ticket, assignee) => {
        await changeAssigneeMutation.mutateAsync({ ticketId: ticket.id, assignedAdminId: assignee })
      },
    },
  }
}
