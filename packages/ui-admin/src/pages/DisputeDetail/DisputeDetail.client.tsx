'use client'

import {
  Button,
  Card,
  CardContent,
  RadioGroup,
  RadioGroupItem,
  Textarea,
  Typography,
} from '@ecom/core-ui'
import { useState } from 'react'
import type {
  DisputeConversationItem,
  DisputeDetailProps,
  DisputeEvidenceItem,
  DisputeParticipantRole,
  DisputeResolutionOption,
} from './DisputeDetail.types'

function getConversationCardClassName(role: DisputeParticipantRole) {
  switch (role) {
    case 'BUYER':
      return 'border-sky-200 bg-sky-50'
    case 'SELLER':
      return 'border-amber-200 bg-amber-50'
    case 'ADMIN':
      return 'border-orange-200 bg-orange-50'
    default:
      return 'border-border bg-card'
  }
}

function ConversationCard({ item }: { item: DisputeConversationItem }) {
  return (
    <div className={`rounded-2xl border p-4 ${getConversationCardClassName(item.role)}`}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <Typography variant="caption" className="font-semibold tracking-[0.18em] uppercase">
          {item.role}
        </Typography>
        <Typography variant="caption" className="text-muted-foreground">
          {item.dateLabel}
        </Typography>
      </div>
      <Typography variant="body-sm" className="text-base leading-6">
        {item.message}
      </Typography>
    </div>
  )
}

function EvidenceCard({ item }: { item: DisputeEvidenceItem }) {
  return (
    <div className="border-border bg-muted/40 relative size-28 overflow-hidden rounded-2xl border">
      <img src={item.imageSrc} alt={item.imageAlt} className="size-full object-cover" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/70 to-transparent p-3">
        <Typography variant="caption" className="rounded-lg bg-black/40 px-2 py-1 text-white">
          {item.label}
        </Typography>
        <Typography variant="caption" className="line-clamp-2 text-right text-white/85">
          {item.caption}
        </Typography>
      </div>
    </div>
  )
}

function ResolutionOptionCard({
  option,
  checked,
}: {
  option: DisputeResolutionOption
  checked: boolean
}) {
  return (
    <label
      htmlFor={`resolution-${option.value}`}
      className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors ${
        checked ? 'border-orange-400 bg-orange-50' : 'border-border bg-card'
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
    </label>
  )
}

function SummaryRow({
  label,
  value,
  emphasize = false,
}: {
  label: string
  value: string
  emphasize?: boolean
}) {
  return (
    <div className="border-border flex items-center justify-between gap-4 border-b border-dashed py-3 last:border-b-0">
      <Typography variant="caption" className="text-muted-foreground tracking-[0.18em] uppercase">
        {label}
      </Typography>
      <Typography
        variant="body-sm"
        className={emphasize ? 'text-warning text-right font-semibold' : 'text-right'}
      >
        {value}
      </Typography>
    </div>
  )
}

export function DisputeDetailClient({
  item,
  onApplyResolution,
}: Required<Pick<DisputeDetailProps, 'item'>> & Pick<DisputeDetailProps, 'onApplyResolution'>) {
  const [selectedResolution, setSelectedResolution] = useState(item.selectedResolution)
  const [internalNote, setInternalNote] = useState('')

  async function handleApplyResolution() {
    await onApplyResolution?.({
      item,
      resolution: selectedResolution,
      note: internalNote,
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_32rem]">
        <Card className="rounded-3xl shadow-none">
          <CardContent className="space-y-5 px-5">
            <div className="space-y-1">
              <Typography variant="h4">Order</Typography>
              <Typography variant="body-sm" className="text-muted-foreground">
                {item.orderId}
              </Typography>
            </div>

            <div>
              <SummaryRow label="Buyer" value={item.buyerName} />
              <SummaryRow label="Seller" value={item.sellerName} />
              <SummaryRow label="Shop" value={item.shopName} />
              <SummaryRow label="Total" value={item.amountLabel} emphasize />
              <SummaryRow label="Placed" value={item.placedAtLabel} />
              <SummaryRow label="Status" value={item.orderStatusLabel} />
            </div>

            <div className="border-border flex items-center gap-4 border-t pt-5">
              <img
                src={item.itemImageSrc}
                alt={item.itemImageAlt}
                className="size-12 shrink-0 rounded-2xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <Typography variant="body-sm" className="truncate font-medium">
                  {item.itemTitle}
                </Typography>
              </div>
              <Typography variant="body-sm" className="text-muted-foreground">
                {item.itemQuantityLabel}
              </Typography>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl shadow-none">
          <CardContent className="space-y-5 p-5">
            <div className="space-y-1">
              <Typography variant="h4">Conversation & evidence</Typography>
              <Typography variant="body-sm" className="text-muted-foreground">
                {item.reason}
              </Typography>
            </div>

            <div className="space-y-3">
              {item.conversation.map((entry) => (
                <ConversationCard key={entry.id} item={entry} />
              ))}
            </div>

            <div className="space-y-3">
              <Typography variant="body-sm" className="font-semibold">
                Evidence ({item.evidence.length})
              </Typography>
              <div className="flex flex-wrap gap-3">
                {item.evidence.map((entry) => (
                  <EvidenceCard key={entry.id} item={entry} />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl shadow-none">
          <CardContent className="space-y-5 p-5">
            <Typography variant="h4">Resolution</Typography>

            <RadioGroup value={selectedResolution} onValueChange={setSelectedResolution}>
              {item.resolutionOptions.map((option) => (
                <ResolutionOptionCard
                  key={option.value}
                  option={option}
                  checked={selectedResolution === option.value}
                />
              ))}
            </RadioGroup>

            <Textarea
              value={internalNote}
              onChange={(event) => setInternalNote(event.target.value)}
              placeholder={item.internalNotePlaceholder}
              className="min-h-28 rounded-2xl"
            />

            <Button
              type="button"
              className="w-full rounded-2xl"
              onClick={() => void handleApplyResolution()}
            >
              {item.resolutionActionLabel}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-3xl shadow-none">
        <CardContent className="space-y-4 p-5">
          <Typography variant="h4">Audit trail</Typography>
          <div className="space-y-3">
            {item.auditTrail.map((entry) => (
              <div
                key={entry.id}
                className="border-border flex items-center justify-between gap-4 border-b border-dashed pb-3 last:border-b-0 last:pb-0"
              >
                <Typography variant="body-sm">
                  <span className="font-semibold">{entry.actor}</span> {entry.action}
                </Typography>
                <Typography variant="body-sm" className="text-muted-foreground shrink-0">
                  {entry.dateLabel}
                </Typography>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
