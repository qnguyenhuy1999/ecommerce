'use client'

import { Button } from '@ecom/core-ui/atoms/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@ecom/core-ui/atoms/Dialog'
import { Form } from '@ecom/core-ui/atoms/Form'
import { useForm } from '@ecom/core-ui/vendors/react-hook-form'
import { zodResolver } from '@ecom/core-ui/vendors/zod-resolver'
import { TODAY } from '../CommissionFees.constants'
import { addRuleSchema, type AddRuleSchemaValues } from '../CommissionFees.schema'
import type { NewCommissionRule } from '../CommissionFees.types'
import { AddRuleFormFields } from './AddRuleFormFields'

function getInitialFormValues(): AddRuleSchemaValues {
  return {
    scope: 'category',
    name: '',
    commissionPct: '',
    paymentFeePct: '',
    effectiveFrom: TODAY,
  }
}

export interface AddCommissionRuleModalProps {
  open: boolean
  sampleOrderAmount: number
  onClose: () => void
  onSubmit: (rule: NewCommissionRule) => void
}

export function AddCommissionRuleModal({
  open,
  sampleOrderAmount,
  onClose,
  onSubmit,
}: AddCommissionRuleModalProps) {
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
