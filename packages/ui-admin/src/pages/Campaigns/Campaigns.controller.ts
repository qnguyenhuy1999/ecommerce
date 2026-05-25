import { useMemo, useState } from 'react'
import { voucherStatuses, type VoucherRecord, type VoucherStatus } from './Campaigns.types'

export function useVouchersController({ items }: { items: VoucherRecord[] }) {
  const [activeTab, setActiveTab] = useState<VoucherStatus>('ACTIVE')

  const counts = useMemo(() => {
    const result = {} as Record<VoucherStatus, number>
    for (const status of voucherStatuses) {
      result[status] = items.filter((item) => item.status === status).length
    }
    return result
  }, [items])

  const filtered = useMemo(
    () => items.filter((item) => item.status === activeTab),
    [items, activeTab],
  )

  return {
    state: {
      activeTab,
    },
    computed: {
      counts,
      filtered,
    },
    handlers: {
      setActiveTab,
    },
  }
}
