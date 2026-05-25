import { useCallback, useMemo, useState } from 'react'
import { filterRefundItems } from './Disputes.constants'
import type {
  RefundCasePriority,
  RefundCaseQueue,
  RefundRecord,
  RefundCaseResolution,
  RefundStatus,
  RefundsProps,
} from './Disputes.types'

interface RefundsControllerProps {
  items: RefundRecord[]
  onOpenCase: RefundsProps['onOpenCase']
}

interface RefundsState {
  search: string
  priorityFilter: 'ALL' | RefundCasePriority
  statusFilter: 'ALL' | RefundStatus
  queueFilter: 'ALL' | RefundCaseQueue
  resolutionFilter: 'ALL' | RefundCaseResolution
}

export function useRefundsController({ items, onOpenCase }: RefundsControllerProps) {
  const [state, setState] = useState<RefundsState>({
    search: '',
    priorityFilter: 'ALL',
    statusFilter: 'ALL',
    queueFilter: 'ALL',
    resolutionFilter: 'ALL',
  })

  const filteredItems = useMemo(
    () =>
      filterRefundItems(items, {
        search: state.search,
        priorityFilter: state.priorityFilter,
        statusFilter: state.statusFilter,
        queueFilter: state.queueFilter,
        resolutionFilter: state.resolutionFilter,
      }),
    [items, state],
  )

  const setSearch = useCallback((search: string) => {
    setState((current) => ({ ...current, search }))
  }, [])

  const setPriorityFilter = useCallback((priorityFilter: 'ALL' | RefundCasePriority) => {
    setState((current) => ({ ...current, priorityFilter }))
  }, [])

  const setStatusFilter = useCallback((statusFilter: 'ALL' | RefundStatus) => {
    setState((current) => ({ ...current, statusFilter }))
  }, [])

  const setQueueFilter = useCallback((queueFilter: 'ALL' | RefundCaseQueue) => {
    setState((current) => ({ ...current, queueFilter }))
  }, [])

  const setResolutionFilter = useCallback((resolutionFilter: 'ALL' | RefundCaseResolution) => {
    setState((current) => ({ ...current, resolutionFilter }))
  }, [])

  const handleOpen = useCallback(
    (item: RefundRecord) => {
      void onOpenCase?.(item)
    },
    [onOpenCase],
  )

  return {
    state,
    filteredItems,
    setSearch,
    setPriorityFilter,
    setStatusFilter,
    setQueueFilter,
    setResolutionFilter,
    handleOpen,
  }
}
