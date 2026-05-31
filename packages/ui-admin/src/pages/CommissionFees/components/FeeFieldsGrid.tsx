'use client'

import { formatCurrency } from '@ecom/shared/utils/format'
import { FormField, FormControl, FormItem, FormLabel, FormMessage } from '@ecom/core-ui/atoms/Form'
import { NumberInput } from '@ecom/core-ui/atoms/NumberInput'
import { Typography } from '@ecom/core-ui/atoms/Typography'
import type { UseFormReturn } from '@ecom/core-ui/vendors/react-hook-form'
import type { AddRuleSchemaValues } from '../CommissionFees.schema'

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

export interface FeeFieldsGridProps {
  form: UseFormReturn<AddRuleSchemaValues>
  sampleOrderAmount: number
}

export function FeeFieldsGrid({ form, sampleOrderAmount }: FeeFieldsGridProps) {
  const commissionPct = form.watch('commissionPct')
  const paymentFeePct = form.watch('paymentFeePct')
  const commission = parseFloat(commissionPct) || 0
  const paymentFee = parseFloat(paymentFeePct) || 0
  const sellerReceives = sampleOrderAmount * (1 - commission / 100 - paymentFee / 100)

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="commissionPct"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Commission <span className="text-destructive">*</span>
              </FormLabel>
              <div className="relative">
                <FormControl>
                  <NumberInput
                    min={0}
                    max={100}
                    step={0.1}
                    placeholder="0"
                    value={toNumberInputValue(field.value)}
                    onChange={(value) => field.onChange(toStringValue(value))}
                    className="pr-8"
                  />
                </FormControl>
                <span className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm">
                  %
                </span>
              </div>
              <Typography variant="body" className="text-muted-foreground text-xs">
                Platform take rate
              </Typography>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentFeePct"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Payment fee <span className="text-destructive">*</span>
              </FormLabel>
              <div className="relative">
                <FormControl>
                  <NumberInput
                    min={0}
                    max={100}
                    step={0.1}
                    placeholder="0"
                    value={toNumberInputValue(field.value)}
                    onChange={(value) => field.onChange(toStringValue(value))}
                    className="pr-8"
                  />
                </FormControl>
                <span className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm">
                  %
                </span>
              </div>
              <Typography variant="body" className="text-muted-foreground text-xs">
                Gateway processing
              </Typography>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="bg-muted/50 rounded-lg px-4 py-3 text-sm">
        On a{' '}
        <strong>
          {formatCurrency(sampleOrderAmount, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
        </strong>{' '}
        order, seller receives{' '}
        <span className="text-success font-semibold">{formatCurrency(sellerReceives)}</span>
      </div>
    </>
  )
}
