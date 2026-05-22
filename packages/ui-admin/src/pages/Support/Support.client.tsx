'use client'

import {
  Badge,
  Button,
  Checkbox,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  Typography,
} from '@ecom/core-ui'
import { ArrowLeft, Inbox, MessageCircle, SendHorizontal } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { supportDefaultProps } from './Support.fixtures'
import type {
  SupportAssigneeOption,
  SupportMacroOption,
  SupportMessage,
  SupportProps,
  SupportTicket,
  SupportTicketStatus,
} from './Support.types'

interface SupportClientProps {
  tickets: SupportTicket[]
  messages: SupportMessage[]
  defaultSelectedTicketId: string
  selectedTicketId?: string
  onSelectedTicketChange?: SupportProps['onSelectedTicketChange']
  assigneeOptions: SupportAssigneeOption[]
  macroOptions: SupportMacroOption[]
  replyPlaceholder: string
  draftReply: string
  onDraftReplyChange?: SupportProps['onDraftReplyChange']
  onSendReply?: SupportProps['onSendReply']
  onStatusChange?: SupportProps['onStatusChange']
  onAssigneeChange?: SupportProps['onAssigneeChange']
  loadingTickets: boolean
  loadingMessages: boolean
  emptyTicketsMessage: string
  emptyMessagesMessage: string
  unselectedTicketMessage: string
}

const STATUS_LABELS: Record<SupportTicketStatus, string> = {
  NEW: 'New',
  OPEN: 'Open',
  PENDING: 'Pending',
  SOLVED: 'Solved',
}

function getStatusDotClass(status: SupportTicketStatus) {
  switch (status) {
    case 'NEW':
      return 'bg-orange-500'
    case 'OPEN':
      return 'bg-red-500'
    case 'PENDING':
      return 'bg-amber-400'
    case 'SOLVED':
      return 'bg-gray-400'
  }
}

function getStatusBadgeClass(status: SupportTicketStatus) {
  switch (status) {
    case 'NEW':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    case 'OPEN':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    case 'PENDING':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
    case 'SOLVED':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
  }
}

function TicketsSkeleton() {
  return (
    <div className="space-y-0">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="border-border/60 border-b p-4">
          <div className="flex items-start gap-3">
            <div className="bg-muted mt-1.5 size-2.5 animate-pulse rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="bg-muted h-3 w-20 animate-pulse rounded-full" />
              <div className="bg-muted h-4 w-40 animate-pulse rounded-full" />
              <div className="bg-muted h-3 w-28 animate-pulse rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function MessagesSkeleton() {
  return (
    <div className="space-y-4 p-4 md:p-6">
      {[1, 2, 3].map((item) => (
        <div key={item} className={item % 2 === 0 ? 'flex justify-end' : 'flex justify-start'}>
          <div className="space-y-2">
            <div className="bg-muted h-3 w-24 animate-pulse rounded-full" />
            <div className="bg-muted h-12 w-64 animate-pulse rounded-2xl" />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyPanel({
  icon: Icon,
  title,
  message,
}: {
  icon: typeof Inbox
  title: string
  message: string
}) {
  return (
    <div className="text-muted-foreground flex min-h-72 flex-col items-center justify-center px-6 text-center">
      <div className="bg-muted/70 text-foreground mb-4 flex size-12 items-center justify-center rounded-full">
        <Icon className="size-5" />
      </div>
      <Typography variant="label" className="text-foreground">
        {title}
      </Typography>
      <Typography variant="body-sm" className="mt-1 max-w-sm">
        {message}
      </Typography>
    </div>
  )
}

function TicketItem({
  ticket,
  isSelected,
  onSelect,
}: {
  ticket: SupportTicket
  isSelected: boolean
  onSelect: (id: string) => void
}) {
  return (
    <button
      type="button"
      aria-current={isSelected ? 'page' : undefined}
      aria-label={`Open ticket ${ticket.id}: ${ticket.title}`}
      onClick={() => onSelect(ticket.id)}
      className={`border-border/80 hover:bg-muted/60 relative flex w-full items-start gap-3 border-b px-4 py-3 text-left transition-colors ${
        isSelected ? 'bg-primary/8 shadow-[inset_4px_0_0_0_hsl(var(--primary))]' : 'bg-transparent'
      }`}
    >
      <span
        className={`mt-1.5 size-2.5 shrink-0 rounded-full ${getStatusDotClass(ticket.status)}`}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground text-xs font-medium">{ticket.id}</span>
          <Badge
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusBadgeClass(ticket.status)}`}
          >
            {STATUS_LABELS[ticket.status]}
          </Badge>
        </div>
        <div
          className={`mt-0.5 truncate text-sm font-semibold ${isSelected ? 'text-foreground' : 'text-foreground/90'}`}
        >
          {ticket.title}
        </div>
        <div className="text-muted-foreground mt-0.5 truncate text-xs">
          {ticket.submitterName} · {ticket.submitterRole}
        </div>
        <div className="text-muted-foreground/70 mt-0.5 text-xs">{ticket.dateLabel}</div>
      </div>
    </button>
  )
}

function TicketSidebar({
  tickets,
  selectedTicket,
  loading,
  emptyMessage,
  onSelectTicket,
}: {
  tickets: SupportTicket[]
  selectedTicket: SupportTicket | undefined
  loading: boolean
  emptyMessage: string
  onSelectTicket: (id: string) => void
}) {
  return (
    <aside className="border-border/80 flex min-h-full min-w-0 flex-col border-b md:w-88 md:shrink-0 md:border-r md:border-b-0">
      <div className="border-border/80 border-b px-4 py-2.5">
        <span className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
          Inbox
        </span>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto" aria-label="Ticket list">
        {loading ? <TicketsSkeleton /> : null}
        {!loading && tickets.length === 0 ? (
          <EmptyPanel icon={Inbox} title="No tickets" message={emptyMessage} />
        ) : null}
        {!loading
          ? tickets.map((ticket) => (
              <TicketItem
                key={ticket.id}
                ticket={ticket}
                isSelected={ticket.id === selectedTicket?.id}
                onSelect={onSelectTicket}
              />
            ))
          : null}
      </div>
    </aside>
  )
}

function MessageList({
  messages,
  loading,
  emptyMessage,
  messagesEndRef,
}: {
  messages: SupportMessage[]
  loading: boolean
  emptyMessage: string
  messagesEndRef: React.RefObject<HTMLDivElement | null>
}) {
  if (loading) return <MessagesSkeleton />

  if (messages.length === 0) {
    return <EmptyPanel icon={Inbox} title="No messages yet" message={emptyMessage} />
  }

  return (
    <div className="space-y-4 p-4 md:p-6" aria-live="polite">
      {messages.map((message) => {
        const isAgent = message.sender === 'AGENT'
        return (
          <div key={message.id} className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] space-y-1 sm:max-w-[72%] ${isAgent ? 'items-end text-right' : 'items-start text-left'}`}
            >
              <div className="text-muted-foreground px-1 text-xs">
                {message.senderName} · {message.dateLabel}
              </div>
              <div
                className={`rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap shadow-xs ${
                  isAgent
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-foreground border-border border'
                }`}
              >
                {message.content}
              </div>
            </div>
          </div>
        )
      })}
      <div ref={messagesEndRef} />
    </div>
  )
}

function ReplyComposer({
  draftReply,
  replyPlaceholder,
  isInternalNote,
  selectedMacro,
  macroOptions,
  sending,
  onDraftReplyChange,
  onIsInternalNoteChange,
  onSelectedMacroChange,
  onSend,
}: {
  draftReply: string
  replyPlaceholder: string
  isInternalNote: boolean
  selectedMacro: string
  macroOptions: SupportMacroOption[]
  sending: boolean
  onDraftReplyChange: (value: string) => void
  onIsInternalNoteChange: (value: boolean) => void
  onSelectedMacroChange: (value: string) => void
  onSend: () => Promise<void>
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = '0px'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`
    textarea.style.overflowY = textarea.scrollHeight > 160 ? 'auto' : 'hidden'
  }, [draftReply])

  return (
    <div className="bg-card border-border/80 border-t p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Checkbox
            id="internal-note"
            checked={isInternalNote}
            onCheckedChange={(checked) => onIsInternalNoteChange(checked === true)}
          />
          <Label htmlFor="internal-note" className="text-muted-foreground cursor-pointer text-sm">
            Internal note
          </Label>
        </div>
        {macroOptions.length > 0 ? (
          <Select value={selectedMacro} onValueChange={onSelectedMacroChange}>
            <SelectTrigger className="h-8 w-auto max-w-[220px] border text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {macroOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}
      </div>
      <div className="flex items-end gap-3">
        <Textarea
          ref={textareaRef}
          value={draftReply}
          aria-label="Type your reply"
          onChange={(event) => onDraftReplyChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()
              void onSend()
            }
          }}
          placeholder={replyPlaceholder}
          className="max-h-40 min-h-12 rounded-2xl"
          rows={1}
        />
        <Button
          type="button"
          size="icon-lg"
          aria-label={sending ? 'Sending reply' : 'Send reply'}
          className="rounded-2xl"
          onClick={() => void onSend()}
          disabled={!draftReply.trim() || sending}
          loading={sending}
        >
          {!sending ? <SendHorizontal className="size-4.5" /> : null}
        </Button>
      </div>
    </div>
  )
}

function TicketPane({
  selectedTicket,
  messages,
  loadingMessages,
  emptyMessage,
  unselectedMessage,
  draftReply,
  replyPlaceholder,
  isInternalNote,
  selectedMacro,
  selectedStatus,
  selectedAssignee,
  macroOptions,
  assigneeOptions,
  sending,
  isMobileDetailView,
  messagesEndRef,
  messagesScrollRef,
  onBackToList,
  onMessagesScroll,
  onDraftReplyChange,
  onIsInternalNoteChange,
  onSelectedMacroChange,
  onStatusChange,
  onAssigneeChange,
  onSend,
}: {
  selectedTicket: SupportTicket | undefined
  messages: SupportMessage[]
  loadingMessages: boolean
  emptyMessage: string
  unselectedMessage: string
  draftReply: string
  replyPlaceholder: string
  isInternalNote: boolean
  selectedMacro: string
  selectedStatus: SupportTicketStatus
  selectedAssignee: string
  macroOptions: SupportMacroOption[]
  assigneeOptions: SupportAssigneeOption[]
  sending: boolean
  isMobileDetailView: boolean
  messagesEndRef: React.RefObject<HTMLDivElement | null>
  messagesScrollRef: React.RefObject<HTMLDivElement | null>
  onBackToList: () => void
  onMessagesScroll: () => void
  onDraftReplyChange: (value: string) => void
  onIsInternalNoteChange: (value: boolean) => void
  onSelectedMacroChange: (value: string) => void
  onStatusChange: (status: SupportTicketStatus) => void
  onAssigneeChange: (assignee: string) => void
  onSend: () => Promise<void>
}) {
  if (!selectedTicket) {
    return (
      <section className="bg-muted/20 flex min-h-0 min-w-0 flex-1 basis-0 flex-col items-center justify-center overflow-hidden">
        <EmptyPanel icon={MessageCircle} title="No ticket selected" message={unselectedMessage} />
      </section>
    )
  }

  return (
    <section className="bg-muted/20 flex min-h-0 min-w-0 flex-1 basis-0 flex-col overflow-hidden">
      <header className="bg-card border-border/80 flex flex-wrap items-start gap-3 border-b px-4 py-3 md:px-5">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          {isMobileDetailView ? (
            <button
              type="button"
              aria-label="Back to tickets"
              onClick={onBackToList}
              className="text-muted-foreground hover:text-foreground mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full transition-colors md:hidden"
            >
              <ArrowLeft className="size-4" />
            </button>
          ) : null}
          <MessageCircle className="text-muted-foreground mt-0.5 size-4.5 shrink-0" />
          <div className="min-w-0">
            <div className="text-foreground truncate font-semibold">{selectedTicket.title}</div>
            <div className="text-muted-foreground mt-0.5 text-xs">
              {selectedTicket.submitterName} · {selectedTicket.id} · opened{' '}
              {selectedTicket.openedAtLabel}
            </div>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Select
            value={selectedStatus}
            onValueChange={(v) => onStatusChange(v as SupportTicketStatus)}
          >
            <SelectTrigger className="h-8 w-auto gap-1 border text-sm">
              <span className="text-muted-foreground mr-0.5 text-xs">Status:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(['NEW', 'OPEN', 'PENDING', 'SOLVED'] as SupportTicketStatus[]).map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedAssignee} onValueChange={onAssigneeChange}>
            <SelectTrigger className="h-8 w-auto gap-1 border text-sm">
              <span className="text-muted-foreground mr-0.5 text-xs">Assignee:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {assigneeOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      <div
        ref={messagesScrollRef}
        className="min-h-0 flex-1 overflow-y-auto"
        onScroll={onMessagesScroll}
      >
        <MessageList
          messages={messages}
          loading={loadingMessages}
          emptyMessage={emptyMessage}
          messagesEndRef={messagesEndRef}
        />
      </div>

      <ReplyComposer
        draftReply={draftReply}
        replyPlaceholder={replyPlaceholder}
        isInternalNote={isInternalNote}
        selectedMacro={selectedMacro}
        macroOptions={macroOptions}
        sending={sending}
        onDraftReplyChange={onDraftReplyChange}
        onIsInternalNoteChange={onIsInternalNoteChange}
        onSelectedMacroChange={onSelectedMacroChange}
        onSend={onSend}
      />
    </section>
  )
}

export function SupportClient({
  tickets,
  messages,
  defaultSelectedTicketId,
  selectedTicketId,
  onSelectedTicketChange,
  assigneeOptions,
  macroOptions,
  replyPlaceholder,
  draftReply: draftReplyProp,
  onDraftReplyChange,
  onSendReply,
  onStatusChange,
  onAssigneeChange,
  loadingTickets,
  loadingMessages,
  emptyTicketsMessage,
  emptyMessagesMessage,
  unselectedTicketMessage,
}: SupportClientProps) {
  const [currentSelectedId, setCurrentSelectedId] = useState(
    selectedTicketId ?? defaultSelectedTicketId,
  )
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list')
  const [currentDraft, setCurrentDraft] = useState(draftReplyProp ?? '')
  const [isInternalNote, setIsInternalNote] = useState(false)
  const [selectedMacro, setSelectedMacro] = useState(macroOptions[0]?.value ?? '')
  const [selectedStatus, setSelectedStatus] = useState<SupportTicketStatus>(
    tickets.find((t) => t.id === (selectedTicketId ?? defaultSelectedTicketId))?.status ?? 'NEW',
  )
  const [selectedAssignee, setSelectedAssignee] = useState(
    assigneeOptions[0]?.value ?? 'unassigned',
  )
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesScrollRef = useRef<HTMLDivElement>(null)
  const shouldAutoScrollRef = useRef(true)

  useEffect(() => {
    if (selectedTicketId !== undefined) {
      setCurrentSelectedId(selectedTicketId)
    }
  }, [selectedTicketId])

  useEffect(() => {
    if (!draftReplyProp) {
      setCurrentDraft(draftReplyProp)
    }
  }, [draftReplyProp])

  const selectedTicket = tickets.find((t) => t.id === currentSelectedId) ?? tickets[0]

  useEffect(() => {
    if (selectedTicket) {
      setSelectedStatus(selectedTicket.status)
      setSelectedAssignee(assigneeOptions[0]?.value ?? 'unassigned')
    }
  }, [selectedTicket?.id])

  useEffect(() => {
    shouldAutoScrollRef.current = true
  }, [currentSelectedId])

  useEffect(() => {
    if (!shouldAutoScrollRef.current) return
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages])

  const updateAutoScrollState = () => {
    const container = messagesScrollRef.current
    if (!container) return
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight
    shouldAutoScrollRef.current = distanceFromBottom < 96
  }

  const handleSelectTicket = (id: string) => {
    setCurrentSelectedId(id)
    onSelectedTicketChange?.(id)
    setMobileView('detail')
  }

  const handleStatusChange = (status: SupportTicketStatus) => {
    setSelectedStatus(status)
    if (selectedTicket) void onStatusChange?.(selectedTicket, status)
  }

  const handleAssigneeChange = (assignee: string) => {
    setSelectedAssignee(assignee)
    if (selectedTicket) void onAssigneeChange?.(selectedTicket, assignee)
  }

  const handleDraftChange = (value: string) => {
    setCurrentDraft(value)
    onDraftReplyChange?.(value)
  }

  const handleSend = async () => {
    if (!selectedTicket || !currentDraft.trim() || sending) return
    setSending(true)
    try {
      await Promise.resolve(onSendReply?.(selectedTicket, currentDraft.trim(), isInternalNote))
      setCurrentDraft('')
      shouldAutoScrollRef.current = true
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="bg-card border-border min-h-[60svh] w-full overflow-hidden rounded-lg border shadow-xs md:min-h-[68svh]">
      <div className="flex min-h-[60svh] w-full min-w-0 flex-col overflow-hidden md:min-h-[68svh] md:flex-row">
        <div className={mobileView === 'detail' ? 'hidden md:flex md:min-h-0 md:flex-col' : ''}>
          <TicketSidebar
            tickets={tickets}
            selectedTicket={selectedTicket}
            loading={loadingTickets}
            emptyMessage={emptyTicketsMessage}
            onSelectTicket={handleSelectTicket}
          />
        </div>
        <div className={mobileView === 'list' ? 'hidden min-h-0 flex-1 md:flex' : 'min-h-0 flex-1'}>
          <TicketPane
            selectedTicket={selectedTicket}
            messages={messages}
            loadingMessages={loadingMessages}
            emptyMessage={emptyMessagesMessage}
            unselectedMessage={unselectedTicketMessage}
            draftReply={currentDraft}
            replyPlaceholder={replyPlaceholder}
            isInternalNote={isInternalNote}
            selectedMacro={selectedMacro}
            selectedStatus={selectedStatus}
            selectedAssignee={selectedAssignee}
            macroOptions={macroOptions}
            assigneeOptions={assigneeOptions}
            sending={sending}
            isMobileDetailView={mobileView === 'detail'}
            messagesEndRef={messagesEndRef}
            messagesScrollRef={messagesScrollRef}
            onBackToList={() => setMobileView('list')}
            onMessagesScroll={updateAutoScrollState}
            onDraftReplyChange={handleDraftChange}
            onIsInternalNoteChange={setIsInternalNote}
            onSelectedMacroChange={setSelectedMacro}
            onStatusChange={handleStatusChange}
            onAssigneeChange={handleAssigneeChange}
            onSend={handleSend}
          />
        </div>
      </div>
    </div>
  )
}

// Re-export default props for convenience
export { supportDefaultProps }
