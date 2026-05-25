import { useCallback, useMemo, useState } from 'react'
import { buildReviewStatusCounts, REVIEWS_STATUS_TAB_ORDER } from './Reviews.constants'
import type { ReviewRecord, ReviewStatus, ReviewsProps } from './Reviews.types'

interface ReviewsControllerProps {
  items: ReviewRecord[]
  statusTabs: NonNullable<ReviewsProps['statusTabs']>
  onApprove: ReviewsProps['onApprove']
  onHide: ReviewsProps['onHide']
  onReject: ReviewsProps['onReject']
}

interface ReviewsState {
  search: string
  activeTab: 'ALL' | ReviewStatus
}

export function useReviewsController({
  items,
  statusTabs,
  onApprove,
  onHide,
  onReject,
}: ReviewsControllerProps) {
  const [state, setState] = useState<ReviewsState>({
    search: '',
    activeTab: 'ALL',
  })

  const counts = useMemo(() => buildReviewStatusCounts(statusTabs), [statusTabs])

  const filteredItems = useMemo(() => {
    const query = state.search.trim().toLowerCase()

    return items.filter((item) => {
      const matchesSearch =
        query.length === 0 || item.commentPreview.toLowerCase().includes(query)
      const matchesTab = state.activeTab === 'ALL' || item.status === state.activeTab

      return matchesSearch && matchesTab
    })
  }, [items, state])

  const setSearch = useCallback((search: string) => {
    setState((current) => ({ ...current, search }))
  }, [])

  const setActiveTab = useCallback((activeTab: 'ALL' | ReviewStatus) => {
    setState((current) => ({ ...current, activeTab }))
  }, [])

  const handleApprove = useCallback(
    (item: ReviewRecord) => {
      onApprove?.(item)
    },
    [onApprove],
  )

  const handleHide = useCallback(
    (item: ReviewRecord) => {
      onHide?.(item)
    },
    [onHide],
  )

  const handleReject = useCallback(
    (item: ReviewRecord) => {
      onReject?.(item)
    },
    [onReject],
  )

  return {
    state,
    counts,
    filteredItems,
    statusTabOrder: REVIEWS_STATUS_TAB_ORDER,
    setSearch,
    setActiveTab,
    handleApprove,
    handleHide,
    handleReject,
  }
}
