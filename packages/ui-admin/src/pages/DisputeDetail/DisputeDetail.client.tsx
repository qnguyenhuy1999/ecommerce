'use client'

import { Button } from '@ecom/core-ui/atoms/Button'
import { Label } from '@ecom/core-ui/atoms/Label'
import { RadioGroup, RadioGroupItem } from '@ecom/core-ui/atoms/RadioGroup'
import { Textarea } from '@ecom/core-ui/atoms/Textarea'
import { Typography } from '@ecom/core-ui/atoms/Typography'
import { Card, CardContent } from '@ecom/core-ui/molecules/Card'
import {
  REFUND_RESOLUTION_CHECKED_CLASS_NAME,
  REFUND_RESOLUTION_UNCHECKED_CLASS_NAME,
} from './DisputeDetail.constants'
import { useRefundDetailController } from './DisputeDetail.controller'
import type { RefundDetailProps, RefundResolutionOption } from './DisputeDetail.types'

function ResolutionOptionCard({
  option,
  checked,
}: {
  option: RefundResolutionOption
  checked: boolean
}) {
  return (
    <Label
      htmlFor={`resolution-${option.value}`}
      className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors ${
        checked ? REFUND_RESOLUTION_CHECKED_CLASS_NAME : REFUND_RESOLUTION_UNCHECKED_CLASS_NAME
      }`}
    >
      <RadioGroupItem id={`resolution-${option.value}`} value={option.value} className="mt-1" />
      <div className="space-y-1">
        <Typography variant="body-sm" className="font-semibold">
          {option.title}
        </Typography>
        <Typography variant="body-sm" className="text-muted-foreground">
          {option.description}
        </Typography>
      </div>
    </Label>
  )
}

export function ResolutionPanelClient({
  item,
  onApplyResolution,
}: Required<Pick<RefundDetailProps, 'item'>> & Pick<RefundDetailProps, 'onApplyResolution'>) {
  const controller = useRefundDetailController({ item, onApplyResolution })

  return (
    <Card className="rounded-3xl shadow-none">
      <CardContent className="space-y-5 p-5">
        <Typography variant="h4">Resolution</Typography>

        <RadioGroup
          value={controller.state.selectedResolution}
          onValueChange={controller.setSelectedResolution}
        >
          {item.resolutionOptions.map((option) => (
            <ResolutionOptionCard
              key={option.value}
              option={option}
              checked={controller.state.selectedResolution === option.value}
            />
          ))}
        </RadioGroup>

        <Textarea
          value={controller.state.internalNote}
          onChange={(event) => controller.setInternalNote(event.target.value)}
          placeholder={item.internalNotePlaceholder}
          className="min-h-28 rounded-2xl"
        />

        <Button
          type="button"
          className="w-full rounded-2xl"
          onClick={() => void controller.handleApplyResolution()}
        >
          {item.resolutionActionLabel}
        </Button>
      </CardContent>
    </Card>
  )
}
