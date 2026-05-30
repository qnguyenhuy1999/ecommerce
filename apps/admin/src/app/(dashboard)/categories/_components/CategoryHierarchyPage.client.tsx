'use client'

import { CategoryHierarchy } from '@ecom/ui-admin/pages/CategoryHierarchy'
import { useCategoryHierarchyAdapter } from '@/features/categories/hooks/use-category-hierarchy-adapter'
import { stripAdapterMeta } from '@ecom/shared/utils/adapter-utils'

export function CategoryHierarchyPageClient() {
  return <CategoryHierarchy {...stripAdapterMeta(useCategoryHierarchyAdapter())} />
}
