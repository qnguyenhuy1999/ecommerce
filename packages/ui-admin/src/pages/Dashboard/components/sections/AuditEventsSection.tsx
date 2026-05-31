import { Typography } from '@ecom/core-ui/atoms/Typography'
import { Card, CardContent, CardHeader, CardTitle } from '@ecom/core-ui/molecules/Card'
import { dashboardCardClassName } from '../../Dashboard.constants'
import type { AuditEventItem } from '../../Dashboard.types'
import { EmptyState } from '../primitives/EmptyState'

interface AuditEventsSectionProps {
  items: AuditEventItem[]
}

export function AuditEventsSection({ items }: AuditEventsSectionProps) {
  return (
    <section aria-labelledby="audit-events-heading">
      <Card className={dashboardCardClassName}>
        <CardHeader className="border-b px-5 py-4 sm:px-6">
          <div className="space-y-1">
            <CardTitle id="audit-events-heading" className="text-xl">
              Recent audit events
            </CardTitle>
            <Typography variant="body-sm" className="text-muted-foreground">
              Live, last 24h
            </Typography>
          </div>
        </CardHeader>
        <CardContent className="px-5 py-5 sm:px-6">
          {items.length === 0 ? (
            <EmptyState title="No audit events" description="There are no recent audit entries." />
          ) : (
            <ol className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-3">
                  <div className="pt-1" aria-hidden="true">
                    <div className="border-warning/25 flex size-4 items-center justify-center rounded-full border">
                      <div className="bg-primary size-2 rounded-full" />
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-sm">
                      <span className="font-semibold">{item.actor}</span>
                      <span className="text-muted-foreground"> {item.action} </span>
                      <span className="font-semibold">{item.subject}</span>
                    </div>
                    {item.detail !== undefined ? (
                      <div className="text-muted-foreground text-sm">{item.detail}</div>
                    ) : null}
                  </div>
                  <time className="text-muted-foreground text-sm">{item.dateLabel}</time>
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
