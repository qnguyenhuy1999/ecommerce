import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  SupportAssigneeOption,
  SupportMacroOption,
  SupportMessage,
  SupportProps,
  SupportTicket,
  SupportTicketStatus,
} from './Support.types'

export interface SupportControllerProps {
  tickets: SupportTicket[]
  messages: SupportMessage[]
  defaultSelectedTicketId: string
  selectedTicketId?: string | undefined
  assigneeOptions: SupportAssigneeOption[]
  macroOptions: SupportMacroOption[]
  draftReply?: string
  onSelectedTicketChange?: SupportProps['onSelectedTicketChange']
  onDraftReplyChange?: SupportProps['onDraftReplyChange']
  onSendReply?: SupportProps['onSendReply']
  onStatusChange?: SupportProps['onStatusChange']
  onAssigneeChange?: SupportProps['onAssigneeChange']
}

export function useSupportController({
  tickets,
  messages,
  defaultSelectedTicketId,
  selectedTicketId,
  assigneeOptions,
  macroOptions,
  draftReply: draftReplyProp,
  onSelectedTicketChange,
  onDraftReplyChange,
  onSendReply,
  onStatusChange,
  onAssigneeChange,
}: SupportControllerProps) {
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

  const selectedTicket = tickets.find((t) => t.id === currentSelectedId) ?? tickets[0]

  useEffect(() => {
    if (selectedTicketId !== undefined) {
      setCurrentSelectedId(selectedTicketId)
    }
  }, [selectedTicketId])

  useEffect(() => {
    if (!draftReplyProp) {
      setCurrentDraft(draftReplyProp ?? '')
    }
  }, [draftReplyProp])

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

  const updateAutoScrollState = useCallback(() => {
    const container = messagesScrollRef.current
    if (!container) return
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight
    shouldAutoScrollRef.current = distanceFromBottom < 96
  }, [])

  const handleSelectTicket = useCallback(
    (id: string) => {
      setCurrentSelectedId(id)
      onSelectedTicketChange?.(id)
      setMobileView('detail')
    },
    [onSelectedTicketChange],
  )

  const handleStatusChange = useCallback(
    (status: SupportTicketStatus) => {
      setSelectedStatus(status)
      if (selectedTicket) void onStatusChange?.(selectedTicket, status)
    },
    [onStatusChange, selectedTicket],
  )

  const handleAssigneeChange = useCallback(
    (assignee: string) => {
      setSelectedAssignee(assignee)
      if (selectedTicket) void onAssigneeChange?.(selectedTicket, assignee)
    },
    [onAssigneeChange, selectedTicket],
  )

  const handleDraftChange = useCallback(
    (value: string) => {
      setCurrentDraft(value)
      onDraftReplyChange?.(value)
    },
    [onDraftReplyChange],
  )

  const handleSend = useCallback(async () => {
    if (!selectedTicket || !currentDraft.trim() || sending) return
    setSending(true)
    try {
      await Promise.resolve(onSendReply?.(selectedTicket, currentDraft.trim(), isInternalNote))
      setCurrentDraft('')
      shouldAutoScrollRef.current = true
    } finally {
      setSending(false)
    }
  }, [currentDraft, isInternalNote, onSendReply, selectedTicket, sending])

  const handleBackToList = useCallback(() => {
    setMobileView('list')
  }, [])

  return {
    state: {
      currentSelectedId,
      mobileView,
      currentDraft,
      isInternalNote,
      selectedMacro,
      selectedStatus,
      selectedAssignee,
      sending,
    },
    refs: {
      messagesEndRef,
      messagesScrollRef,
    },
    computed: {
      selectedTicket,
    },
    handlers: {
      handleSelectTicket,
      handleStatusChange,
      handleAssigneeChange,
      handleDraftChange,
      handleSend,
      handleBackToList,
      setIsInternalNote,
      setSelectedMacro,
      updateAutoScrollState,
    },
  }
}
