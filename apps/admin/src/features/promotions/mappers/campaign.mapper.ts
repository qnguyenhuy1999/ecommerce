import { formatDateIntl } from '@ecom/shared/utils/format'
import type { CampaignRecord, CampaignStatus } from '@ecom/ui-admin/pages/Campaigns'
import type { CampaignListItem } from '../api/promotions.api'

function toCampaignStatus(status: string): CampaignStatus {
  const map: Record<string, CampaignStatus> = {
    ACTIVE: 'ACTIVE',
    LIVE: 'ACTIVE',
    SCHEDULED: 'PAUSED',
    EXPIRED: 'EXPIRED',
    ENDED: 'EXPIRED',
    INACTIVE: 'DRAFT',
    DRAFT: 'DRAFT',
  }
  return map[status] ?? 'DRAFT'
}

export function mapCampaignToCampaignRecord(campaign: CampaignListItem): CampaignRecord {
  const dateRange = `${formatDateIntl(campaign.startsAt)} — ${formatDateIntl(campaign.expiresAt)}`
  const budgetPct = campaign.usageLimit
    ? Math.round((campaign.usedCount / campaign.usageLimit) * 100)
    : 0

  return {
    id: campaign.id,
    name: campaign.name,
    type: campaign.type,
    category: '—',
    dateRange,
    status: toCampaignStatus(campaign.status),
    impressions: '—',
    ctr: '—',
    redemptions: String(campaign.usedCount),
    budgetSpent: campaign.discountValue,
    budgetTotal: campaign.maxDiscountAmount ?? campaign.discountValue,
    budgetPercent: budgetPct,
  } satisfies CampaignRecord
}
