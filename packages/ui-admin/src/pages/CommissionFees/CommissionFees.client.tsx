'use client'

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Typography,
} from '@ecom/core-ui'
import { Plus } from 'lucide-react'
import { useCallback, useState } from 'react'
import { SellerListPage } from '../../organisms'
import { COMMISSION_SECTION_TITLES, SCOPE_LABELS, TODAY } from './CommissionFees.constants'
import { useCommissionFeesController } from './CommissionFees.controller'
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

interface AddRuleFormState {
  scope: CommissionRuleScope
  name: string
  commissionPct: string
  paymentFeePct: string
  effectiveFrom: string
}

function getInitialForm(): AddRuleFormState {
  return {
    scope: 'category',
    name: '',
    commissionPct: '',
    paymentFeePct: '',
    effectiveFrom: TODAY,
  }
}

function AddRuleFormFields({
  form,
  set,
  sampleOrderAmount,
  needsName,
}: {
  form: AddRuleFormState
  set: <K extends keyof AddRuleFormState>(key: K, value: AddRuleFormState[K]) => void
  sampleOrderAmount: number
  needsName: boolean
}) {
  const commission = parseFloat(form.commissionPct) || 0
  const paymentFee = parseFloat(form.paymentFeePct) || 0
  const sellerReceives = sampleOrderAmount * (1 - commission / 100 - paymentFee / 100)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="acr-scope">
            Scope <span className="text-destructive">*</span>
          </Label>
          <Select value={form.scope} onValueChange={(v) => set('scope', v as CommissionRuleScope)}>
            <SelectTrigger id="acr-scope" className="w-full">
              <SelectValue />
            </SelectTrigger>
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
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="acr-effective-from">
            Effective from <span className="text-destructive">*</span>
          </Label>
          <Input
            id="acr-effective-from"
            type="date"
            value={form.effectiveFrom}
            onChange={(e) => set('effectiveFrom', e.target.value)}
          />
        </div>
      </div>

      {needsName && (
        <div className="space-y-1.5">
          <Label htmlFor="acr-name">
            {SCOPE_LABELS[form.scope]} name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="acr-name"
            placeholder={form.scope === 'category' ? 'e.g. Home & Living' : 'e.g. Vendor name'}
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="acr-commission">
            Commission <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Input
              id="acr-commission"
              type="number"
              min={0}
              max={100}
              step={0.1}
              placeholder="0"
              value={form.commissionPct}
              onChange={(e) => set('commissionPct', e.target.value)}
              className="pr-8"
            />
            <span className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm">
              %
            </span>
          </div>
          <Typography variant="body" className="text-muted-foreground text-xs">
            Platform take rate
          </Typography>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="acr-payment-fee">
            Payment fee <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Input
              id="acr-payment-fee"
              type="number"
              min={0}
              max={100}
              step={0.1}
              placeholder="0"
              value={form.paymentFeePct}
              onChange={(e) => set('paymentFeePct', e.target.value)}
              className="pr-8"
            />
            <span className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm">
              %
            </span>
          </div>
          <Typography variant="body" className="text-muted-foreground text-xs">
            Gateway processing
          </Typography>
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg px-4 py-3 text-sm">
        On a{' '}
        <strong>
          $
          {sampleOrderAmount.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
        </strong>{' '}
        order, seller receives{' '}
        <span className="text-success font-semibold">${sellerReceives.toFixed(2)}</span>
      </div>
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
  const [form, setForm] = useState<AddRuleFormState>(getInitialForm)

  const set = useCallback(
    <K extends keyof AddRuleFormState>(key: K, value: AddRuleFormState[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }))
    },
    [],
  )

  const needsName = form.scope !== 'global'
  const isValid =
    form.effectiveFrom &&
    form.commissionPct !== '' &&
    form.paymentFeePct !== '' &&
    (!needsName || form.name.trim() !== '')

  function handleSubmit() {
    if (!isValid) return
    onSubmit({
      scope: form.scope,
      ...(needsName && { name: form.name.trim() }),
      commissionPct: parseFloat(form.commissionPct) || 0,
      paymentFeePct: parseFloat(form.paymentFeePct) || 0,
      effectiveFrom: form.effectiveFrom,
    })
    setForm(getInitialForm())
    onClose()
  }

  function handleOpenChange(next: boolean) {
    if (!next) {
      setForm(getInitialForm())
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

        <AddRuleFormFields
          form={form}
          set={set}
          sampleOrderAmount={sampleOrderAmount}
          needsName={needsName}
        />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" disabled={!isValid} onClick={handleSubmit}>
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
        <Input
          type="number"
          min={0}
          max={100}
          step={0.1}
          value={draft.commissionPct}
          onChange={(e) => onCommissionChange(rule.id, e.target.value)}
          className="h-8 w-20 text-sm"
        />
      </td>
      <td className="px-5 py-3 align-middle">
        <Input
          type="number"
          min={0}
          max={100}
          step={0.1}
          value={draft.paymentFeePct}
          onChange={(e) => onPaymentFeeChange(rule.id, e.target.value)}
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
