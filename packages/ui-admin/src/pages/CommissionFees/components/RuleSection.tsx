'use client'

import { Typography } from '@ecom/core-ui/atoms/Typography'
import type { CommissionRule, DraftValues } from '../CommissionFees.types'
import { RuleRow } from './RuleRow'

function TableHeader() {
  return (
    <thead>
      <tr className="bg-muted/40 border-b">
        <th className="text-muted-foreground px-5 py-3 text-left text-xs font-medium tracking-wide uppercase">
          Rule
        </th>
        <th className="text-muted-foreground w-40 px-5 py-3 text-left text-xs font-medium tracking-wide uppercase">
          Commission %
        </th>
        <th className="text-muted-foreground w-36 px-5 py-3 text-left text-xs font-medium tracking-wide uppercase">
          Payment Fee %
        </th>
        <th className="text-muted-foreground px-5 py-3 text-left text-xs font-medium tracking-wide uppercase">
          Effective From
        </th>
        <th className="w-16" />
      </tr>
    </thead>
  )
}

export interface RuleSectionProps {
  title: string
  rules: CommissionRule[]
  drafts: Map<string, DraftValues>
  onCommissionChange: (id: string, value: string) => void
  onPaymentFeeChange: (id: string, value: string) => void
  onSave: (rule: CommissionRule, draft: DraftValues) => void
}

export function RuleSection({
  title,
  rules,
  drafts,
  onCommissionChange,
  onPaymentFeeChange,
  onSave,
}: RuleSectionProps) {
  return (
    <div className="bg-card border-border overflow-hidden rounded-2xl border">
      <div className="px-5 py-4">
        <Typography variant="label" className="text-foreground font-semibold">
          {title}
        </Typography>
      </div>
      <table className="w-full border-t">
        <TableHeader />
        <tbody>
          {rules.map((rule) => {
            const draft = drafts.get(rule.id)
            if (!draft) return null
            return (
              <RuleRow
                key={rule.id}
                rule={rule}
                draft={draft}
                onCommissionChange={onCommissionChange}
                onPaymentFeeChange={onPaymentFeeChange}
                onSave={onSave}
              />
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
