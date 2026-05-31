import { Badge } from '@ecom/core-ui/atoms/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '@ecom/core-ui/molecules/Card'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { dashboardCardClassName, warningBadgeClassName } from '../../Dashboard.constants'
import type { PendingApprovalItem } from '../../Dashboard.types'
import { EmptyState } from '../primitives/EmptyState'

interface PendingApprovalsSectionProps {
  items: PendingApprovalItem[]
}

export function PendingApprovalsSection({ items }: PendingApprovalsSectionProps) {
  return (
    <section aria-labelledby="pending-approvals-heading">
      <Card className={dashboardCardClassName}>
        <CardHeader className="border-b px-5 py-4 sm:px-6">
          <CardTitle id="pending-approvals-heading" className="text-xl">
            Pending approvals
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {items.length === 0 ? (
            <EmptyState title="No pending approvals" description="All approval queues are clear." />
          ) : (
            <ul>
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 border-b px-5 py-4 last:border-b-0 sm:px-6"
                >
                  <div className="bg-warning/12 text-warning flex size-11 shrink-0 items-center justify-center rounded-2xl">
                    <ShieldCheck className="size-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium">{item.label}</div>
                  </div>
                  <Badge variant="secondary" className={warningBadgeClassName}>
                    {item.countLabel}
                  </Badge>
                  <ArrowRight
                    className="text-muted-foreground size-4 shrink-0"
                    aria-hidden="true"
                  />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
