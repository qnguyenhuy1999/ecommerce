'use client'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@ecom/core-ui/atoms/Form'
import { Input } from '@ecom/core-ui/atoms/Input'
import { DatePicker } from '@ecom/core-ui/molecules/DatePicker'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ecom/core-ui/molecules/Select'
import type { UseFormReturn } from '@ecom/core-ui/vendors/react-hook-form'
import { SCOPE_LABELS } from '../CommissionFees.constants'
import type { AddRuleSchemaValues } from '../CommissionFees.schema'
import type { CommissionRuleScope } from '../CommissionFees.types'
import { FeeFieldsGrid } from './FeeFieldsGrid'

export interface AddRuleFormFieldsProps {
  form: UseFormReturn<AddRuleSchemaValues>
  sampleOrderAmount: number
  needsName: boolean
}

export function AddRuleFormFields({ form, sampleOrderAmount, needsName }: AddRuleFormFieldsProps) {
  const scopeValue = form.watch('scope')

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="scope"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Scope <span className="text-destructive">*</span>
              </FormLabel>
              <Select value={field.value} onValueChange={(v) => field.onChange(v)}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {(Object.entries(SCOPE_LABELS) as [CommissionRuleScope, string][]).map(
                    ([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="effectiveFrom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Effective from <span className="text-destructive">*</span>
              </FormLabel>
              <DatePicker value={field.value} onChange={field.onChange} />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {needsName && (
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {SCOPE_LABELS[scopeValue]} name <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={
                    scopeValue === 'category' ? 'e.g. Home & Living' : 'e.g. Vendor name'
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FeeFieldsGrid form={form} sampleOrderAmount={sampleOrderAmount} />
    </div>
  )
}
