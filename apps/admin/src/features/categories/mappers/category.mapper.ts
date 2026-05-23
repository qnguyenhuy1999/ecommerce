import type { CategoryHierarchyCategory, CategoryHierarchyStats } from '@ecom/ui-admin'
import type { CategoryNode } from '../api/categories.api'

export function mapCategoryNode(node: CategoryNode): CategoryHierarchyCategory {
  const stats: CategoryHierarchyStats = {
    products: String(node._count.products),
    liveVendors: '—',
    gmv30d: '—',
  }

  return {
    id: node.id,
    name: node.name,
    slug: node.slug,
    parentId: node.parentId,
    sortOrder: node.sortOrder,
    icon: node.icon ?? '📁',
    featured: false,
    metaTitle: node.name,
    metaDescription: node.description ?? '',
    canonicalUrl: '',
    stats,
    children: node.children.map(mapCategoryNode),
  } satisfies CategoryHierarchyCategory
}
