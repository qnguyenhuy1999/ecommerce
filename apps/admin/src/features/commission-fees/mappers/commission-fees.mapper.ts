import { formatDateIntl } from '@ecom/shared'
import type { CommissionRule } from '@ecom/ui-admin'
import type { CommissionRuleApiItem } from '../api/commission-fees.api'

export function mapApiRuleToCommissionRule(item: CommissionRuleApiItem): CommissionRule {
  return {
    id: item.id,
    label: item.label,
    commissionPct: item.commissionPct,
    paymentFeePct: item.paymentFeePct,
    effectiveFrom: formatDateIntl(
      item.effectiveFrom,
      { month: 'short', day: 'numeric', year: 'numeric' },
      'en-US',
    ),
  } satisfies CommissionRule
}
