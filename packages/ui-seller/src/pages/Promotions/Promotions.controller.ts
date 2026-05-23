import { useCallback, useMemo, useState } from 'react'
import { buildPromotionStatusCounts, groupPromotionsByStatus } from './Promotions.utils'
import type { PromotionRow, PromotionsProps } from './Promotions.types'

interface UsePromotionsControllerProps {
  promotions: PromotionRow[]
  onActiveChange?: PromotionsProps['onActiveChange']
}

export function usePromotionsController({
  promotions,
  onActiveChange,
}: UsePromotionsControllerProps) {
  const [activeOverrides, setActiveOverrides] = useState<Record<string, boolean>>({})

  const rows = useMemo(() => {
    return promotions.map((promotion) => {
      const activeOverride = activeOverrides[promotion.id]
      return activeOverride === undefined ? promotion : { ...promotion, active: activeOverride }
    })
  }, [activeOverrides, promotions])

  const statusCounts = useMemo(() => buildPromotionStatusCounts(rows), [rows])
  const promotionsByStatus = useMemo(() => groupPromotionsByStatus(rows), [rows])

  const handleActiveChange = useCallback(
    (promotionId: string, active: boolean) => {
      setActiveOverrides((current) => ({ ...current, [promotionId]: active }))
      onActiveChange?.(promotionId, active)
    },
    [onActiveChange],
  )

  return {
    rows,
    statusCounts,
    promotionsByStatus,
    handleActiveChange,
  }
}
