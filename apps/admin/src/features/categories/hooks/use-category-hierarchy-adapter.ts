'use client'

import type {
  CategoryHierarchyProps,
  CategoryHierarchySavePayload,
} from '@ecom/ui-admin/pages/CategoryHierarchy'
import { useCategories, useUpdateCategory } from '../hooks/use-categories'
import { mapCategoryNode } from '../mappers/category.mapper'

export function useCategoryHierarchyAdapter(): CategoryHierarchyProps & {
  loading: boolean
  error: Error | null
} {
  const categoriesQuery = useCategories()
  const update = useUpdateCategory()

  return {
    loading: categoriesQuery.isPending,
    error: categoriesQuery.error,
    categories: (categoriesQuery.data ?? []).map(mapCategoryNode),
    onSave: async (payload: CategoryHierarchySavePayload) => {
      const {
        id,
        name,
        slug,
        parentId,
        sortOrder,
        icon,
        featured,
        metaTitle,
        metaDescription,
        canonicalUrl,
      } = payload.category
      await update.mutateAsync({
        id,
        data: {
          name,
          slug,
          parentId,
          sortOrder,
          icon,
          featured,
          metaTitle,
          metaDescription,
          canonicalUrl,
        },
      })
    },
  }
}
