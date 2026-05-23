import type { DataTableProps } from '../DataTable/DataTable.types'
import type { ConsolePageLayoutProps } from '../../layouts/ConsolePageLayout'

export type ConsoleListPageRootProps = ConsolePageLayoutProps

export interface ConsoleListPageFiltersProps {
  children: React.ReactNode
  className?: string
}

export interface ConsoleListPageSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export interface ConsoleListPageStatusTabsProps {
  tabs: string[]
  value: string
  onChange: (tab: string) => void
  counts?: Record<string, number>
  labels?: Record<string, string>
  className?: string
}

export type ConsoleListPageTableProps<T extends { id: string }> = DataTableProps<T>

export interface ConsoleListPageActionsProps {
  children: React.ReactNode
  className?: string
}

export interface ConsoleListPageHeaderProps {
  children: React.ReactNode
  className?: string
}
