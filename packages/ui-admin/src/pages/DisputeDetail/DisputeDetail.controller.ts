import { useCallback, useState } from 'react'
import type { RefundDetailProps, RefundDetailRecord } from './DisputeDetail.types'

interface RefundDetailControllerProps {
  item: RefundDetailRecord
  onApplyResolution: RefundDetailProps['onApplyResolution']
}

interface RefundDetailState {
  selectedResolution: string
  internalNote: string
}

export function useRefundDetailController({
  item,
  onApplyResolution,
}: RefundDetailControllerProps) {
  const [state, setState] = useState<RefundDetailState>({
    selectedResolution: item.selectedResolution,
    internalNote: '',
  })

  const setSelectedResolution = useCallback((selectedResolution: string) => {
    setState((current) => ({ ...current, selectedResolution }))
  }, [])

  const setInternalNote = useCallback((internalNote: string) => {
    setState((current) => ({ ...current, internalNote }))
  }, [])

  const handleApplyResolution = useCallback(async () => {
    await onApplyResolution?.({
      item,
      resolution: state.selectedResolution,
      note: state.internalNote,
    })
  }, [item, onApplyResolution, state.internalNote, state.selectedResolution])

  return {
    state,
    setSelectedResolution,
    setInternalNote,
    handleApplyResolution,
  }
}
