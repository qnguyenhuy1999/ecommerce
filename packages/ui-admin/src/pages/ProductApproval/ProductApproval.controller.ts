import { useCallback, useMemo, useState } from 'react'
import {
  areSelectedIdsEqual,
  buildProductApprovalStatusCounts,
  filterProductApprovalItems,
} from './ProductApproval.constants'
import type {
  PendingAction,
  ProductApprovalActionPayload,
  ProductApprovalClientProps,
  ProductApprovalItem,
  ProductApprovalState,
} from './ProductApproval.types'

function getInitialState(
  items: ProductApprovalItem[],
  initialStatus: ProductApprovalState['activeStatus'],
) {
  return {
    activeStatus: initialStatus,
    search: '',
    selectedIds: [],
    detailItemId: items[0]?.id ?? null,
    sheetOpen: false,
    pendingAction: null,
    reason: '',
    reasonError: '',
    submitting: false,
  } satisfies ProductApprovalState
}

export function useProductApprovalController({
  items,
  statusTabs,
  onApprove,
  onReject,
}: Pick<ProductApprovalClientProps, 'items' | 'statusTabs' | 'onApprove' | 'onReject'>) {
  const [state, setState] = useState<ProductApprovalState>(() =>
    getInitialState(items, statusTabs[0]?.value ?? 'PENDING'),
  )

  const statusCounts = useMemo(() => buildProductApprovalStatusCounts(statusTabs), [statusTabs])
  const filteredItems = useMemo(
    () => filterProductApprovalItems(items, state.activeStatus, state.search),
    [items, state.activeStatus, state.search],
  )
  const detailItem = useMemo(
    () => items.find((item) => item.id === state.detailItemId) ?? null,
    [items, state.detailItemId],
  )

  const openAction = useCallback((action: PendingAction, ids: string[]) => {
    if (ids.length === 0) {
      return
    }

    setState((current) => ({
      ...current,
      pendingAction: action,
      selectedIds: ids,
      reason: '',
      reasonError: '',
      submitting: false,
    }))
  }, [])

  const closeAction = useCallback(() => {
    setState((current) => ({
      ...current,
      pendingAction: null,
      reason: '',
      reasonError: '',
      submitting: false,
    }))
  }, [])

  const setSelectedItems = useCallback((selectedItems: ProductApprovalItem[]) => {
    const nextSelectedIds = selectedItems.map((item) => item.id)

    setState((current) => {
      if (areSelectedIdsEqual(current.selectedIds, nextSelectedIds)) {
        return current
      }

      return {
        ...current,
        selectedIds: nextSelectedIds,
      }
    })
  }, [])

  const submitAction = useCallback(async () => {
    if (!state.pendingAction) {
      return
    }

    const trimmedReason = state.reason.trim()
    if (!trimmedReason) {
      setState((current) => ({ ...current, reasonError: 'Reason required.' }))
      return
    }

    setState((current) => ({ ...current, submitting: true, reasonError: '' }))

    const payload: ProductApprovalActionPayload = {
      ids: state.selectedIds,
      reason: trimmedReason,
      action: state.pendingAction,
    }

    try {
      if (state.pendingAction === 'approve') {
        await onApprove?.(payload)
      } else {
        await onReject?.(payload)
      }

      closeAction()
    } catch (error) {
      setState((current) => ({
        ...current,
        submitting: false,
        reasonError: error instanceof Error && error.message ? error.message : 'Action failed.',
      }))
    }
  }, [closeAction, onApprove, onReject, state])

  const openDetail = useCallback((item: ProductApprovalItem) => {
    setState((current) => ({
      ...current,
      detailItemId: item.id,
      sheetOpen: true,
    }))
  }, [])

  const setSearch = useCallback((search: string) => {
    setState((current) => ({ ...current, search }))
  }, [])

  const setActiveStatus = useCallback((activeStatus: ProductApprovalState['activeStatus']) => {
    setState((current) => ({ ...current, activeStatus }))
  }, [])

  const setSheetOpen = useCallback((sheetOpen: boolean) => {
    setState((current) => ({ ...current, sheetOpen }))
  }, [])

  const setReason = useCallback((reason: string) => {
    setState((current) => ({
      ...current,
      reason,
      reasonError: '',
    }))
  }, [])

  return {
    state,
    statusCounts,
    filteredItems,
    detailItem,
    setSelectedItems,
    setSearch,
    setActiveStatus,
    setSheetOpen,
    setReason,
    openDetail,
    openAction,
    closeAction,
    submitAction,
  }
}
