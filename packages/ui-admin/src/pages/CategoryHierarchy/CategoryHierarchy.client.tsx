'use client'

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  StatCard,
  Textarea,
  Typography,
} from '@ecom/core-ui'
import { CircleAlert, Plus, Search, Trash2 } from 'lucide-react'
import { CategoryTreeRow } from '../../molecules'
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import type {
  CategoryHierarchyCategory,
  CategoryHierarchySavePayload,
} from './CategoryHierarchy.types'
import {
  buildDraft,
  buildMessage,
  buildNewCategory,
  cloneCategories,
  collectDescendantIds,
  filterCategoryTree,
  findCategory,
  flattenCategories,
  flattenVisibleTree,
  getErrorMessage,
  getSelectionState,
  insertCategory,
  normalizeCategory,
  removeCategory,
  validateCategoryDraft,
  type FlatCategoryItem,
  type ValidationErrors,
  type VisibleTreeItem,
} from './CategoryHierarchy.utils'

interface CategoryHierarchyClientProps {
  treeTitle: string
  detailsTitle: string
  seoTitle: string
  statsTitle: string
  searchPlaceholder: string
  newCategoryLabel: string
  saveLabel: string
  saveLoadingLabel: string
  cancelLabel: string
  deleteLabel: string
  deleteLoadingLabel: string
  displayNameLabel: string
  slugLabel: string
  parentLabel: string
  sortOrderLabel: string
  iconLabel: string
  featuredLabel: string
  showOnHomeLabel: string
  metaTitleLabel: string
  metaDescriptionLabel: string
  canonicalUrlLabel: string
  rootParentLabel: string
  productsStatLabel: string
  liveVendorsStatLabel: string
  gmv30dStatLabel: string
  emptyStateMessage: string
  emptyTreeMessage: string
  noSearchResultsMessage: string
  newCategoryName: string
  newCategorySlug: string
  newCategoryMetaDescription: string
  defaultMetaTitleSuffix: string
  unsavedChangesMessage: string
  cancelChangesMessage: string
  deleteCategoryMessage: string
  deleteCategoryWithChildrenMessage: string
  nameRequiredMessage: string
  slugRequiredMessage: string
  canonicalUrlRequiredMessage: string
  duplicateSlugMessage: string
  invalidCanonicalUrlMessage: string
  negativeSortOrderMessage: string
  invalidParentMessage: string
  saveErrorMessage: string
  deleteErrorMessage: string
  categories: CategoryHierarchyCategory[]
  expandedCategoryIds: string[]
  onSave?: ((payload: CategoryHierarchySavePayload) => void | Promise<void>) | undefined
  onDelete?: ((categoryId: string) => void | Promise<void>) | undefined
}

const treeCardClassName = 'rounded-xl border-border/80 shadow-sm'
const sectionCardClassName = 'rounded-xl border-border/80 shadow-sm'
const inputClassName = 'h-11 rounded-2xl'

function FieldError({ message }: { message?: string | undefined }) {
  if (!message) {
    return null
  }

  return (
    <Typography variant="body-sm" className="text-destructive">
      {message}
    </Typography>
  )
}

function CategoryTreePanel({
  treeTitle,
  searchPlaceholder,
  searchQuery,
  newCategoryLabel,
  tree,
  selectedId,
  expandedIds,
  focusedId,
  isSearching,
  emptyTreeMessage,
  noSearchResultsMessage,
  onCreate,
  onSearchChange,
  onSelect,
  onToggle,
  onFocus,
  onItemKeyDown,
}: {
  treeTitle: string
  searchPlaceholder: string
  searchQuery: string
  newCategoryLabel: string
  tree: CategoryHierarchyCategory[]
  selectedId: string | null
  expandedIds: Set<string>
  focusedId: string | null
  isSearching: boolean
  emptyTreeMessage: string
  noSearchResultsMessage: string
  onCreate: () => void
  onSearchChange: (value: string) => void
  onSelect: (categoryId: string) => void
  onToggle: (categoryId: string) => void
  onFocus: (categoryId: string) => void
  onItemKeyDown: (event: ReactKeyboardEvent<HTMLButtonElement>, item: VisibleTreeItem) => void
}) {
  const hasItems = tree.length > 0
  const emptyMessage = isSearching ? noSearchResultsMessage : emptyTreeMessage

  return (
    <Card className={`${treeCardClassName} h-fit overflow-hidden`}>
      <CardHeader className="border-b px-4">
        <CardTitle className="text-base">{treeTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 px-3">
        <div className="relative">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            className="h-11 rounded-2xl pl-9"
            aria-label={searchPlaceholder}
          />
        </div>

        <Button type="button" className="w-full rounded-2xl" onClick={onCreate}>
          <Plus className="size-4" />
          {newCategoryLabel}
        </Button>

        {hasItems ? (
          <div role="tree" aria-label={treeTitle} className="space-y-1">
            {tree.map((category) => (
              <CategoryTreeRow
                key={category.id}
                category={category}
                depth={0}
                selectedId={selectedId}
                expandedIds={expandedIds}
                focusedId={focusedId}
                forceExpanded={isSearching}
                onSelect={onSelect}
                onToggle={onToggle}
                onFocus={onFocus}
                onItemKeyDown={onItemKeyDown}
              />
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground rounded-2xl border border-dashed px-4 py-8 text-sm">
            {emptyMessage}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function CategoryDetailsCard({
  detailsTitle,
  displayNameLabel,
  slugLabel,
  parentLabel,
  sortOrderLabel,
  iconLabel,
  featuredLabel,
  showOnHomeLabel,
  rootParentLabel,
  draft,
  sortOrderValue,
  parentOptions,
  errors,
  onChange,
  onSortOrderChange,
}: {
  detailsTitle: string
  displayNameLabel: string
  slugLabel: string
  parentLabel: string
  sortOrderLabel: string
  iconLabel: string
  featuredLabel: string
  showOnHomeLabel: string
  rootParentLabel: string
  draft: CategoryHierarchyCategory
  sortOrderValue: string
  parentOptions: FlatCategoryItem[]
  errors: ValidationErrors
  onChange: (draft: CategoryHierarchyCategory) => void
  onSortOrderChange: (value: string) => void
}) {
  return (
    <Card className={sectionCardClassName}>
      <CardHeader className="border-b px-4 pb-3 sm:px-5">
        <div className="space-y-1">
          <Typography variant="caption" className="text-muted-foreground uppercase">
            {detailsTitle}
          </Typography>
          <CardTitle className="text-base">{draft.name}</CardTitle>
          <Typography variant="body-sm" className="text-muted-foreground">
            ID {draft.id} · {draft.children.length} subcategories
          </Typography>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 px-4 sm:px-5">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="category-name">{displayNameLabel}</Label>
            <Input
              id="category-name"
              value={draft.name}
              onChange={(event) => onChange({ ...draft, name: event.target.value })}
              className={inputClassName}
              aria-invalid={Boolean(errors.name)}
            />
            <FieldError message={errors.name} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-slug">{slugLabel}</Label>
            <Input
              id="category-slug"
              value={draft.slug}
              onChange={(event) => onChange({ ...draft, slug: event.target.value })}
              className={inputClassName}
              aria-invalid={Boolean(errors.slug)}
            />
            <FieldError message={errors.slug} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-parent">{parentLabel}</Label>
            <Select
              value={draft.parentId ?? 'root'}
              onValueChange={(value) =>
                onChange({ ...draft, parentId: value === 'root' ? null : value })
              }
            >
              <SelectTrigger
                id="category-parent"
                className={`${inputClassName} w-full`}
                aria-invalid={Boolean(errors.parentId)}
              >
                <SelectValue placeholder={rootParentLabel} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="root">{rootParentLabel}</SelectItem>
                {parentOptions.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {`${'— '.repeat(category.depth)}${category.name}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError message={errors.parentId} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-sort-order">{sortOrderLabel}</Label>
            <Input
              id="category-sort-order"
              type="number"
              value={sortOrderValue}
              onChange={(event) => onSortOrderChange(event.target.value)}
              className={inputClassName}
              aria-invalid={Boolean(errors.sortOrder)}
            />
            <FieldError message={errors.sortOrder} />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
          <div className="space-y-2">
            <Label htmlFor="category-icon">{iconLabel}</Label>
            <Input
              id="category-icon"
              value={draft.icon}
              onChange={(event) => onChange({ ...draft, icon: event.target.value })}
              className={inputClassName}
            />
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium">{featuredLabel}</span>
            <label className="flex h-11 items-center gap-3">
              <Checkbox
                checked={draft.featured}
                onCheckedChange={(checked) => onChange({ ...draft, featured: checked === true })}
                aria-label={showOnHomeLabel}
              />
              <span className="text-sm">{showOnHomeLabel}</span>
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CategorySeoCard({
  seoTitle,
  metaTitleLabel,
  metaDescriptionLabel,
  canonicalUrlLabel,
  draft,
  errors,
  onChange,
}: {
  seoTitle: string
  metaTitleLabel: string
  metaDescriptionLabel: string
  canonicalUrlLabel: string
  draft: CategoryHierarchyCategory
  errors: ValidationErrors
  onChange: (draft: CategoryHierarchyCategory) => void
}) {
  return (
    <Card className={sectionCardClassName}>
      <CardHeader className="border-b px-4 pb-3 sm:px-5">
        <CardTitle className="text-base">{seoTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-4 sm:px-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="category-meta-title">{metaTitleLabel}</Label>
            <span className="text-muted-foreground text-xs">{draft.metaTitle.length} / 60</span>
          </div>
          <Input
            id="category-meta-title"
            value={draft.metaTitle}
            onChange={(event) => onChange({ ...draft, metaTitle: event.target.value })}
            className={inputClassName}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="category-meta-description">{metaDescriptionLabel}</Label>
            <span className="text-muted-foreground text-xs">
              {draft.metaDescription.length} / 160
            </span>
          </div>
          <Textarea
            id="category-meta-description"
            value={draft.metaDescription}
            onChange={(event) => onChange({ ...draft, metaDescription: event.target.value })}
            className="min-h-28 rounded-2xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category-canonical-url">{canonicalUrlLabel}</Label>
          <Input
            id="category-canonical-url"
            value={draft.canonicalUrl}
            onChange={(event) => onChange({ ...draft, canonicalUrl: event.target.value })}
            className={inputClassName}
            aria-invalid={Boolean(errors.canonicalUrl)}
          />
          <FieldError message={errors.canonicalUrl} />
        </div>
      </CardContent>
    </Card>
  )
}

function CategoryStatsCard({
  statsTitle,
  productsStatLabel,
  liveVendorsStatLabel,
  gmv30dStatLabel,
  draft,
}: {
  statsTitle: string
  productsStatLabel: string
  liveVendorsStatLabel: string
  gmv30dStatLabel: string
  draft: CategoryHierarchyCategory
}) {
  return (
    <Card className={sectionCardClassName}>
      <CardHeader className="border-b px-4 pb-3 sm:px-5">
        <CardTitle className="text-base">{statsTitle}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 px-4 sm:grid-cols-3 sm:px-5">
        <StatCard label={productsStatLabel} value={draft.stats.products} className="rounded-2xl" />
        <StatCard
          label={liveVendorsStatLabel}
          value={draft.stats.liveVendors}
          className="rounded-2xl"
        />
        <StatCard label={gmv30dStatLabel} value={draft.stats.gmv30d} className="rounded-2xl" />
      </CardContent>
    </Card>
  )
}

function CategoryActionsCard({
  deleteLabel,
  deleteLoadingLabel,
  cancelLabel,
  saveLabel,
  saveLoadingLabel,
  disabled,
  isSaving,
  isDeleting,
  onDelete,
  onCancel,
  onSave,
}: {
  deleteLabel: string
  deleteLoadingLabel: string
  cancelLabel: string
  saveLabel: string
  saveLoadingLabel: string
  disabled: boolean
  isSaving: boolean
  isDeleting: boolean
  onDelete: () => void
  onCancel: () => void
  onSave: () => void
}) {
  return (
    <div className="mt-5 flex items-center justify-between">
      <Button
        type="button"
        variant="ghost"
        className="text-destructive hover:text-destructive justify-start rounded-2xl px-0"
        onClick={onDelete}
        disabled={disabled || isSaving}
        loading={isDeleting}
      >
        <Trash2 className="size-4" />
        {isDeleting ? deleteLoadingLabel : deleteLabel}
      </Button>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          className="rounded-2xl"
          onClick={onCancel}
          disabled={disabled}
        >
          {cancelLabel}
        </Button>
        <Button
          type="button"
          className="rounded-2xl"
          onClick={onSave}
          disabled={disabled || isDeleting}
          loading={isSaving}
        >
          {isSaving ? saveLoadingLabel : saveLabel}
        </Button>
      </div>
    </div>
  )
}

function CategoryEmptyState({ message }: { message: string }) {
  return (
    <Card className={sectionCardClassName}>
      <CardContent className="flex min-h-80 items-center justify-center p-6">
        <Typography variant="body" className="text-muted-foreground">
          {message}
        </Typography>
      </CardContent>
    </Card>
  )
}

interface CategoryHierarchyState {
  tree: CategoryHierarchyCategory[]
  selectedId: string | null
  draft: CategoryHierarchyCategory | null
  expandedIds: Set<string>
  focusedId: string | null
  searchQuery: string
  sortOrderInput: string
  validationErrors: ValidationErrors
  errorMessage: string | null
  isSaving: boolean
  isDeleting: boolean
}

type CategoryHierarchyAction =
  | {
      type: 'sync-from-props'
      categories: CategoryHierarchyCategory[]
      expandedCategoryIds: string[]
      preferredId: string | null
    }
  | {
      type: 'sync-selection'
      categoryId: string | null
      tree?: CategoryHierarchyCategory[]
    }
  | {
      type: 'set-draft'
      draft: CategoryHierarchyCategory | null
    }
  | {
      type: 'set-focused-id'
      focusedId: string | null
    }
  | {
      type: 'set-search-query'
      searchQuery: string
    }
  | {
      type: 'toggle-expanded'
      categoryId: string
    }
  | {
      type: 'set-sort-order-input'
      value: string
    }
  | {
      type: 'set-validation-errors'
      validationErrors: ValidationErrors
    }
  | {
      type: 'set-error-message'
      errorMessage: string | null
    }
  | {
      type: 'set-is-saving'
      isSaving: boolean
    }
  | {
      type: 'set-is-deleting'
      isDeleting: boolean
    }
  | {
      type: 'clear-feedback'
    }

function buildCategoryHierarchyState({
  categories,
  expandedCategoryIds,
  preferredId,
}: {
  categories: CategoryHierarchyCategory[]
  expandedCategoryIds: string[]
  preferredId: string | null
}): CategoryHierarchyState {
  const nextTree = cloneCategories(categories)
  const nextSelection = getSelectionState(nextTree, preferredId)

  return {
    tree: nextTree,
    selectedId: nextSelection.selectedId,
    draft: nextSelection.draft,
    expandedIds: new Set(expandedCategoryIds),
    focusedId: nextSelection.selectedId,
    searchQuery: '',
    sortOrderInput: nextSelection.draft ? String(nextSelection.draft.sortOrder) : '',
    validationErrors: {},
    errorMessage: null,
    isSaving: false,
    isDeleting: false,
  }
}

function categoryHierarchyReducer(
  state: CategoryHierarchyState,
  action: CategoryHierarchyAction,
): CategoryHierarchyState {
  switch (action.type) {
    case 'sync-from-props':
      return buildCategoryHierarchyState({
        categories: action.categories,
        expandedCategoryIds: action.expandedCategoryIds,
        preferredId: action.preferredId,
      })

    case 'sync-selection': {
      const nextTree = action.tree ?? state.tree
      const nextSelected = findCategory(nextTree, action.categoryId)

      return {
        ...state,
        tree: nextTree,
        selectedId: action.categoryId,
        focusedId: action.categoryId,
        draft: nextSelected ? buildDraft(nextSelected) : null,
        sortOrderInput: nextSelected ? String(nextSelected.sortOrder) : '',
        validationErrors: {},
        errorMessage: null,
      }
    }

    case 'set-draft':
      return {
        ...state,
        draft: action.draft,
      }

    case 'set-focused-id':
      return {
        ...state,
        focusedId: action.focusedId,
      }

    case 'set-search-query':
      return {
        ...state,
        searchQuery: action.searchQuery,
      }

    case 'toggle-expanded': {
      const nextExpandedIds = new Set(state.expandedIds)
      if (nextExpandedIds.has(action.categoryId)) {
        nextExpandedIds.delete(action.categoryId)
      } else {
        nextExpandedIds.add(action.categoryId)
      }

      return {
        ...state,
        expandedIds: nextExpandedIds,
      }
    }

    case 'set-sort-order-input': {
      if (!state.draft) {
        return state
      }

      const nextValue = action.value.trim()
      const nextSortOrder = nextValue.length === 0 ? Number.NaN : Number.parseInt(nextValue, 10)

      return {
        ...state,
        sortOrderInput: action.value,
        draft: {
          ...state.draft,
          sortOrder: Number.isNaN(nextSortOrder) ? Number.NaN : nextSortOrder,
        },
      }
    }

    case 'set-validation-errors':
      return {
        ...state,
        validationErrors: action.validationErrors,
      }

    case 'set-error-message':
      return {
        ...state,
        errorMessage: action.errorMessage,
      }

    case 'set-is-saving':
      return {
        ...state,
        isSaving: action.isSaving,
      }

    case 'set-is-deleting':
      return {
        ...state,
        isDeleting: action.isDeleting,
      }

    case 'clear-feedback':
      return {
        ...state,
        validationErrors: {},
        errorMessage: null,
      }
  }
}

// eslint-disable-next-line max-lines-per-function
function useCategoryHierarchyState({
  categories,
  expandedCategoryIds,
  newCategoryName,
  newCategorySlug,
  newCategoryMetaDescription,
  defaultMetaTitleSuffix,
  unsavedChangesMessage,
  cancelChangesMessage,
  deleteCategoryMessage,
  deleteCategoryWithChildrenMessage,
  nameRequiredMessage,
  slugRequiredMessage,
  canonicalUrlRequiredMessage,
  duplicateSlugMessage,
  invalidCanonicalUrlMessage,
  negativeSortOrderMessage,
  invalidParentMessage,
  saveErrorMessage,
  deleteErrorMessage,
  onSave,
  onDelete,
}: Pick<
  CategoryHierarchyClientProps,
  | 'categories'
  | 'expandedCategoryIds'
  | 'newCategoryName'
  | 'newCategorySlug'
  | 'newCategoryMetaDescription'
  | 'defaultMetaTitleSuffix'
  | 'unsavedChangesMessage'
  | 'cancelChangesMessage'
  | 'deleteCategoryMessage'
  | 'deleteCategoryWithChildrenMessage'
  | 'nameRequiredMessage'
  | 'slugRequiredMessage'
  | 'canonicalUrlRequiredMessage'
  | 'duplicateSlugMessage'
  | 'invalidCanonicalUrlMessage'
  | 'negativeSortOrderMessage'
  | 'invalidParentMessage'
  | 'saveErrorMessage'
  | 'deleteErrorMessage'
  | 'onSave'
  | 'onDelete'
>) {
  const [state, dispatch] = useReducer(
    categoryHierarchyReducer,
    { categories, expandedCategoryIds },
    ({ categories: initialCategories, expandedCategoryIds: initialExpandedIds }) =>
      buildCategoryHierarchyState({
        categories: initialCategories,
        expandedCategoryIds: initialExpandedIds,
        preferredId: null,
      }),
  )
  const selectedIdRef = useRef(state.selectedId)

  const flatCategories = useMemo(() => flattenCategories(state.tree), [state.tree])
  const selectedCategory = useMemo(
    () => findCategory(state.tree, state.selectedId),
    [state.selectedId, state.tree],
  )
  const selectedCategoryId = state.draft?.id ?? selectedCategory?.id ?? null
  const blockedParentIdSet = useMemo(() => {
    if (!state.draft || selectedCategoryId !== state.draft.id) {
      return new Set<string>()
    }

    return new Set<string>([state.draft.id, ...collectDescendantIds(state.draft)])
  }, [state.draft, selectedCategoryId])
  const parentOptions = useMemo(
    () => flatCategories.filter((category) => !blockedParentIdSet.has(category.id)),
    [blockedParentIdSet, flatCategories],
  )
  const isDirty = useMemo(() => {
    if (!state.draft || !selectedCategory) {
      return false
    }

    return (
      JSON.stringify(normalizeCategory(state.draft)) !==
      JSON.stringify(normalizeCategory(selectedCategory))
    )
  }, [state.draft, selectedCategory])

  useEffect(() => {
    selectedIdRef.current = state.selectedId
  }, [state.selectedId])

  useEffect(() => {
    dispatch({
      type: 'sync-from-props',
      categories,
      expandedCategoryIds,
      preferredId: selectedIdRef.current,
    })
  }, [categories, expandedCategoryIds])

  const syncDraftFromSelection = useCallback(
    (categoryId: string | null, nextTree = state.tree) => {
      dispatch({
        type: 'sync-selection',
        categoryId,
        tree: nextTree,
      })
    },
    [state.tree],
  )

  const confirmAction = useCallback((message: string) => {
    if (typeof window === 'undefined') {
      return true
    }

    return window.confirm(message)
  }, [])

  const requestSelection = useCallback(
    (categoryId: string) => {
      if (categoryId === state.selectedId) {
        dispatch({ type: 'set-focused-id', focusedId: categoryId })
        return
      }

      if (isDirty && !confirmAction(unsavedChangesMessage)) {
        return
      }

      syncDraftFromSelection(categoryId)
    },
    [confirmAction, isDirty, state.selectedId, syncDraftFromSelection, unsavedChangesMessage],
  )

  const handleToggle = useCallback((categoryId: string) => {
    dispatch({ type: 'toggle-expanded', categoryId })
  }, [])

  const handleCreate = useCallback(() => {
    if (isDirty && !confirmAction(unsavedChangesMessage)) {
      return
    }

    const nextCategory = buildNewCategory({
      flatCategories,
      newCategoryName,
      newCategorySlug,
      newCategoryMetaDescription,
      defaultMetaTitleSuffix,
    })

    const nextTree = insertCategory(state.tree, nextCategory)
    dispatch({ type: 'toggle-expanded', categoryId: nextCategory.id })
    syncDraftFromSelection(nextCategory.id, nextTree)
  }, [
    confirmAction,
    defaultMetaTitleSuffix,
    flatCategories,
    isDirty,
    newCategoryMetaDescription,
    newCategoryName,
    newCategorySlug,
    syncDraftFromSelection,
    state.tree,
    unsavedChangesMessage,
  ])

  const handleSortOrderChange = useCallback((value: string) => {
    dispatch({ type: 'set-sort-order-input', value })
  }, [])

  const validateDraft = useCallback(
    (nextDraft: CategoryHierarchyCategory) =>
      validateCategoryDraft(nextDraft, state.tree, flatCategories, blockedParentIdSet, {
        nameRequiredMessage,
        slugRequiredMessage,
        canonicalUrlRequiredMessage,
        duplicateSlugMessage,
        invalidCanonicalUrlMessage,
        negativeSortOrderMessage,
        invalidParentMessage,
      }),
    [
      blockedParentIdSet,
      canonicalUrlRequiredMessage,
      duplicateSlugMessage,
      flatCategories,
      invalidCanonicalUrlMessage,
      invalidParentMessage,
      nameRequiredMessage,
      negativeSortOrderMessage,
      slugRequiredMessage,
      state.tree,
    ],
  )

  const handleSave = useCallback(async () => {
    if (!state.draft || state.isSaving || state.isDeleting) {
      return
    }

    const nextCategory = {
      ...state.draft,
      name: state.draft.name.trim(),
      slug: state.draft.slug.trim(),
      icon: state.draft.icon.trim() || 'FolderTree',
      metaTitle:
        state.draft.metaTitle.trim() || `${state.draft.name.trim()} - ${defaultMetaTitleSuffix}`,
      metaDescription: state.draft.metaDescription.trim(),
      canonicalUrl: state.draft.canonicalUrl.trim(),
    }

    const errors = validateDraft(nextCategory)
    dispatch({ type: 'set-validation-errors', validationErrors: errors })
    if (Object.keys(errors).length > 0) {
      return
    }

    const nextTree = insertCategory(removeCategory(state.tree, nextCategory.id), nextCategory)

    dispatch({ type: 'set-is-saving', isSaving: true })
    dispatch({ type: 'set-error-message', errorMessage: null })

    try {
      await onSave?.({ category: nextCategory })
      syncDraftFromSelection(nextCategory.id, nextTree)
    } catch (error) {
      dispatch({
        type: 'set-error-message',
        errorMessage: getErrorMessage(error, saveErrorMessage),
      })
    } finally {
      dispatch({ type: 'set-is-saving', isSaving: false })
    }
  }, [
    defaultMetaTitleSuffix,
    onSave,
    saveErrorMessage,
    state.draft,
    state.isDeleting,
    state.isSaving,
    state.tree,
    syncDraftFromSelection,
    validateDraft,
  ])

  const handleCancel = useCallback(() => {
    if (isDirty && !confirmAction(cancelChangesMessage)) {
      return
    }

    syncDraftFromSelection(state.selectedId)
  }, [cancelChangesMessage, confirmAction, isDirty, state.selectedId, syncDraftFromSelection])

  const handleDelete = useCallback(async () => {
    if (!state.selectedId || !selectedCategory || state.isSaving || state.isDeleting) {
      return
    }

    if (isDirty && !confirmAction(unsavedChangesMessage)) {
      return
    }

    const descendantCount = collectDescendantIds(selectedCategory).length
    const confirmationMessage =
      descendantCount > 0
        ? buildMessage(deleteCategoryWithChildrenMessage, {
            name: selectedCategory.name,
            count: descendantCount,
          })
        : buildMessage(deleteCategoryMessage, { name: selectedCategory.name })

    if (!confirmAction(confirmationMessage)) {
      return
    }

    const nextTree = removeCategory(state.tree, state.selectedId)
    const nextSelectedId = flattenCategories(nextTree)[0]?.id ?? null
    const isTempCategory = state.selectedId.startsWith('temp_')

    dispatch({ type: 'set-is-deleting', isDeleting: true })
    dispatch({ type: 'set-error-message', errorMessage: null })

    try {
      if (!isTempCategory) {
        await onDelete?.(state.selectedId)
      }
      syncDraftFromSelection(nextSelectedId, nextTree)
    } catch (error) {
      dispatch({
        type: 'set-error-message',
        errorMessage: getErrorMessage(error, deleteErrorMessage),
      })
    } finally {
      dispatch({ type: 'set-is-deleting', isDeleting: false })
    }
  }, [
    confirmAction,
    deleteCategoryMessage,
    deleteCategoryWithChildrenMessage,
    deleteErrorMessage,
    isDirty,
    onDelete,
    selectedCategory,
    state.isDeleting,
    state.isSaving,
    state.selectedId,
    state.tree,
    syncDraftFromSelection,
    unsavedChangesMessage,
  ])

  return {
    tree: state.tree,
    selectedId: state.selectedId,
    draft: state.draft,
    expandedIds: state.expandedIds,
    focusedId: state.focusedId,
    searchQuery: state.searchQuery,
    sortOrderInput: state.sortOrderInput,
    validationErrors: state.validationErrors,
    errorMessage: state.errorMessage,
    isDirty,
    isSaving: state.isSaving,
    isDeleting: state.isDeleting,
    parentOptions,
    setDraft: (nextDraft: CategoryHierarchyCategory | null) =>
      dispatch({ type: 'set-draft', draft: nextDraft }),
    setFocusedId: (nextFocusedId: string | null) =>
      dispatch({ type: 'set-focused-id', focusedId: nextFocusedId }),
    setSearchQuery: (nextSearchQuery: string) =>
      dispatch({ type: 'set-search-query', searchQuery: nextSearchQuery }),
    requestSelection,
    handleToggle,
    handleCreate,
    handleSortOrderChange,
    handleSave,
    handleCancel,
    handleDelete,
  }
}

// eslint-disable-next-line max-lines-per-function
export function CategoryHierarchyClient({
  treeTitle,
  detailsTitle,
  seoTitle,
  statsTitle,
  searchPlaceholder,
  newCategoryLabel,
  saveLabel,
  saveLoadingLabel,
  cancelLabel,
  deleteLabel,
  deleteLoadingLabel,
  displayNameLabel,
  slugLabel,
  parentLabel,
  sortOrderLabel,
  iconLabel,
  featuredLabel,
  showOnHomeLabel,
  metaTitleLabel,
  metaDescriptionLabel,
  canonicalUrlLabel,
  rootParentLabel,
  productsStatLabel,
  liveVendorsStatLabel,
  gmv30dStatLabel,
  emptyStateMessage,
  emptyTreeMessage,
  noSearchResultsMessage,
  newCategoryName,
  newCategorySlug,
  newCategoryMetaDescription,
  defaultMetaTitleSuffix,
  unsavedChangesMessage,
  cancelChangesMessage,
  deleteCategoryMessage,
  deleteCategoryWithChildrenMessage,
  nameRequiredMessage,
  slugRequiredMessage,
  canonicalUrlRequiredMessage,
  duplicateSlugMessage,
  invalidCanonicalUrlMessage,
  negativeSortOrderMessage,
  invalidParentMessage,
  saveErrorMessage,
  deleteErrorMessage,
  categories,
  expandedCategoryIds,
  onSave,
  onDelete,
}: CategoryHierarchyClientProps) {
  const {
    tree,
    selectedId,
    draft,
    expandedIds,
    focusedId,
    searchQuery,
    sortOrderInput,
    validationErrors,
    errorMessage,
    isSaving,
    isDeleting,
    parentOptions,
    setDraft,
    setFocusedId,
    setSearchQuery,
    requestSelection,
    handleToggle,
    handleCreate,
    handleSortOrderChange,
    handleSave,
    handleCancel,
    handleDelete,
  } = useCategoryHierarchyState({
    categories,
    expandedCategoryIds,
    newCategoryName,
    newCategorySlug,
    newCategoryMetaDescription,
    defaultMetaTitleSuffix,
    unsavedChangesMessage,
    cancelChangesMessage,
    deleteCategoryMessage,
    deleteCategoryWithChildrenMessage,
    nameRequiredMessage,
    slugRequiredMessage,
    canonicalUrlRequiredMessage,
    duplicateSlugMessage,
    invalidCanonicalUrlMessage,
    negativeSortOrderMessage,
    invalidParentMessage,
    saveErrorMessage,
    deleteErrorMessage,
    onSave,
    onDelete,
  })

  const isSearching = searchQuery.trim().length > 0
  const visibleTree = useMemo(() => filterCategoryTree(tree, searchQuery), [searchQuery, tree])
  const visibleItems = useMemo(
    () => flattenVisibleTree(visibleTree, expandedIds, isSearching),
    [expandedIds, isSearching, visibleTree],
  )
  const visibleItemMap = useMemo(
    () => new Map(visibleItems.map((item, index) => [item.id, { item, index }])),
    [visibleItems],
  )

  const focusTreeItem = useCallback(
    (categoryId: string | null) => {
      if (!categoryId) {
        return
      }

      setFocusedId(categoryId)
      requestAnimationFrame(() => {
        document.querySelector<HTMLButtonElement>(`[data-treeitem-id="${categoryId}"]`)?.focus()
      })
    },
    [setFocusedId],
  )

  useEffect(() => {
    if (!focusedId && visibleItems[0]?.id) {
      setFocusedId(visibleItems[0].id)
      return
    }

    if (focusedId && !visibleItemMap.has(focusedId)) {
      setFocusedId(visibleItems[0]?.id ?? null)
    }
  }, [focusedId, setFocusedId, visibleItemMap, visibleItems])

  const handleItemKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLButtonElement>, item: VisibleTreeItem) => {
      const currentEntry = visibleItemMap.get(item.id)
      if (!currentEntry) {
        return
      }

      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault()
          focusTreeItem(visibleItems[currentEntry.index + 1]?.id ?? item.id)
          break
        }
        case 'ArrowUp': {
          event.preventDefault()
          focusTreeItem(visibleItems[currentEntry.index - 1]?.id ?? item.id)
          break
        }
        case 'ArrowRight': {
          event.preventDefault()
          if (item.hasChildren && !item.isExpanded && !isSearching) {
            handleToggle(item.id)
            break
          }

          focusTreeItem(item.firstChildId ?? item.id)
          break
        }
        case 'ArrowLeft': {
          event.preventDefault()
          if (item.hasChildren && item.isExpanded && !isSearching) {
            handleToggle(item.id)
            break
          }

          focusTreeItem(item.parentId ?? item.id)
          break
        }
        case 'Home': {
          event.preventDefault()
          focusTreeItem(visibleItems[0]?.id ?? item.id)
          break
        }
        case 'End': {
          event.preventDefault()
          focusTreeItem(visibleItems[visibleItems.length - 1]?.id ?? item.id)
          break
        }
        case 'Enter':
        case ' ': {
          event.preventDefault()
          requestSelection(item.id)
          break
        }
        default:
          break
      }
    },
    [focusTreeItem, handleToggle, isSearching, requestSelection, visibleItemMap, visibleItems],
  )

  return (
    <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
      <CategoryTreePanel
        treeTitle={treeTitle}
        searchPlaceholder={searchPlaceholder}
        searchQuery={searchQuery}
        newCategoryLabel={newCategoryLabel}
        tree={visibleTree}
        selectedId={selectedId}
        expandedIds={expandedIds}
        focusedId={focusedId}
        isSearching={isSearching}
        emptyTreeMessage={emptyTreeMessage}
        noSearchResultsMessage={noSearchResultsMessage}
        onCreate={handleCreate}
        onSearchChange={setSearchQuery}
        onSelect={requestSelection}
        onToggle={handleToggle}
        onFocus={setFocusedId}
        onItemKeyDown={handleItemKeyDown}
      />

      {draft ? (
        <div className="space-y-4">
          {errorMessage ? (
            <div
              role="alert"
              className="text-destructive border-destructive/20 bg-destructive/8 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm"
            >
              <CircleAlert className="mt-0.5 size-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          ) : null}

          <CategoryDetailsCard
            detailsTitle={detailsTitle}
            displayNameLabel={displayNameLabel}
            slugLabel={slugLabel}
            parentLabel={parentLabel}
            sortOrderLabel={sortOrderLabel}
            iconLabel={iconLabel}
            featuredLabel={featuredLabel}
            showOnHomeLabel={showOnHomeLabel}
            rootParentLabel={rootParentLabel}
            draft={draft}
            sortOrderValue={sortOrderInput}
            parentOptions={parentOptions}
            errors={validationErrors}
            onChange={setDraft}
            onSortOrderChange={handleSortOrderChange}
          />
          <CategorySeoCard
            seoTitle={seoTitle}
            metaTitleLabel={metaTitleLabel}
            metaDescriptionLabel={metaDescriptionLabel}
            canonicalUrlLabel={canonicalUrlLabel}
            draft={draft}
            errors={validationErrors}
            onChange={setDraft}
          />
          <CategoryStatsCard
            statsTitle={statsTitle}
            productsStatLabel={productsStatLabel}
            liveVendorsStatLabel={liveVendorsStatLabel}
            gmv30dStatLabel={gmv30dStatLabel}
            draft={draft}
          />
          <CategoryActionsCard
            deleteLabel={deleteLabel}
            deleteLoadingLabel={deleteLoadingLabel}
            cancelLabel={cancelLabel}
            saveLabel={saveLabel}
            saveLoadingLabel={saveLoadingLabel}
            disabled={!draft}
            isSaving={isSaving}
            isDeleting={isDeleting}
            onDelete={() => void handleDelete()}
            onCancel={handleCancel}
            onSave={() => void handleSave()}
          />
        </div>
      ) : (
        <CategoryEmptyState message={emptyStateMessage} />
      )}
    </div>
  )
}
