import { useCallback, useMemo, useState } from 'react'
import { filterDisputeItems } from './Disputes.constants'
import type {
  DisputePriority,
  DisputeQueue,
  DisputeRecord,
  DisputeResolution,
  DisputeStatus,
  DisputesProps,
} from './Disputes.types'

interface DisputesControllerProps {
  items: DisputeRecord[]
  onOpenCase: DisputesProps['onOpenCase']
}

interface DisputesState {
  search: string
  priorityFilter: 'ALL' | DisputePriority
  statusFilter: 'ALL' | DisputeStatus
  queueFilter: 'ALL' | DisputeQueue
  resolutionFilter: 'ALL' | DisputeResolution
}

export function useDisputesController({ items, onOpenCase }: DisputesControllerProps) {
  const [state, setState] = useState<DisputesState>({
    search: '',
    priorityFilter: 'ALL',
    statusFilter: 'ALL',
    queueFilter: 'ALL',
    resolutionFilter: 'ALL',
  })

  const filteredItems = useMemo(
    () =>
      filterDisputeItems(items, {
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

  const setPriorityFilter = useCallback((priorityFilter: 'ALL' | DisputePriority) => {
    setState((current) => ({ ...current, priorityFilter }))
  }, [])

  const setStatusFilter = useCallback((statusFilter: 'ALL' | DisputeStatus) => {
    setState((current) => ({ ...current, statusFilter }))
  }, [])

  const setQueueFilter = useCallback((queueFilter: 'ALL' | DisputeQueue) => {
    setState((current) => ({ ...current, queueFilter }))
  }, [])

  const setResolutionFilter = useCallback((resolutionFilter: 'ALL' | DisputeResolution) => {
    setState((current) => ({ ...current, resolutionFilter }))
  }, [])

  const handleOpen = useCallback(
    (item: DisputeRecord) => {
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
