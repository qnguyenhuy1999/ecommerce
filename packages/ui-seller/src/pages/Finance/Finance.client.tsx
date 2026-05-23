'use client'

import { Badge, Button } from '@ecom/core-ui'
import { Download } from 'lucide-react'
import { SectionCard } from '../../atoms/SectionCard'
import { cn } from '@ecom/shared/utils'
import { useFinanceController } from './Finance.controller'
import {
  formatSignedFinanceAmount,
  getFinanceAmountTone,
  getFinanceKindBadgeClass,
  getFinanceKindLabel,
  getFinanceTabLabel,
} from './Finance.utils'
import { FINANCE_TABLE_HEADERS } from './Finance.constants'
import type { FinanceLedgerEntry, FinanceProps, FinanceTab } from './Finance.types'

interface FinanceEntriesTableProps {
  entries: FinanceLedgerEntry[]
  emptyMessage: string
}

// eslint-disable-next-line sonarjs/todo-tag
// TODO: This component can use Table from core-ui
function FinanceEntriesTable({ entries, emptyMessage }: FinanceEntriesTableProps) {
  return (
    <div className="relative w-full overflow-x-auto">
      <table className="w-full caption-bottom text-sm">
        <thead className="bg-muted/50 [&_tr]:border-b">
          <tr className="border-secondary border-b transition-colors hover:bg-transparent">
            {FINANCE_TABLE_HEADERS.map((header, index) => (
              <th
                key={header}
                className={cn(
                  'text-foreground px-4 py-3 text-xs font-semibold tracking-wide uppercase',
                  index === FINANCE_TABLE_HEADERS.length - 1 ? 'text-right' : 'text-left',
                )}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {entries.length > 0 ? (
            entries.map((entry) => (
              <tr
                key={entry.id}
                className="border-secondary hover:bg-muted/50 border-b transition-colors"
              >
                <td className="px-4 py-3 text-sm whitespace-nowrap">{entry.dateLabel}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <Badge
                    variant="secondary"
                    size="sm"
                    className={cn(
                      'border-0 font-normal capitalize',
                      getFinanceKindBadgeClass(entry.kind),
                    )}
                  >
                    {getFinanceKindLabel(entry.kind)}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm font-medium whitespace-nowrap">
                  {entry.reference}
                </td>
                <td
                  className={cn(
                    'px-4 py-3 text-right text-sm font-semibold whitespace-nowrap',
                    getFinanceAmountTone(entry.amount),
                  )}
                >
                  {formatSignedFinanceAmount(entry.amount)}
                </td>
              </tr>
            ))
          ) : (
            <tr className="border-secondary border-b">
              <td colSpan={4} className="text-muted-foreground px-4 py-8 text-center text-sm">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
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
  const { currentTab, setCurrentTab, visibleEntries } = useFinanceController({
    entries,
    tab,
    defaultTab,
    onTabChange,
  })

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

      <FinanceEntriesTable entries={visibleEntries} emptyMessage={emptyMessage} />
    </SectionCard>
  )
}
