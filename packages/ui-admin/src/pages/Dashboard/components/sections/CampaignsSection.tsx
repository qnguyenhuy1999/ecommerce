import { Badge } from '@ecom/core-ui/atoms/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '@ecom/core-ui/molecules/Card'
import { Megaphone } from 'lucide-react'
import { dashboardCardClassName, getCampaignToneClassName } from '../../Dashboard.constants'
import type { CampaignItem } from '../../Dashboard.types'
import { EmptyState } from '../primitives/EmptyState'

interface CampaignsSectionProps {
  items: CampaignItem[]
}

export function CampaignsSection({ items }: CampaignsSectionProps) {
  return (
    <section aria-labelledby="campaigns-heading">
      <Card className={dashboardCardClassName}>
        <CardHeader className="border-b px-5 py-4 sm:px-6">
          <CardTitle id="campaigns-heading" className="text-xl">
            Active campaigns
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 py-5 sm:px-6">
          {items.length === 0 ? (
            <EmptyState
              title="No active campaigns"
              description="No campaigns are live or scheduled."
            />
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-4">
                  <div className="bg-primary text-primary-foreground flex size-11 shrink-0 items-center justify-center rounded-2xl">
                    <Megaphone className="size-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-muted-foreground text-sm">{item.detail}</div>
                  </div>
                  <Badge variant="secondary" className={getCampaignToneClassName(item.tone)}>
                    {item.statusLabel}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
