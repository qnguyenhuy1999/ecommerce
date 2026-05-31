import { cn } from '@ecom/shared/utils/cn'
import { ConsolePageLayout } from '../../layouts/ConsolePageLayout'
import { DataTable } from '../DataTable'
import { SearchField, StatusTabs } from './ConsoleListPage.client'
import type {
  ConsoleListPageActionsProps,
  ConsoleListPageFiltersProps,
  ConsoleListPageHeaderProps,
  ConsoleListPageRootProps,
  ConsoleListPageTableProps,
} from './ConsoleListPage.types'
export type {
  ConsoleListPageActionsProps,
  ConsoleListPageFiltersProps,
  ConsoleListPageHeaderProps,
  ConsoleListPageRootProps,
  ConsoleListPageSearchProps,
  ConsoleListPageStatusTabsProps,
  ConsoleListPageTableProps,
} from './ConsoleListPage.types'

function Root({ children, ...props }: ConsoleListPageRootProps) {
  return <ConsolePageLayout {...props}>{children}</ConsolePageLayout>
}

function Header({ children, className }: ConsoleListPageHeaderProps) {
  return <div className={cn('space-y-4', className)}>{children}</div>
}

function Actions({ children, className }: ConsoleListPageActionsProps) {
  return <div className={cn('flex flex-wrap items-center gap-3', className)}>{children}</div>
}

function Filters({ children, className }: ConsoleListPageFiltersProps) {
  return (
    <div className={cn('flex flex-col gap-3 lg:flex-row lg:items-center', className)}>
      {children}
    </div>
  )
}

function Table<T extends { id: string }>(props: ConsoleListPageTableProps<T>) {
  return <DataTable {...props} />
}

type ConsoleListPageComponent = typeof Root & {
  Header: typeof Header
  Actions: typeof Actions
  Filters: typeof Filters
  Search: typeof SearchField
  StatusTabs: typeof StatusTabs
  Table: typeof Table
}

export const ConsoleListPage: ConsoleListPageComponent = Object.assign(Root, {
  Header,
  Actions,
  Filters,
  Search: SearchField,
  StatusTabs,
  Table,
})
