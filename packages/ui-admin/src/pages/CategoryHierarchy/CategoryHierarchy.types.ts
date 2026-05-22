export interface CategoryHierarchyStats {
  products: string
  liveVendors: string
  gmv30d: string
}

export interface CategoryHierarchyCategory {
  id: string
  name: string
  slug: string
  parentId?: string | null
  sortOrder: number
  icon: string
  featured: boolean
  metaTitle: string
  metaDescription: string
  canonicalUrl: string
  stats: CategoryHierarchyStats
  children: CategoryHierarchyCategory[]
}

export interface CategoryHierarchySavePayload {
  category: CategoryHierarchyCategory
}

export interface CategoryHierarchyProps {
  title?: string
  description?: string
  treeTitle?: string
  detailsTitle?: string
  seoTitle?: string
  statsTitle?: string
  searchPlaceholder?: string
  newCategoryLabel?: string
  saveLabel?: string
  saveLoadingLabel?: string
  cancelLabel?: string
  deleteLabel?: string
  deleteLoadingLabel?: string
  displayNameLabel?: string
  slugLabel?: string
  parentLabel?: string
  sortOrderLabel?: string
  iconLabel?: string
  featuredLabel?: string
  showOnHomeLabel?: string
  metaTitleLabel?: string
  metaDescriptionLabel?: string
  canonicalUrlLabel?: string
  rootParentLabel?: string
  productsStatLabel?: string
  liveVendorsStatLabel?: string
  gmv30dStatLabel?: string
  emptyStateMessage?: string
  emptyTreeMessage?: string
  noSearchResultsMessage?: string
  newCategoryName?: string
  newCategorySlug?: string
  newCategoryMetaDescription?: string
  defaultMetaTitleSuffix?: string
  unsavedChangesMessage?: string
  cancelChangesMessage?: string
  deleteCategoryMessage?: string
  deleteCategoryWithChildrenMessage?: string
  nameRequiredMessage?: string
  slugRequiredMessage?: string
  canonicalUrlRequiredMessage?: string
  duplicateSlugMessage?: string
  invalidCanonicalUrlMessage?: string
  negativeSortOrderMessage?: string
  invalidParentMessage?: string
  saveErrorMessage?: string
  deleteErrorMessage?: string
  categories?: CategoryHierarchyCategory[]
  expandedCategoryIds?: string[]
  onSave?: (payload: CategoryHierarchySavePayload) => void | Promise<void>
  onDelete?: (categoryId: string) => void | Promise<void>
}
