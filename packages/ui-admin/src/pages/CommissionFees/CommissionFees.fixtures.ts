import type { CommissionFeesProps, CommissionRule } from './CommissionFees.types'

export const defaultGlobalRate: CommissionRule = {
  id: 'global-default',
  label: 'Default platform rate',
  commissionPct: 7.5,
  paymentFeePct: 2.4,
  effectiveFrom: 'Feb 10, 2026',
}

export const commissionFeesDefaultProps: CommissionFeesProps = {
  title: 'Commission & fees',
  description: 'Effective rates by scope. Vendor overrides take precedence.',
  addRuleLabel: 'Add rule',
  sampleOrderAmount: 100,
  globalRate: {
    id: 'global-default',
    label: 'Default platform rate',
    commissionPct: 7.5,
    paymentFeePct: 2.4,
    effectiveFrom: 'Feb 10, 2026',
  },
  categoryOverrides: [
    {
      id: 'cat-electronics',
      label: 'Electronics',
      commissionPct: 5,
      paymentFeePct: 2.4,
      effectiveFrom: 'Mar 12, 2026',
    },
    {
      id: 'cat-fashion',
      label: 'Fashion',
      commissionPct: 9.5,
      paymentFeePct: 2.4,
      effectiveFrom: 'Mar 27, 2026',
    },
    {
      id: 'cat-beauty',
      label: 'Beauty',
      commissionPct: 11,
      paymentFeePct: 2.4,
      effectiveFrom: 'Apr 11, 2026',
    },
  ],
  vendorOverrides: [
    {
      id: 'vendor-atelier-noor',
      label: 'Atelier Noor (Mall)',
      commissionPct: 6,
      paymentFeePct: 2,
      effectiveFrom: 'Apr 27, 2026',
    },
    {
      id: 'vendor-lumen-audio',
      label: 'Lumen Audio Official (Mall)',
      commissionPct: 6,
      paymentFeePct: 2,
      effectiveFrom: 'Apr 27, 2026',
    },
  ],
}
