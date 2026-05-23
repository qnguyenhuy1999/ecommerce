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

export interface CategoryHierarchyControllerProps {
  categories: CategoryHierarchyCategory[]
  expandedCategoryIds: string[]
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
  onSave?: ((payload: CategoryHierarchySavePayload) => void | Promise<void>) | undefined
  onDelete?: ((categoryId: string) => void | Promise<void>) | undefined
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

export interface CategoryHierarchyControllerResult {
  state: {
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
  computed: {
    isDirty: boolean
    isSearching: boolean
    visibleTree: CategoryHierarchyCategory[]
    visibleItems: VisibleTreeItem[]
    parentOptions: FlatCategoryItem[]
  }
  handlers: {
    setDraft: (nextDraft: CategoryHierarchyCategory | null) => void
    setFocusedId: (nextFocusedId: string | null) => void
    setSearchQuery: (nextSearchQuery: string) => void
    requestSelection: (categoryId: string) => void
    handleToggle: (categoryId: string) => void
    handleCreate: () => void
    handleSortOrderChange: (value: string) => void
    handleSave: () => Promise<void>
    handleCancel: () => void
    handleDelete: () => Promise<void>
    handleItemKeyDown: (event: ReactKeyboardEvent<HTMLButtonElement>, item: VisibleTreeItem) => void
  }
}

// eslint-disable-next-line max-lines-per-function
export function useCategoryHierarchyController({
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
}: CategoryHierarchyControllerProps): CategoryHierarchyControllerResult {
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

  const isSearching = state.searchQuery.trim().length > 0
  const visibleTree = useMemo(
    () => filterCategoryTree(state.tree, state.searchQuery),
    [state.searchQuery, state.tree],
  )
  const visibleItems = useMemo(
    () => flattenVisibleTree(visibleTree, state.expandedIds, isSearching),
    [state.expandedIds, isSearching, visibleTree],
  )
  const visibleItemMap = useMemo(
    () => new Map(visibleItems.map((item, index) => [item.id, { item, index }])),
    [visibleItems],
  )

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

  const setFocusedId = useCallback((nextFocusedId: string | null) => {
    dispatch({ type: 'set-focused-id', focusedId: nextFocusedId })
  }, [])

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
    if (!state.focusedId && visibleItems[0]?.id) {
      setFocusedId(visibleItems[0].id)
      return
    }

    if (state.focusedId && !visibleItemMap.has(state.focusedId)) {
      setFocusedId(visibleItems[0]?.id ?? null)
    }
  }, [state.focusedId, setFocusedId, visibleItemMap, visibleItems])

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

  return {
    state: {
      tree: state.tree,
      selectedId: state.selectedId,
      draft: state.draft,
      expandedIds: state.expandedIds,
      focusedId: state.focusedId,
      searchQuery: state.searchQuery,
      sortOrderInput: state.sortOrderInput,
      validationErrors: state.validationErrors,
      errorMessage: state.errorMessage,
      isSaving: state.isSaving,
      isDeleting: state.isDeleting,
    },
    computed: {
      isDirty,
      isSearching,
      visibleTree,
      visibleItems,
      parentOptions,
    },
    handlers: {
      setDraft: (nextDraft: CategoryHierarchyCategory | null) =>
        dispatch({ type: 'set-draft', draft: nextDraft }),
      setFocusedId,
      setSearchQuery: (nextSearchQuery: string) =>
        dispatch({ type: 'set-search-query', searchQuery: nextSearchQuery }),
      requestSelection,
      handleToggle,
      handleCreate,
      handleSortOrderChange,
      handleSave,
      handleCancel,
      handleDelete,
      handleItemKeyDown,
    },
  }
}
