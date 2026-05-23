import { useControllableState } from '../../hooks'
import { filterFinanceEntriesByTab } from './Finance.utils'
import type { FinanceLedgerEntry, FinanceTab } from './Finance.types'

interface UseFinanceControllerProps {
  entries: FinanceLedgerEntry[]
  tab?: FinanceTab
  defaultTab: FinanceTab
  onTabChange?: (tab: FinanceTab) => void
}

export function useFinanceController({
  entries,
  tab,
  defaultTab,
  onTabChange,
}: UseFinanceControllerProps) {
  const [currentTab, setCurrentTab] = useControllableState<FinanceTab>({
    defaultValue: defaultTab,
    ...(tab !== undefined ? { value: tab } : {}),
    ...(onTabChange !== undefined ? { onChange: onTabChange } : {}),
  })

  const visibleEntries = filterFinanceEntriesByTab(entries, currentTab)

  return {
    currentTab,
    setCurrentTab,
    visibleEntries,
  }
}
