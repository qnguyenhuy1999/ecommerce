// Server shell — delegates all client-side state to FilterSidebarClient.
// 'use client' components (FilterGroup, FilterCollapse, etc.) are imported
// as client islands and embedded as children below.

import { FilterSidebarClient } from './FilterSidebarClient'

export { FilterSidebarClient as FilterSidebar }

export type { FilterSidebarProps, FilterOption, FilterGroupSpec } from './FilterSidebarClient'

export { FilterGroup } from './FilterGroup'
export { FilterCollapse } from './FilterCollapse'
export { FilterCheckbox } from './FilterCheckbox'
export { FilterRange } from './FilterRange'
export { FilterClear } from './FilterClear'