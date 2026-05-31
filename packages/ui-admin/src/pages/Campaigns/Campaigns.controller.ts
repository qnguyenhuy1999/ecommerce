import { useMemo, useState } from 'react'
import { campaignStatuses, type CampaignRecord, type CampaignStatus } from './Campaigns.types'

export function useCampaignsController({ items }: { items: CampaignRecord[] }) {
  const [activeTab, setActiveTab] = useState<CampaignStatus>('ACTIVE')

  const counts = useMemo(() => {
    const result = {} as Record<CampaignStatus, number>
    for (const status of campaignStatuses) {
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
