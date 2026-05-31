import { Typography } from '@ecom/core-ui/atoms/Typography'
import { Card, CardContent, CardHeader, CardTitle } from '@ecom/core-ui/molecules/Card'
import { Circle } from 'lucide-react'
import { dashboardCardClassName } from '../../Dashboard.constants'
import type { SystemHealthItem } from '../../Dashboard.types'
import { EmptyState } from '../primitives/EmptyState'

interface SystemHealthSectionProps {
  items: SystemHealthItem[]
}

interface SystemHealthStatusProps {
  status: SystemHealthItem['status']
}

function SystemHealthStatus({ status }: SystemHealthStatusProps) {
  return (
    <span className={status === 'Operational' ? 'text-muted-foreground' : 'text-warning'}>
      {status}
    </span>
  )
}

export function SystemHealthSection({ items }: SystemHealthSectionProps) {
  return (
    <section aria-labelledby="system-health-heading">
      <Card className={dashboardCardClassName}>
        <CardHeader className="border-b px-5 py-4 sm:px-6">
          <div className="space-y-1">
            <CardTitle id="system-health-heading" className="text-xl">
              System health
            </CardTitle>
            <Typography variant="body-sm" className="text-muted-foreground">
              Live status
            </Typography>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {items.length === 0 ? (
            <EmptyState title="No system checks" description="System health data is unavailable." />
          ) : (
            <ul>
              {items.map((item) => (
                <li
                  key={item.id}
                  className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 border-b px-5 py-4 text-sm last:border-b-0 sm:px-6"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Circle
                      className={
                        item.status === 'Operational'
                          ? 'text-success size-3 fill-current'
                          : 'text-warning size-3 fill-current'
                      }
                      aria-hidden="true"
                    />
                    <span className="truncate font-medium">{item.label}</span>
                    <SystemHealthStatus status={item.status} />
                  </div>
                  <span className="text-muted-foreground">{item.uptimeLabel}</span>
                  <span className="text-muted-foreground text-right">{item.latencyLabel}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
