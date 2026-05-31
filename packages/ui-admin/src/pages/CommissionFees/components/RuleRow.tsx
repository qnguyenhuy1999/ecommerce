'use client'

import { Button } from '@ecom/core-ui/atoms/Button'
import { NumberInput } from '@ecom/core-ui/atoms/NumberInput'
import { Typography } from '@ecom/core-ui/atoms/Typography'
import type { CommissionRule, DraftValues } from '../CommissionFees.types'

function toNumberInputValue(value: string) {
  if (value.trim() === '') {
    return ''
  }

  const parsed = Number(value)
  return Number.isNaN(parsed) ? '' : parsed
}

function toStringValue(value: number | '') {
  return value === '' ? '' : String(value)
}

export interface RuleRowProps {
  rule: CommissionRule
  draft: DraftValues
  onCommissionChange: (id: string, value: string) => void
  onPaymentFeeChange: (id: string, value: string) => void
  onSave: (rule: CommissionRule, draft: DraftValues) => void
}

export function RuleRow({
  rule,
  draft,
  onCommissionChange,
  onPaymentFeeChange,
  onSave,
}: RuleRowProps) {
  return (
    <tr className="border-b last:border-0">
      <td className="px-5 py-3 align-middle">
        <Typography variant="body-sm" className="text-foreground">
          {rule.label}
        </Typography>
      </td>
      <td className="px-5 py-3 align-middle">
        <NumberInput
          min={0}
          max={100}
          step={0.1}
          value={toNumberInputValue(draft.commissionPct)}
          onChange={(value) => onCommissionChange(rule.id, toStringValue(value))}
          className="h-8 w-20 text-sm"
        />
      </td>
      <td className="px-5 py-3 align-middle">
        <NumberInput
          min={0}
          max={100}
          step={0.1}
          value={toNumberInputValue(draft.paymentFeePct)}
          onChange={(value) => onPaymentFeeChange(rule.id, toStringValue(value))}
          className="h-8 w-20 text-sm"
        />
      </td>
      <td className="px-5 py-3 align-middle">
        <Typography variant="body-sm" className="text-muted-foreground">
          {rule.effectiveFrom}
        </Typography>
      </td>
      <td className="px-5 py-3 text-right align-middle">
        <Button
          type="button"
          variant="ghost"
          onClick={() => onSave(rule, draft)}
          className="text-primary"
        >
          Save
        </Button>
      </td>
    </tr>
  )
}
