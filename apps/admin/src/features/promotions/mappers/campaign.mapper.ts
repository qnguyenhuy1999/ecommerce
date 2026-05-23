import type { CampaignRecord, CampaignStatus } from '@ecom/ui-admin'
import type { VoucherListItem } from '../api/promotions.api'

function toCampaignStatus(status: string): CampaignStatus {
  const map: Record<string, CampaignStatus> = {
    ACTIVE: 'LIVE',
    LIVE: 'LIVE',
    SCHEDULED: 'SCHEDULED',
    EXPIRED: 'ENDED',
    ENDED: 'ENDED',
    INACTIVE: 'DRAFT',
    DRAFT: 'DRAFT',
  }
  return map[status] ?? 'DRAFT'
}

export function mapVoucherToCampaignRecord(voucher: VoucherListItem): CampaignRecord {
  const dateRange = `${new Date(voucher.startsAt).toLocaleDateString()} — ${new Date(voucher.expiresAt).toLocaleDateString()}`
  const budgetPct = voucher.usageLimit
    ? Math.round((voucher.usedCount / voucher.usageLimit) * 100)
    : 0

  return {
    id: voucher.id,
    name: voucher.name,
    type: voucher.type,
    category: '—',
    dateRange,
    status: toCampaignStatus(voucher.status),
    impressions: '—',
    ctr: '—',
    redemptions: String(voucher.usedCount),
    budgetSpent: voucher.discountValue,
    budgetTotal: voucher.maxDiscountAmount ?? voucher.discountValue,
    budgetPercent: budgetPct,
  } satisfies CampaignRecord
}
