import { Badge } from '@ecom/core-ui/atoms/Badge'
import { Button } from '@ecom/core-ui/atoms/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@ecom/core-ui/molecules/Card'
import {
  dashboardActionClassName,
  dashboardCardClassName,
  warningBadgeClassName,
} from '../../Dashboard.constants'
import type { ModerationQueueItem } from '../../Dashboard.types'
import { EmptyState } from '../primitives/EmptyState'

interface ModerationQueueSectionProps {
  items: ModerationQueueItem[]
}

export function ModerationQueueSection({ items }: ModerationQueueSectionProps) {
  return (
    <section aria-labelledby="moderation-queue-heading">
      <Card className={dashboardCardClassName}>
        <CardHeader className="flex flex-row items-center justify-between border-b px-5 py-4 sm:px-6">
          <CardTitle id="moderation-queue-heading" className="text-xl">
            Moderation queue
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className={dashboardActionClassName}
            aria-label="View all moderation queue items"
          >
            View all
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {items.length === 0 ? (
            <EmptyState title="No moderation items" description="Everything has been reviewed." />
          ) : (
            <ul>
              {items.map((item) => (
                <li
                  key={item.id}
                  className="grid grid-cols-[minmax(0,1.2fr)_auto_auto] items-center gap-3 border-b px-5 py-4 last:border-b-0 sm:px-6"
                >
                  <div className="truncate font-medium">{item.sellerName}</div>
                  <div className="text-muted-foreground text-sm">{item.stateLabel}</div>
                  <div className="flex items-center gap-3 justify-self-end">
                    <Badge variant="secondary" className={warningBadgeClassName}>
                      {item.tagLabel}
                    </Badge>
                    <span className="text-muted-foreground text-sm">{item.dateLabel}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
