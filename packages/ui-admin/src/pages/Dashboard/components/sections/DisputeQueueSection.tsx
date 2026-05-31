import { Badge } from '@ecom/core-ui/atoms/Badge'
import { Button } from '@ecom/core-ui/atoms/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@ecom/core-ui/molecules/Card'
import { Circle } from 'lucide-react'
import {
  dashboardActionClassName,
  dashboardCardClassName,
  getDisputeToneClassNames,
} from '../../Dashboard.constants'
import type { DisputeQueueItem } from '../../Dashboard.types'
import { EmptyState } from '../primitives/EmptyState'

interface DisputeQueueSectionProps {
  items: DisputeQueueItem[]
}

export function DisputeQueueSection({ items }: DisputeQueueSectionProps) {
  return (
    <section aria-labelledby="dispute-queue-heading">
      <Card className={dashboardCardClassName}>
        <CardHeader className="flex flex-row items-center justify-between border-b px-5 py-4 sm:px-6">
          <CardTitle id="dispute-queue-heading" className="text-xl">
            Dispute queue
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className={dashboardActionClassName}
            aria-label="View all dispute queue items"
          >
            View all
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {items.length === 0 ? (
            <EmptyState title="No disputes" description="There are no active dispute cases." />
          ) : (
            <ul>
              {items.map((item) => {
                const tone = getDisputeToneClassNames(item.tone)

                return (
                  <li
                    key={item.id}
                    className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-3 border-b px-5 py-4 last:border-b-0 sm:px-6"
                  >
                    <Circle className={`size-3 fill-current ${tone.dot}`} aria-hidden="true" />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold">{item.ticket}</span>
                        <span className="text-muted-foreground truncate">
                          {item.counterparties}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className={`rounded-full border ${tone.badge}`}>
                      {item.stateLabel}
                    </Badge>
                    <span className="text-primary text-right font-semibold">
                      {item.amountLabel}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
