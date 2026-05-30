'use client'

import { Badge } from '@ecom/core-ui/atoms/Badge'
import { Button } from '@ecom/core-ui/atoms/Button'
import type { DataTableColumn } from '@ecom/core-ui/organisms/DataTable'
import { Download } from 'lucide-react'
import { useMemo } from 'react'
import { SellerListPage } from '../../organisms/SellerListPage'
import { SectionCard } from '../../atoms/SectionCard'
import { cn } from '@ecom/shared/utils/cn'
import { useFinanceController } from './Finance.controller'
import {
  formatSignedFinanceAmount,
  getFinanceAmountTone,
  getFinanceKindBadgeClass,
  getFinanceKindLabel,
  getFinanceTabLabel,
} from './Finance.utils'
import type { FinanceLedgerEntry, FinanceProps, FinanceTab } from './Finance.types'

function buildFinanceColumns(): DataTableColumn<FinanceLedgerEntry>[] {
  return [
    {
      accessorKey: 'dateLabel',
      header: 'Date',
      cell: ({ row }) => <span className="text-foreground text-sm">{row.original.dateLabel}</span>,
    },
    {
      accessorKey: 'kind',
      header: 'Type',
      cell: ({ row }) => (
        <Badge
          variant="secondary"
          size="sm"
          className={cn(
            'border-0 font-normal capitalize',
            getFinanceKindBadgeClass(row.original.kind),
          )}
        >
          {getFinanceKindLabel(row.original.kind)}
        </Badge>
      ),
    },
    {
      accessorKey: 'reference',
      header: 'Reference',
      cell: ({ row }) => (
        <span className="text-foreground text-sm font-medium">{row.original.reference}</span>
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => (
        <div className="text-right">
          <span className={cn('text-sm font-semibold', getFinanceAmountTone(row.original.amount))}>
            {formatSignedFinanceAmount(row.original.amount)}
          </span>
        </div>
      ),
    },
  ]
}

export type LedgerSectionClientProps = Required<
  Pick<FinanceProps, 'statementHref' | 'tabs' | 'defaultTab' | 'entries' | 'emptyMessage'>
> &
  Pick<FinanceProps, 'tab' | 'onTabChange'>

export function LedgerSectionClient({
  statementHref,
  tabs,
  tab,
  defaultTab,
  onTabChange,
  entries,
  emptyMessage,
}: LedgerSectionClientProps) {
  const controllerProps = {
    entries,
    defaultTab,
    ...(tab !== undefined ? { tab } : {}),
    ...(onTabChange ? { onTabChange } : {}),
  }
  const { currentTab, setCurrentTab, visibleEntries } = useFinanceController({
    ...controllerProps,
  })
  const columns = useMemo(() => buildFinanceColumns(), [])

  return (
    <SectionCard
      className="rounded-[28px] p-0"
      padded={false}
      action={
        <Button asChild variant="outline" className="rounded-2xl">
          <a href={statementHref}>
            <Download className="size-4" />
            Statement
          </a>
        </Button>
      }
    >
      <div className="border-border flex flex-wrap gap-2 border-b px-3 py-2.5">
        {tabs.map((item: FinanceTab) => {
          const isActive = item === currentTab

          return (
            <button
              key={item}
              type="button"
              onClick={() => setCurrentTab(item)}
              className={cn(
                'inline-flex h-10 items-center rounded-2xl px-4 text-sm font-medium transition-colors',
                isActive ? 'bg-primary-soft text-primary-deep' : 'text-foreground hover:bg-muted',
              )}
            >
              {getFinanceTabLabel(item)}
            </button>
          )
        })}
      </div>

      <SellerListPage.Table columns={columns} data={visibleEntries} emptyMessage={emptyMessage} />
    </SectionCard>
  )
}
