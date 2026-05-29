import { formatDateIntl } from '@ecom/shared'
import type { VoucherRecord, VoucherStatus } from '@ecom/ui-admin'
import type { VoucherListItem } from '../api/promotions.api'

function toVoucherStatus(status: string): VoucherStatus {
  const map: Record<string, VoucherStatus> = {
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

export function mapVoucherToVoucherRecord(voucher: VoucherListItem): VoucherRecord {
  const dateRange = `${formatDateIntl(voucher.startsAt)} — ${formatDateIntl(voucher.expiresAt)}`
  const budgetPct = voucher.usageLimit
    ? Math.round((voucher.usedCount / voucher.usageLimit) * 100)
    : 0

  return {
    id: voucher.id,
    name: voucher.name,
    type: voucher.type,
    category: '—',
    dateRange,
    status: toVoucherStatus(voucher.status),
    impressions: '—',
    ctr: '—',
    redemptions: String(voucher.usedCount),
    budgetSpent: voucher.discountValue,
    budgetTotal: voucher.maxDiscountAmount ?? voucher.discountValue,
    budgetPercent: budgetPct,
  } satisfies VoucherRecord
}
