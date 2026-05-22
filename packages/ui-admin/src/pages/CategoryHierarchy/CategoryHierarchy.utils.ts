import type { CategoryHierarchyCategory } from './CategoryHierarchy.types'

export interface FlatCategoryItem {
  id: string
  name: string
  slug: string
  depth: number
  parentId: string | null
  childCount: number
}

export interface ValidationErrors {
  name?: string
  slug?: string
  canonicalUrl?: string
  sortOrder?: string
  parentId?: string
}

export interface VisibleTreeItem {
  id: string
  parentId: string | null
  hasChildren: boolean
  isExpanded: boolean
  firstChildId: string | null
}

export interface SelectionState {
  selectedId: string | null
  draft: CategoryHierarchyCategory | null
}

export interface CategoryValidationMessages {
  nameRequiredMessage: string
  slugRequiredMessage: string
  canonicalUrlRequiredMessage: string
  duplicateSlugMessage: string
  invalidCanonicalUrlMessage: string
  negativeSortOrderMessage: string
  invalidParentMessage: string
}

export function cloneCategories(
  categories: CategoryHierarchyCategory[],
): CategoryHierarchyCategory[] {
  return categories.map((category) => ({
    ...category,
    children: cloneCategories(category.children),
  }))
}

export function flattenCategories(
  categories: CategoryHierarchyCategory[],
  depth = 0,
  parentId: string | null = null,
): FlatCategoryItem[] {
  return categories.flatMap((category) => [
    {
      id: category.id,
      name: category.name,
      slug: category.slug,
      depth,
      parentId,
      childCount: category.children.length,
    },
    ...flattenCategories(category.children, depth + 1, category.id),
  ])
}

export function findCategory(
  categories: CategoryHierarchyCategory[],
  categoryId: string | null,
): CategoryHierarchyCategory | null {
  if (!categoryId) {
    return null
  }

  for (const category of categories) {
    if (category.id === categoryId) {
      return category
    }

    const childMatch = findCategory(category.children, categoryId)
    if (childMatch) {
      return childMatch
    }
  }

  return null
}

export function collectDescendantIds(category: CategoryHierarchyCategory): string[] {
  return category.children.flatMap((child) => [child.id, ...collectDescendantIds(child)])
}

export function removeCategory(
  categories: CategoryHierarchyCategory[],
  categoryId: string,
): CategoryHierarchyCategory[] {
  return categories
    .filter((category) => category.id !== categoryId)
    .map((category) => ({
      ...category,
      children: removeCategory(category.children, categoryId),
    }))
}

export function insertCategory(
  categories: CategoryHierarchyCategory[],
  nextCategory: CategoryHierarchyCategory,
): CategoryHierarchyCategory[] {
  if (!nextCategory.parentId) {
    return [...categories, nextCategory].sort((left, right) => left.sortOrder - right.sortOrder)
  }

  return categories
    .map((category) => {
      if (category.id === nextCategory.parentId) {
        return {
          ...category,
          children: [...category.children, nextCategory].sort(
            (left, right) => left.sortOrder - right.sortOrder,
          ),
        }
      }

      return {
        ...category,
        children: insertCategory(category.children, nextCategory),
      }
    })
    .sort((left, right) => left.sortOrder - right.sortOrder)
}

export function filterCategoryTree(
  categories: CategoryHierarchyCategory[],
  query: string,
): CategoryHierarchyCategory[] {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) {
    return categories
  }

  return categories.flatMap((category) => {
    const filteredChildren = filterCategoryTree(category.children, normalizedQuery)
    const isMatch =
      category.name.toLowerCase().includes(normalizedQuery) ||
      category.slug.toLowerCase().includes(normalizedQuery)

    if (!isMatch && filteredChildren.length === 0) {
      return []
    }

    return [
      {
        ...category,
        children: filteredChildren,
      },
    ]
  })
}

export function flattenVisibleTree(
  categories: CategoryHierarchyCategory[],
  expandedIds: Set<string>,
  forceExpanded: boolean,
  parentId: string | null = null,
): VisibleTreeItem[] {
  return categories.flatMap((category) => {
    const hasChildren = category.children.length > 0
    const isExpanded = forceExpanded || expandedIds.has(category.id)
    const firstChildId = hasChildren ? (category.children[0]?.id ?? null) : null

    return [
      {
        id: category.id,
        parentId,
        hasChildren,
        isExpanded,
        firstChildId,
      },
      ...(hasChildren && isExpanded
        ? flattenVisibleTree(category.children, expandedIds, forceExpanded, category.id)
        : []),
    ]
  })
}

export function buildDraft(category: CategoryHierarchyCategory): CategoryHierarchyCategory {
  return {
    ...category,
    children: cloneCategories(category.children),
  }
}

export function normalizeCategory(category: CategoryHierarchyCategory): CategoryHierarchyCategory {
  return {
    ...category,
    name: category.name.trim(),
    slug: category.slug.trim(),
    icon: category.icon.trim(),
    metaTitle: category.metaTitle.trim(),
    metaDescription: category.metaDescription.trim(),
    canonicalUrl: category.canonicalUrl.trim(),
    children: category.children.map(normalizeCategory),
  }
}

export function createTempId() {
  return `temp_${globalThis.crypto.randomUUID()}`
}

export function buildMessage(template: string, values: Record<string, string | number>) {
  let message = template

  for (const [key, value] of Object.entries(values)) {
    message = message.split(`{${key}}`).join(String(value))
  }

  return message
}

export function isValidCanonicalUrl(value: string) {
  if (value.startsWith('/')) {
    return true
  }

  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export function buildUniqueSlug(flatCategories: FlatCategoryItem[], baseSlug: string) {
  const normalizedBase = baseSlug.trim().toLowerCase() || 'new-category'
  const existingSlugs = new Set(
    flatCategories.map((category) => category.slug.trim().toLowerCase()),
  )
  if (!existingSlugs.has(normalizedBase)) {
    return normalizedBase
  }

  let index = 2
  let candidate = `${normalizedBase}-${index}`
  while (existingSlugs.has(candidate)) {
    index += 1
    candidate = `${normalizedBase}-${index}`
  }

  return candidate
}

export function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}

export function getSelectionState(
  categories: CategoryHierarchyCategory[],
  preferredId: string | null,
): SelectionState {
  const flatCategories = flattenCategories(categories)
  const selectedId = findCategory(categories, preferredId)?.id ?? flatCategories[0]?.id ?? null
  const selectedCategory = findCategory(categories, selectedId)

  return {
    selectedId,
    draft: selectedCategory ? buildDraft(selectedCategory) : null,
  }
}

export function buildNewCategory({
  flatCategories,
  newCategoryName,
  newCategorySlug,
  newCategoryMetaDescription,
  defaultMetaTitleSuffix,
}: {
  flatCategories: FlatCategoryItem[]
  newCategoryName: string
  newCategorySlug: string
  newCategoryMetaDescription: string
  defaultMetaTitleSuffix: string
}): CategoryHierarchyCategory {
  const nextSlug = buildUniqueSlug(flatCategories, newCategorySlug)

  return {
    id: createTempId(),
    name: newCategoryName,
    slug: nextSlug,
    parentId: null,
    sortOrder: flatCategories.length + 1,
    icon: 'FolderTree',
    featured: false,
    metaTitle: `${newCategoryName} - ${defaultMetaTitleSuffix}`,
    metaDescription: newCategoryMetaDescription,
    canonicalUrl: `/c/${nextSlug}`,
    stats: {
      products: '0',
      liveVendors: '0',
      gmv30d: '$0',
    },
    children: [],
  }
}

export function validateCategoryDraft(
  nextDraft: CategoryHierarchyCategory,
  tree: CategoryHierarchyCategory[],
  flatCategories: FlatCategoryItem[],
  blockedParentIdSet: Set<string>,
  messages: CategoryValidationMessages,
): ValidationErrors {
  const errors: ValidationErrors = {}
  const normalizedName = nextDraft.name.trim()
  const normalizedSlug = nextDraft.slug.trim().toLowerCase()
  const normalizedCanonicalUrl = nextDraft.canonicalUrl.trim()

  if (!normalizedName) {
    errors.name = messages.nameRequiredMessage
  }

  if (!normalizedSlug) {
    errors.slug = messages.slugRequiredMessage
  }

  if (!normalizedCanonicalUrl) {
    errors.canonicalUrl = messages.canonicalUrlRequiredMessage
  } else if (!isValidCanonicalUrl(normalizedCanonicalUrl)) {
    errors.canonicalUrl = messages.invalidCanonicalUrlMessage
  }

  if (!Number.isFinite(nextDraft.sortOrder) || nextDraft.sortOrder < 0) {
    errors.sortOrder = messages.negativeSortOrderMessage
  }

  if (nextDraft.parentId) {
    const parentExists = flatCategories.some((category) => category.id === nextDraft.parentId)
    if (!parentExists || blockedParentIdSet.has(nextDraft.parentId)) {
      errors.parentId = messages.invalidParentMessage
    }
  }

  if (normalizedSlug) {
    const hasDuplicateSlug = tree.some(function scan(category): boolean {
      if (category.id !== nextDraft.id && category.slug.trim().toLowerCase() === normalizedSlug) {
        return true
      }

      return category.children.some(scan)
    })

    if (hasDuplicateSlug) {
      errors.slug = messages.duplicateSlugMessage
    }
  }

  return errors
}
