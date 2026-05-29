'use client'

import { formatNumber } from '@ecom/shared'
import { Badge, Button, Checkbox, Progress, Typography } from '@ecom/core-ui'
import { cn } from '@ecom/shared/utils'
import { SectionCard } from '../../atoms/SectionCard'
import { promotionsDefaultProps } from './Promotions.fixtures'
import { usePromotionsController } from './Promotions.controller'
import {
  PromotionStatusBadge,
  formatPromotionCount,
  formatPromotionDateRange,
  getPromotionKindLabel,
  getPromotionProgressValue,
  getPromotionStatusLabel,
  promotionStatusOrder,
} from './Promotions.utils'
import type { PromotionRow, PromotionsProps } from './Promotions.types'

interface PromotionCardProps {
  promotion: PromotionRow
  onEdit: () => void
  onDuplicate: () => void
  onActiveChange: (active: boolean) => void
}

function PromotionCard({ promotion, onEdit, onDuplicate, onActiveChange }: PromotionCardProps) {
  const progressValue = getPromotionProgressValue(promotion)

  return (
    <article className="bg-card border-border rounded-3xl border p-4 shadow-xs">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Typography variant="h4" as="h3" className="text-foreground truncate text-lg">
            {promotion.name}
          </Typography>
          <Typography variant="muted" className="mt-1">
            {formatPromotionDateRange(promotion)}
          </Typography>
        </div>
        <PromotionStatusBadge status={promotion.status} />
      </div>

      <div className="text-muted-foreground mt-4 flex flex-wrap items-center gap-2 text-sm">
        <Badge variant="secondary" className="bg-muted text-muted-foreground rounded-full">
          {getPromotionKindLabel(promotion.kind)}
        </Badge>
        <span>{promotion.offerLabel}</span>
        <span>-</span>
        <span>{promotion.productCount} products</span>
      </div>

      <div className="mt-5">
        <div className="text-muted-foreground mb-2 flex items-center justify-between gap-3 text-sm">
          <span className="text-foreground font-medium tabular-nums">
            {formatNumber(promotion.progressCurrent)} / {formatNumber(promotion.progressTarget)}
          </span>
          <span className="tabular-nums">{progressValue}%</span>
        </div>
        <Progress value={progressValue} />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onEdit}>
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={onDuplicate}>
            Duplicate
          </Button>
        </div>
        <label
          className={cn(
            'text-foreground inline-flex items-center gap-2 text-sm font-medium',
            !promotion.active && 'font-normal',
          )}
        >
          <Checkbox
            checked={promotion.active}
            onCheckedChange={(value) => onActiveChange(value === true)}
            aria-label={`Toggle ${promotion.name}`}
          />
          Active
        </label>
      </div>
    </article>
  )
}

export interface PromotionsClientProps {
  promotions: PromotionRow[]
  onEdit?: PromotionsProps['onEdit']
  onDuplicate?: PromotionsProps['onDuplicate']
  onActiveChange?: PromotionsProps['onActiveChange']
}

export function PromotionsClient({
  promotions,
  onEdit = promotionsDefaultProps.onEdit,
  onDuplicate = promotionsDefaultProps.onDuplicate,
  onActiveChange = promotionsDefaultProps.onActiveChange,
}: PromotionsClientProps) {
  const { statusCounts, promotionsByStatus, handleActiveChange } = usePromotionsController({
    promotions,
    onActiveChange,
  })

  return (
    <div className="space-y-5">
      {promotionStatusOrder.map((status) => {
        const sectionPromotions = promotionsByStatus[status]

        if (sectionPromotions.length === 0) {
          return null
        }

        return (
          <SectionCard
            key={status}
            title={getPromotionStatusLabel(status)}
            subtitle={formatPromotionCount(statusCounts[status])}
            className="rounded-[24px]"
            padded={false}
          >
            <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
              {sectionPromotions.map((promotion) => (
                <PromotionCard
                  key={promotion.id}
                  promotion={promotion}
                  onEdit={() => onEdit?.(promotion)}
                  onDuplicate={() => onDuplicate?.(promotion)}
                  onActiveChange={(active) => handleActiveChange(promotion.id, active)}
                />
              ))}
            </div>
          </SectionCard>
        )
      })}
    </div>
  )
}
