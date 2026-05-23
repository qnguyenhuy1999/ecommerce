import type { CommissionRuleScope } from './CommissionFees.types'

export const TODAY = new Date().toISOString().slice(0, 10)

export const SCOPE_LABELS: Record<CommissionRuleScope, string> = {
  global: 'Global',
  category: 'Category',
  vendor: 'Vendor',
}

export const COMMISSION_SECTION_TITLES = {
  global: 'Global rate',
  category: 'Category overrides',
  vendor: 'Vendor overrides',
} as const
