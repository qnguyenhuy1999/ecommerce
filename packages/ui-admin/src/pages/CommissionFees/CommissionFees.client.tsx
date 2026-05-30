'use client'

import { formatCurrency } from '@ecom/shared/utils/format'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@ecom/core-ui/atoms/Form'
import { Button } from '@ecom/core-ui/atoms/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@ecom/core-ui/atoms/Dialog'
import { Input } from '@ecom/core-ui/atoms/Input'
import { NumberInput } from '@ecom/core-ui/atoms/NumberInput'
import { Typography } from '@ecom/core-ui/atoms/Typography'
import { DatePicker } from '@ecom/core-ui/molecules/DatePicker'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ecom/core-ui/molecules/Select'
import { type UseFormReturn, useForm } from '@ecom/core-ui/vendors/react-hook-form'
import { zodResolver } from '@ecom/core-ui/vendors/zod-resolver'
import { Plus } from 'lucide-react'
import { SellerListPage } from '../../organisms'
import { COMMISSION_SECTION_TITLES, SCOPE_LABELS, TODAY } from './CommissionFees.constants'
import { useCommissionFeesController } from './CommissionFees.controller'
import { addRuleSchema, type AddRuleSchemaValues } from './CommissionFees.schema'
import type {
  CommissionFeesProps,
  CommissionRule,
  CommissionRuleScope,
  NewCommissionRule,
} from './CommissionFees.types'

export interface DraftValues {
  commissionPct: string
  paymentFeePct: string
}

function getInitialFormValues(): AddRuleSchemaValues {
  return {
    scope: 'category',
    name: '',
    commissionPct: '',
    paymentFeePct: '',
    effectiveFrom: TODAY,
  }
}

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

function FeeFieldsGrid({
  form,
  sampleOrderAmount,
}: {
  form: UseFormReturn<AddRuleSchemaValues>
  sampleOrderAmount: number
}) {
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

function AddRuleFormFields({
  form,
  sampleOrderAmount,
  needsName,
}: {
  form: UseFormReturn<AddRuleSchemaValues>
  sampleOrderAmount: number
  needsName: boolean
}) {
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

function AddCommissionRuleModal({
  open,
  sampleOrderAmount,
  onClose,
  onSubmit,
}: {
  open: boolean
  sampleOrderAmount: number
  onClose: () => void
  onSubmit: (rule: NewCommissionRule) => void
}) {
  const form = useForm<AddRuleSchemaValues>({
    resolver: zodResolver(addRuleSchema),
    defaultValues: getInitialFormValues(),
    mode: 'onChange',
  })

  const scope = form.watch('scope')
  const needsName = scope !== 'global'

  function handleSubmit(values: AddRuleSchemaValues) {
    onSubmit({
      scope: values.scope,
      ...(needsName && { name: values.name.trim() }),
      commissionPct: parseFloat(values.commissionPct) || 0,
      paymentFeePct: parseFloat(values.paymentFeePct) || 0,
      effectiveFrom: values.effectiveFrom,
    })
    form.reset(getInitialFormValues())
    onClose()
  }

  function handleOpenChange(next: boolean) {
    if (!next) {
      form.reset(getInitialFormValues())
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add commission rule</DialogTitle>
          <DialogDescription>
            Create a new rate. More specific scopes (vendor &gt; category &gt; global) override
            broader ones.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <AddRuleFormFields
            form={form}
            sampleOrderAmount={sampleOrderAmount}
            needsName={needsName}
          />
        </Form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!form.formState.isValid}
            onClick={() => void form.handleSubmit(handleSubmit)()}
          >
            Add rule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function NetPayoutPreview({
  amount,
  commissionPct,
  paymentFeePct,
}: {
  amount: number
  commissionPct: number
  paymentFeePct: number
}) {
  const sellerReceives = amount * (1 - commissionPct / 100 - paymentFeePct / 100)

  return (
    <div className="bg-card border-border rounded-2xl border p-5">
      <Typography variant="label" className="text-foreground mb-3 block font-semibold">
        Net payout preview
      </Typography>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-foreground">
          Sample order: <strong>${amount.toFixed(0)}</strong>
        </span>
        <span className="text-muted-foreground">-</span>
        <span className="text-muted-foreground">Commission ({commissionPct}%)</span>
        <span className="text-muted-foreground">-</span>
        <span className="text-muted-foreground">Payment fee ({paymentFeePct}%)</span>
        <span className="border-success/30 bg-success/10 text-success rounded-full border px-3 py-0.5 font-medium">
          = Seller receives ${sellerReceives.toFixed(2)}
        </span>
      </div>
    </div>
  )
}

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

function RuleRow({
  rule,
  draft,
  onCommissionChange,
  onPaymentFeeChange,
  onSave,
}: {
  rule: CommissionRule
  draft: DraftValues
  onCommissionChange: (id: string, value: string) => void
  onPaymentFeeChange: (id: string, value: string) => void
  onSave: (rule: CommissionRule, draft: DraftValues) => void
}) {
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

function RuleSection({
  title,
  rules,
  drafts,
  onCommissionChange,
  onPaymentFeeChange,
  onSave,
}: {
  title: string
  rules: CommissionRule[]
  drafts: Map<string, DraftValues>
  onCommissionChange: (id: string, value: string) => void
  onPaymentFeeChange: (id: string, value: string) => void
  onSave: (rule: CommissionRule, draft: DraftValues) => void
}) {
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

export interface CommissionFeesClientProps {
  addRuleLabel: string
  sampleOrderAmount: number
  globalRate: CommissionRule
  categoryOverrides: CommissionRule[]
  vendorOverrides: CommissionRule[]
  onSave?: CommissionFeesProps['onSave']
  onAddRule?: CommissionFeesProps['onAddRule']
}

export function CommissionFeesClient({
  addRuleLabel,
  sampleOrderAmount,
  globalRate,
  categoryOverrides,
  vendorOverrides,
  onSave,
  onAddRule,
}: CommissionFeesClientProps) {
  const { state, computed, handlers } = useCommissionFeesController({
    globalRate,
    categoryOverrides,
    vendorOverrides,
    onSave,
    onAddRule,
  })

  return (
    <div className="space-y-5">
      <SellerListPage.Header>
        <div className="flex items-center justify-end">
          <SellerListPage.Actions>
            <Button type="button" onClick={() => handlers.setModalOpen(true)}>
              <Plus className="size-4" />
              {addRuleLabel}
            </Button>
          </SellerListPage.Actions>
        </div>
      </SellerListPage.Header>

      <NetPayoutPreview
        amount={sampleOrderAmount}
        commissionPct={computed.previewCommission}
        paymentFeePct={computed.previewPaymentFee}
      />

      <RuleSection
        title={COMMISSION_SECTION_TITLES.global}
        rules={[globalRate]}
        {...computed.sectionProps}
      />

      <RuleSection
        title={COMMISSION_SECTION_TITLES.category}
        rules={categoryOverrides}
        {...computed.sectionProps}
      />

      <RuleSection
        title={COMMISSION_SECTION_TITLES.vendor}
        rules={vendorOverrides}
        {...computed.sectionProps}
      />

      <AddCommissionRuleModal
        open={state.modalOpen}
        sampleOrderAmount={sampleOrderAmount}
        onClose={() => handlers.setModalOpen(false)}
        onSubmit={handlers.handleAddRule}
      />
    </div>
  )
}
