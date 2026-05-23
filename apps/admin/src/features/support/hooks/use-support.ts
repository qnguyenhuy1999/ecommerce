'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  changeSupportTicketAssignee,
  changeSupportTicketStatus,
  getSupportMessages,
  getSupportTickets,
  sendSupportReply,
  type SupportTicketApiItem,
} from '../api/support.api'
import { supportKeys } from '../query-keys'

export function useSupportTickets() {
  return useQuery({
    queryKey: supportKeys.tickets(),
    queryFn: async () => {
      const res = await getSupportTickets({ limit: 100 })
      return res.data.items ?? []
    },
  })
}

export function useSupportMessages(ticketId: string | null) {
  return useQuery({
    queryKey: supportKeys.messages(ticketId ?? ''),
    queryFn: async () => {
      const res = await getSupportMessages(ticketId!)
      return res.data
    },
    enabled: !!ticketId,
  })
}

export function useSendSupportReply(ticketId: string | null) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ content, isInternal }: { content: string; isInternal: boolean }) =>
      sendSupportReply(ticketId!, content, isInternal),
    onSuccess: () => {
      if (ticketId) void qc.invalidateQueries({ queryKey: supportKeys.messages(ticketId) })
    },
  })
}

export function useChangeSupportStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ ticketId, status }: { ticketId: string; status: SupportTicketApiItem['status'] }) =>
      changeSupportTicketStatus(ticketId, status),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: supportKeys.tickets() })
    },
  })
}

export function useChangeSupportAssignee() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ ticketId, assignedAdminId }: { ticketId: string; assignedAdminId: string | null }) =>
      changeSupportTicketAssignee(ticketId, assignedAdminId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: supportKeys.tickets() })
    },
  })
}
