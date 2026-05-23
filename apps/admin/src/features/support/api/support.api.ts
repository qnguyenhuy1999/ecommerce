import { apiFetch } from '@/lib/api'

export interface SupportTicketApiItem {
  id: string
  title: string
  description?: string | null
  submitterId: string
  submitterRole: string
  submitterName: string
  status: 'NEW' | 'OPEN' | 'PENDING' | 'SOLVED'
  assignedAdminId?: string | null
  createdAt: string
  updatedAt: string
}

export interface SupportMessageApiItem {
  id: string
  ticketId: string
  sender: string
  senderName: string
  content: string
  isInternal: boolean
  createdAt: string
}

export interface SupportTicketListResponse {
  data: { items?: SupportTicketApiItem[] }
  meta?: { total: number; page: number; limit: number }
}

export interface SupportMessagesResponse {
  data: SupportMessageApiItem[]
}

export interface SendReplyResponse {
  data: SupportMessageApiItem
}

export interface ChangeStatusResponse {
  data: SupportTicketApiItem
}

export interface ChangeAssigneeResponse {
  data: SupportTicketApiItem
}

export interface SupportTicketQueryParams {
  page?: number
  limit?: number
  status?: 'NEW' | 'OPEN' | 'PENDING' | 'SOLVED'
  search?: string
}

export async function getSupportTickets(params?: SupportTicketQueryParams) {
  const query = new URLSearchParams()
  if (params?.page) query.set('page', String(params.page))
  if (params?.limit) query.set('limit', String(params.limit))
  if (params?.status) query.set('status', params.status)
  if (params?.search) query.set('search', params.search)
  const qs = query.toString()
  return apiFetch<SupportTicketListResponse>(`/admin/support/tickets${qs ? `?${qs}` : ''}`)
}

export async function getSupportMessages(ticketId: string) {
  return apiFetch<SupportMessagesResponse>(`/admin/support/tickets/${ticketId}/messages`)
}

export async function sendSupportReply(ticketId: string, content: string, isInternal: boolean) {
  return apiFetch<SendReplyResponse>(`/admin/support/tickets/${ticketId}/reply`, {
    method: 'POST',
    body: JSON.stringify({ content, isInternal }),
  })
}

export async function changeSupportTicketStatus(ticketId: string, status: SupportTicketApiItem['status']) {
  return apiFetch<ChangeStatusResponse>(`/admin/support/tickets/${ticketId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

export async function changeSupportTicketAssignee(ticketId: string, assignedAdminId: string | null) {
  return apiFetch<ChangeAssigneeResponse>(`/admin/support/tickets/${ticketId}/assignee`, {
    method: 'PATCH',
    body: JSON.stringify({ assignedAdminId }),
  })
}
