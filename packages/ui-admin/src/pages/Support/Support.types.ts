export type SupportTicketStatus = 'NEW' | 'OPEN' | 'PENDING' | 'SOLVED'

export interface SupportTicket {
  id: string
  title: string
  submitterName: string
  submitterRole: 'Buyer' | 'Seller'
  dateLabel: string
  status: SupportTicketStatus
  openedAtLabel: string
}

export interface SupportMessage {
  id: string
  sender: 'CUSTOMER' | 'AGENT'
  senderName: string
  content: string
  dateLabel: string
}

export interface SupportAssigneeOption {
  value: string
  label: string
}

export interface SupportMacroOption {
  value: string
  label: string
}

export interface SupportProps {
  title?: string
  description?: string
  tickets?: SupportTicket[]
  messages?: SupportMessage[]
  defaultSelectedTicketId?: string
  selectedTicketId?: string
  onSelectedTicketChange?: (ticketId: string) => void
  assigneeOptions?: SupportAssigneeOption[]
  macroOptions?: SupportMacroOption[]
  replyPlaceholder?: string
  draftReply?: string
  onDraftReplyChange?: (value: string) => void
  onSendReply?: (
    ticket: SupportTicket,
    content: string,
    isInternal: boolean,
  ) => void | Promise<void>
  onStatusChange?: (ticket: SupportTicket, status: SupportTicketStatus) => void | Promise<void>
  onAssigneeChange?: (ticket: SupportTicket, assignee: string) => void | Promise<void>
  loadingTickets?: boolean
  loadingMessages?: boolean
  emptyTicketsMessage?: string
  emptyMessagesMessage?: string
  unselectedTicketMessage?: string
}
