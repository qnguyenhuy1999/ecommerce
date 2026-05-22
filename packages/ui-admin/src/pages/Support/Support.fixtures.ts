import type { SupportMessage, SupportProps, SupportTicket } from './Support.types'

export const supportTickets: SupportTicket[] = [
  {
    id: 'TKT-4000',
    title: 'Cannot withdraw payout',
    submitterName: 'Alex Tan',
    submitterRole: 'Buyer',
    dateLabel: 'May 11, 2026',
    status: 'NEW',
    openedAtLabel: 'May 11, 2026',
  },
  {
    id: 'TKT-4001',
    title: 'Order stuck in shipping',
    submitterName: 'Priya Raman',
    submitterRole: 'Seller',
    dateLabel: 'May 11, 2026',
    status: 'OPEN',
    openedAtLabel: 'May 11, 2026',
  },
  {
    id: 'TKT-4002',
    title: 'Refund taking too long',
    submitterName: 'Marco Diaz',
    submitterRole: 'Buyer',
    dateLabel: 'May 11, 2026',
    status: 'PENDING',
    openedAtLabel: 'May 11, 2026',
  },
  {
    id: 'TKT-4003',
    title: 'Account login locked',
    submitterName: 'Chloe Nguyen',
    submitterRole: 'Seller',
    dateLabel: 'May 11, 2026',
    status: 'SOLVED',
    openedAtLabel: 'May 11, 2026',
  },
  {
    id: 'TKT-4004',
    title: 'Seller dashboard error',
    submitterName: 'Yuki Ito',
    submitterRole: 'Buyer',
    dateLabel: 'May 11, 2026',
    status: 'NEW',
    openedAtLabel: 'May 11, 2026',
  },
  {
    id: 'TKT-4005',
    title: 'Voucher not applied',
    submitterName: 'Sam West',
    submitterRole: 'Seller',
    dateLabel: 'May 10, 2026',
    status: 'OPEN',
    openedAtLabel: 'May 10, 2026',
  },
  {
    id: 'TKT-4006',
    title: 'Product listing rejected unfairly',
    submitterName: 'Anya Petrova',
    submitterRole: 'Buyer',
    dateLabel: 'May 10, 2026',
    status: 'PENDING',
    openedAtLabel: 'May 10, 2026',
  },
  {
    id: 'TKT-4007',
    title: 'Payment not received after refund',
    submitterName: 'Liam Kim',
    submitterRole: 'Seller',
    dateLabel: 'May 10, 2026',
    status: 'SOLVED',
    openedAtLabel: 'May 10, 2026',
  },
]

export const supportMessages: SupportMessage[] = [
  {
    id: 'smsg-1',
    sender: 'CUSTOMER',
    senderName: 'Alex Tan',
    content: 'Cannot withdraw payout. Please assist urgently.',
    dateLabel: 'May 11, 2026',
  },
  {
    id: 'smsg-2',
    sender: 'AGENT',
    senderName: 'Agent',
    content: 'Thanks for reaching out — looking into this now.',
    dateLabel: 'May 11, 2026',
  },
  {
    id: 'smsg-3',
    sender: 'CUSTOMER',
    senderName: 'Alex Tan',
    content: 'Any update?',
    dateLabel: 'May 11, 2026',
  },
]

export const supportDefaultProps = {
  title: 'Support tickets',
  description: '6 open',
  tickets: supportTickets,
  messages: supportMessages,
  defaultSelectedTicketId: 'TKT-4000',
  assigneeOptions: [
    { value: 'unassigned', label: 'Unassigned' },
    { value: 'ops-admin', label: 'Ops Admin' },
    { value: 'seller-support', label: 'Seller Support' },
    { value: 'risk-ops', label: 'Risk Ops' },
  ],
  macroOptions: [
    { value: 'refund-ack', label: 'Macro: Refund acknowledged' },
    { value: 'escalate-ops', label: 'Macro: Escalate to Ops' },
    { value: 'close-solved', label: 'Macro: Close as solved' },
  ],
  replyPlaceholder: 'Reply to customer...',
  draftReply: '',
  loadingTickets: false,
  loadingMessages: false,
  emptyTicketsMessage: 'No tickets found.',
  emptyMessagesMessage: 'No messages yet.',
  unselectedTicketMessage: 'Select a ticket to view the conversation.',
  onSendReply: async () => {},
} satisfies Required<
  Pick<
    SupportProps,
    | 'title'
    | 'description'
    | 'tickets'
    | 'messages'
    | 'defaultSelectedTicketId'
    | 'assigneeOptions'
    | 'macroOptions'
    | 'replyPlaceholder'
    | 'draftReply'
    | 'loadingTickets'
    | 'loadingMessages'
    | 'emptyTicketsMessage'
    | 'emptyMessagesMessage'
    | 'unselectedTicketMessage'
    | 'onSendReply'
  >
>
