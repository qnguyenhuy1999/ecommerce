import { Card, CardContent, CardHeader, CardTitle } from '@ecom/core-ui/molecules/Card'
import { StatCard } from '@ecom/core-ui/molecules/StatCard'
import { SECTION_CARD_CLASS_NAME } from '../CategoryHierarchy.constants'
import type { CategoryHierarchyCategory } from '../CategoryHierarchy.types'

interface CategoryStatsCardProps {
  statsTitle: string
  productsStatLabel: string
  liveVendorsStatLabel: string
  gmv30dStatLabel: string
  draft: CategoryHierarchyCategory
}

export function CategoryStatsCard({
  statsTitle,
  productsStatLabel,
  liveVendorsStatLabel,
  gmv30dStatLabel,
  draft,
}: CategoryStatsCardProps) {
  return (
    <Card className={SECTION_CARD_CLASS_NAME}>
      <CardHeader className="border-b px-4 pb-3 sm:px-5">
        <CardTitle className="text-base">{statsTitle}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 px-4 sm:grid-cols-3 sm:px-5">
        <StatCard label={productsStatLabel} value={draft.stats.products} className="rounded-2xl" />
        <StatCard
          label={liveVendorsStatLabel}
          value={draft.stats.liveVendors}
          className="rounded-2xl"
        />
        <StatCard label={gmv30dStatLabel} value={draft.stats.gmv30d} className="rounded-2xl" />
      </CardContent>
    </Card>
  )
}
