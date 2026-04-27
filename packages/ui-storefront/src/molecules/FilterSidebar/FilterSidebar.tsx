// Server shell — delegates all client-side state to FilterSidebarClient.
// 'use client' components (FilterGroup, FilterCollapse, etc.) are imported
// as client islands and embedded as children below.

import { FilterSidebarClient } from './FilterSidebarClient'

import { FilterGroup } from './FilterGroup'
import { FilterCollapse } from './FilterCollapse'
import { FilterCheckbox } from './FilterCheckbox'
import { FilterRange } from './FilterRange'
import { FilterClear } from './FilterClear'

type FilterSidebarComponent = typeof FilterSidebarClient & {
  Group: typeof FilterGroup
  Collapse: typeof FilterCollapse
  Checkbox: typeof FilterCheckbox
  Range: typeof FilterRange
  Clear: typeof FilterClear
}

const FilterSidebar = Object.assign(FilterSidebarClient, {
  Group: FilterGroup,
  Collapse: FilterCollapse,
  Checkbox: FilterCheckbox,
  Range: FilterRange,
  Clear: FilterClear,
}) as FilterSidebarComponent

export { FilterSidebar }

export type { FilterSidebarProps, FilterOption, FilterGroupSpec } from './FilterSidebarClient'
