import { startTransition, useCallback, useDeferredValue, useMemo, useState } from 'react'
import { useControllableState } from '../../hooks'
import { buildReturnActionPayload, buildReturnStatusCounts } from './ReturnsRefunds.constants'
import type {
  RefundMethod,
  ReturnRow,
  ReturnsRefundsProps,
  ReturnsRefundsStatusTab,
} from './ReturnsRefunds.types'
import { filterReturnsBySearchAndStatus, isReturnsRefundsStatusTab } from './ReturnsRefunds.utils'

interface ReturnsRefundsControllerProps {
  returns: ReturnRow[]
  statusTabs: NonNullable<ReturnsRefundsProps['statusTabs']>
  status?: ReturnsRefundsProps['status']
  defaultStatus: NonNullable<ReturnsRefundsProps['defaultStatus']>
  onStatusChange?: ReturnsRefundsProps['onStatusChange']
  statusCounts?: ReturnsRefundsProps['statusCounts']
  filterReturns: NonNullable<ReturnsRefundsProps['filterReturns']>
  onAction: NonNullable<ReturnsRefundsProps['onAction']>
  onApprove: NonNullable<ReturnsRefundsProps['onApprove']>
  onPartial: NonNullable<ReturnsRefundsProps['onPartial']>
  onReject: NonNullable<ReturnsRefundsProps['onReject']>
}

export function useReturnsRefundsController({
  returns,
  statusTabs,
  status,
  defaultStatus,
  onStatusChange,
  statusCounts,
  filterReturns = filterReturnsBySearchAndStatus,
  onAction,
  onApprove,
  onPartial,
  onReject,
}: ReturnsRefundsControllerProps) {
  const [search, setSearch] = useControllableState({
    defaultValue: '',
  })
  const [currentStatus, setCurrentStatus] = useControllableState<ReturnsRefundsStatusTab>({
    defaultValue: defaultStatus,
    ...(status !== undefined ? { value: status } : {}),
    ...(onStatusChange !== undefined ? { onChange: onStatusChange } : {}),
  })
  const [selectedCase, setSelectedCase] = useState<ReturnRow | null>(null)
  const [refundMethod, setRefundMethod] = useState<RefundMethod>('ORIGINAL_PAYMENT')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const deferredSearch = useDeferredValue(search)

  const counts = useMemo(
    () => statusCounts ?? buildReturnStatusCounts(returns),
    [returns, statusCounts],
  )
  const filteredReturns = useMemo(
    () => filterReturns({ returns, search: deferredSearch, status: currentStatus }),
    [currentStatus, deferredSearch, filterReturns, returns],
  )

  const dispatchAction = useCallback(
    async (...args: Parameters<NonNullable<ReturnsRefundsProps['onAction']>>) => {
      await Promise.resolve(onAction?.(...args))
    },
    [onAction],
  )

  const handleSelectCase = useCallback((row: ReturnRow) => {
    setSelectedCase(row)
    setRefundMethod('ORIGINAL_PAYMENT')
    setSheetOpen(true)
  }, [])

  const closeApproveDialog = useCallback(() => {
    setApproveDialogOpen(false)
  }, [])

  const handleApproveRequest = useCallback(() => {
    setApproveDialogOpen(true)
  }, [])

  const handleApproveConfirm = useCallback(() => {
    if (!selectedCase) {
      return
    }

    void dispatchAction(buildReturnActionPayload('approve', selectedCase, refundMethod))
    onApprove(selectedCase.id, refundMethod)
    setApproveDialogOpen(false)
    setSheetOpen(false)
  }, [dispatchAction, onApprove, refundMethod, selectedCase])

  const handlePartial = useCallback(() => {
    if (!selectedCase) {
      return
    }

    void dispatchAction(buildReturnActionPayload('partial', selectedCase, refundMethod))
    onPartial(selectedCase.id, refundMethod)
    setSheetOpen(false)
  }, [dispatchAction, onPartial, refundMethod, selectedCase])

  const handleReject = useCallback(() => {
    if (!selectedCase) {
      return
    }

    void dispatchAction(buildReturnActionPayload('reject', selectedCase, refundMethod))
    onReject(selectedCase.id)
    setSheetOpen(false)
  }, [dispatchAction, onReject, refundMethod, selectedCase])

  const handleSearchChange = useCallback(
    (value: string) => {
      startTransition(() => {
        setSearch(value)
      })
    },
    [setSearch],
  )

  const handleStatusChange = useCallback(
    (tab: string) => {
      if (isReturnsRefundsStatusTab(tab)) {
        startTransition(() => {
          setCurrentStatus(tab)
        })
      }
    },
    [setCurrentStatus],
  )

  return {
    state: {
      search,
      currentStatus,
      selectedCase,
      refundMethod,
      sheetOpen,
      approveDialogOpen,
    },
    computed: {
      counts,
      filteredReturns,
      statusTabs,
    },
    handlers: {
      setSheetOpen,
      setRefundMethod,
      handleSelectCase,
      handleSearchChange,
      handleStatusChange,
      handleApproveRequest,
      handleApproveConfirm,
      handlePartial,
      handleReject,
      closeApproveDialog,
    },
  }
}
