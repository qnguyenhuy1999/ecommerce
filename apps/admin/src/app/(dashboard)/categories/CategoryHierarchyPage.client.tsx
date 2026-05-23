'use client'

import { CategoryHierarchy } from '@ecom/ui-admin'
import { useCategoryHierarchyAdapter } from '@/features/categories/hooks/use-category-hierarchy-adapter'
import { stripAdapterMeta } from '@/lib/adapter-utils'

export function CategoryHierarchyPageClient() {
  return <CategoryHierarchy {...stripAdapterMeta(useCategoryHierarchyAdapter())} />
}
