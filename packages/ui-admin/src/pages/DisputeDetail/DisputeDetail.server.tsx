import { Card, CardContent, Typography } from '@ecom/core-ui'
import { getConversationCardClassName } from './DisputeDetail.constants'
import type {
  RefundConversationItem,
  RefundDetailProps,
  RefundEvidenceItem,
} from './DisputeDetail.types'

function ConversationCard({ item }: { item: RefundConversationItem }) {
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

function EvidenceCard({ item }: { item: RefundEvidenceItem }) {
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

export function OrderSummaryCard({ item }: { item: NonNullable<RefundDetailProps['item']> }) {
  return (
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
  )
}

export function ConversationEvidenceCard({
  item,
}: {
  item: NonNullable<RefundDetailProps['item']>
}) {
  return (
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
  )
}

export function AuditTrailCard({ item }: { item: NonNullable<RefundDetailProps['item']> }) {
  return (
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
  )
}
