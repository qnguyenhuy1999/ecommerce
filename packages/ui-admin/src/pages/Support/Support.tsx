import { SellerListPage } from '../../organisms'
import { SupportClient } from './Support.client'
import { supportDefaultProps } from './Support.fixtures'
import type { SupportProps } from './Support.types'

export function Support({
  title = supportDefaultProps.title,
  description = supportDefaultProps.description,
  tickets = supportDefaultProps.tickets,
  messages = supportDefaultProps.messages,
  defaultSelectedTicketId = supportDefaultProps.defaultSelectedTicketId,
  selectedTicketId,
  onSelectedTicketChange,
  assigneeOptions = supportDefaultProps.assigneeOptions,
  macroOptions = supportDefaultProps.macroOptions,
  replyPlaceholder = supportDefaultProps.replyPlaceholder,
  draftReply = supportDefaultProps.draftReply,
  onDraftReplyChange,
  onSendReply = supportDefaultProps.onSendReply,
  onStatusChange,
  onAssigneeChange,
  loadingTickets = supportDefaultProps.loadingTickets,
  loadingMessages = supportDefaultProps.loadingMessages,
  emptyTicketsMessage = supportDefaultProps.emptyTicketsMessage,
  emptyMessagesMessage = supportDefaultProps.emptyMessagesMessage,
  unselectedTicketMessage = supportDefaultProps.unselectedTicketMessage,
}: SupportProps) {
  return (
    <SellerListPage
      title={title}
      description={description}
      breadcrumb={[{ label: 'Admin', href: '#' }, { label: 'Support' }]}
      mainClassName="space-y-5"
    >
      <SupportClient
        tickets={tickets ?? []}
        messages={messages ?? []}
        defaultSelectedTicketId={defaultSelectedTicketId ?? tickets?.[0]?.id ?? ''}
        {...(selectedTicketId !== undefined ? { selectedTicketId } : {})}
        {...(onSelectedTicketChange !== undefined ? { onSelectedTicketChange } : {})}
        assigneeOptions={assigneeOptions ?? []}
        macroOptions={macroOptions ?? []}
        replyPlaceholder={replyPlaceholder ?? 'Reply to customer...'}
        draftReply={draftReply ?? ''}
        {...(onDraftReplyChange !== undefined ? { onDraftReplyChange } : {})}
        onSendReply={onSendReply}
        onStatusChange={onStatusChange}
        onAssigneeChange={onAssigneeChange}
        loadingTickets={loadingTickets ?? false}
        loadingMessages={loadingMessages ?? false}
        emptyTicketsMessage={emptyTicketsMessage ?? 'No tickets found.'}
        emptyMessagesMessage={emptyMessagesMessage ?? 'No messages yet.'}
        unselectedTicketMessage={
          unselectedTicketMessage ?? 'Select a ticket to view the conversation.'
        }
      />
    </SellerListPage>
  )
}
