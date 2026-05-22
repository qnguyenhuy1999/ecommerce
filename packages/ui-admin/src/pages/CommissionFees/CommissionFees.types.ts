export interface CommissionRule {
  id: string
  label: string
  commissionPct: number
  paymentFeePct: number
  effectiveFrom: string
}

export interface CommissionFeesProps {
  title?: string
  description?: string
  addRuleLabel?: string
  sampleOrderAmount?: number
  globalRate?: CommissionRule
  categoryOverrides?: CommissionRule[]
  vendorOverrides?: CommissionRule[]
  onSave?: ((rule: CommissionRule) => void | Promise<void>) | undefined
  onAddRule?: (() => void | Promise<void>) | undefined
}
