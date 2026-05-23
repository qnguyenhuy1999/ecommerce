import { useCallback, useState } from 'react'
import type { DisputeDetailProps, DisputeDetailRecord } from './DisputeDetail.types'

interface DisputeDetailControllerProps {
  item: DisputeDetailRecord
  onApplyResolution: DisputeDetailProps['onApplyResolution']
}

interface DisputeDetailState {
  selectedResolution: string
  internalNote: string
}

export function useDisputeDetailController({
  item,
  onApplyResolution,
}: DisputeDetailControllerProps) {
  const [state, setState] = useState<DisputeDetailState>({
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
