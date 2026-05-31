'use client'

import { useCategoryHierarchyController } from './CategoryHierarchy.controller'
import type {
  CategoryHierarchyCategory,
  CategoryHierarchySavePayload,
} from './CategoryHierarchy.types'
import { CategoryDraftArea } from './components/CategoryDraftArea.client'
import { CategoryEmptyState } from './components/CategoryEmptyState'
import { CategoryTreePanel } from './components/CategoryTreePanel.client'

export interface CategoryHierarchyClientProps {
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
  onSave: ((payload: CategoryHierarchySavePayload) => void | Promise<void>) | undefined
  onDelete: ((categoryId: string) => void | Promise<void>) | undefined
}

export function CategoryHierarchyClient(props: CategoryHierarchyClientProps) {
  const { state, computed, handlers } = useCategoryHierarchyController({
    categories: props.categories,
    expandedCategoryIds: props.expandedCategoryIds,
    newCategoryName: props.newCategoryName,
    newCategorySlug: props.newCategorySlug,
    newCategoryMetaDescription: props.newCategoryMetaDescription,
    defaultMetaTitleSuffix: props.defaultMetaTitleSuffix,
    unsavedChangesMessage: props.unsavedChangesMessage,
    cancelChangesMessage: props.cancelChangesMessage,
    deleteCategoryMessage: props.deleteCategoryMessage,
    deleteCategoryWithChildrenMessage: props.deleteCategoryWithChildrenMessage,
    nameRequiredMessage: props.nameRequiredMessage,
    slugRequiredMessage: props.slugRequiredMessage,
    canonicalUrlRequiredMessage: props.canonicalUrlRequiredMessage,
    duplicateSlugMessage: props.duplicateSlugMessage,
    invalidCanonicalUrlMessage: props.invalidCanonicalUrlMessage,
    negativeSortOrderMessage: props.negativeSortOrderMessage,
    invalidParentMessage: props.invalidParentMessage,
    saveErrorMessage: props.saveErrorMessage,
    deleteErrorMessage: props.deleteErrorMessage,
    onSave: props.onSave,
    onDelete: props.onDelete,
  })

  return (
    <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
      <aside aria-label={props.treeTitle}>
        <CategoryTreePanel
          treeTitle={props.treeTitle}
          searchPlaceholder={props.searchPlaceholder}
          searchQuery={state.searchQuery}
          newCategoryLabel={props.newCategoryLabel}
          tree={computed.visibleTree}
          selectedId={state.selectedId}
          expandedIds={state.expandedIds}
          focusedId={state.focusedId}
          isSearching={computed.isSearching}
          emptyTreeMessage={props.emptyTreeMessage}
          noSearchResultsMessage={props.noSearchResultsMessage}
          onCreate={handlers.handleCreate}
          onSearchChange={handlers.setSearchQuery}
          onSelect={handlers.requestSelection}
          onToggle={handlers.handleToggle}
          onFocus={handlers.setFocusedId}
          onItemKeyDown={handlers.handleItemKeyDown}
        />
      </aside>

      <main>
        {state.draft ? (
          <CategoryDraftArea
            draft={state.draft}
            errorMessage={state.errorMessage}
            sortOrderInput={state.sortOrderInput}
            validationErrors={state.validationErrors}
            isSaving={state.isSaving}
            isDeleting={state.isDeleting}
            parentOptions={computed.parentOptions}
            detailsTitle={props.detailsTitle}
            displayNameLabel={props.displayNameLabel}
            slugLabel={props.slugLabel}
            parentLabel={props.parentLabel}
            sortOrderLabel={props.sortOrderLabel}
            iconLabel={props.iconLabel}
            featuredLabel={props.featuredLabel}
            showOnHomeLabel={props.showOnHomeLabel}
            rootParentLabel={props.rootParentLabel}
            seoTitle={props.seoTitle}
            metaTitleLabel={props.metaTitleLabel}
            metaDescriptionLabel={props.metaDescriptionLabel}
            canonicalUrlLabel={props.canonicalUrlLabel}
            statsTitle={props.statsTitle}
            productsStatLabel={props.productsStatLabel}
            liveVendorsStatLabel={props.liveVendorsStatLabel}
            gmv30dStatLabel={props.gmv30dStatLabel}
            deleteLabel={props.deleteLabel}
            deleteLoadingLabel={props.deleteLoadingLabel}
            cancelLabel={props.cancelLabel}
            saveLabel={props.saveLabel}
            saveLoadingLabel={props.saveLoadingLabel}
            onDraftChange={handlers.setDraft}
            onSortOrderChange={handlers.handleSortOrderChange}
            onDelete={() => void handlers.handleDelete()}
            onCancel={handlers.handleCancel}
            onSave={() => void handlers.handleSave()}
          />
        ) : (
          <CategoryEmptyState message={props.emptyStateMessage} />
        )}
      </main>
    </div>
  )
}
