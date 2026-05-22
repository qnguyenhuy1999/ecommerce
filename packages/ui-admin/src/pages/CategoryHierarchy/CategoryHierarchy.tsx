import { ConsolePageLayout } from '@ecom/core-ui'
import { categoryHierarchyDefaultProps } from './CategoryHierarchy.fixtures'
import { CategoryHierarchyClient } from './CategoryHierarchy.client'
import type { CategoryHierarchyProps } from './CategoryHierarchy.types'

export function CategoryHierarchy({
  title = categoryHierarchyDefaultProps.title,
  description = categoryHierarchyDefaultProps.description,
  treeTitle = categoryHierarchyDefaultProps.treeTitle,
  detailsTitle = categoryHierarchyDefaultProps.detailsTitle,
  seoTitle = categoryHierarchyDefaultProps.seoTitle,
  statsTitle = categoryHierarchyDefaultProps.statsTitle,
  searchPlaceholder = categoryHierarchyDefaultProps.searchPlaceholder,
  newCategoryLabel = categoryHierarchyDefaultProps.newCategoryLabel,
  saveLabel = categoryHierarchyDefaultProps.saveLabel,
  saveLoadingLabel = categoryHierarchyDefaultProps.saveLoadingLabel,
  cancelLabel = categoryHierarchyDefaultProps.cancelLabel,
  deleteLabel = categoryHierarchyDefaultProps.deleteLabel,
  deleteLoadingLabel = categoryHierarchyDefaultProps.deleteLoadingLabel,
  displayNameLabel = categoryHierarchyDefaultProps.displayNameLabel,
  slugLabel = categoryHierarchyDefaultProps.slugLabel,
  parentLabel = categoryHierarchyDefaultProps.parentLabel,
  sortOrderLabel = categoryHierarchyDefaultProps.sortOrderLabel,
  iconLabel = categoryHierarchyDefaultProps.iconLabel,
  featuredLabel = categoryHierarchyDefaultProps.featuredLabel,
  showOnHomeLabel = categoryHierarchyDefaultProps.showOnHomeLabel,
  metaTitleLabel = categoryHierarchyDefaultProps.metaTitleLabel,
  metaDescriptionLabel = categoryHierarchyDefaultProps.metaDescriptionLabel,
  canonicalUrlLabel = categoryHierarchyDefaultProps.canonicalUrlLabel,
  rootParentLabel = categoryHierarchyDefaultProps.rootParentLabel,
  productsStatLabel = categoryHierarchyDefaultProps.productsStatLabel,
  liveVendorsStatLabel = categoryHierarchyDefaultProps.liveVendorsStatLabel,
  gmv30dStatLabel = categoryHierarchyDefaultProps.gmv30dStatLabel,
  emptyStateMessage = categoryHierarchyDefaultProps.emptyStateMessage,
  emptyTreeMessage = categoryHierarchyDefaultProps.emptyTreeMessage,
  noSearchResultsMessage = categoryHierarchyDefaultProps.noSearchResultsMessage,
  newCategoryName = categoryHierarchyDefaultProps.newCategoryName,
  newCategorySlug = categoryHierarchyDefaultProps.newCategorySlug,
  newCategoryMetaDescription = categoryHierarchyDefaultProps.newCategoryMetaDescription,
  defaultMetaTitleSuffix = categoryHierarchyDefaultProps.defaultMetaTitleSuffix,
  unsavedChangesMessage = categoryHierarchyDefaultProps.unsavedChangesMessage,
  cancelChangesMessage = categoryHierarchyDefaultProps.cancelChangesMessage,
  deleteCategoryMessage = categoryHierarchyDefaultProps.deleteCategoryMessage,
  deleteCategoryWithChildrenMessage = categoryHierarchyDefaultProps.deleteCategoryWithChildrenMessage,
  nameRequiredMessage = categoryHierarchyDefaultProps.nameRequiredMessage,
  slugRequiredMessage = categoryHierarchyDefaultProps.slugRequiredMessage,
  canonicalUrlRequiredMessage = categoryHierarchyDefaultProps.canonicalUrlRequiredMessage,
  duplicateSlugMessage = categoryHierarchyDefaultProps.duplicateSlugMessage,
  invalidCanonicalUrlMessage = categoryHierarchyDefaultProps.invalidCanonicalUrlMessage,
  negativeSortOrderMessage = categoryHierarchyDefaultProps.negativeSortOrderMessage,
  invalidParentMessage = categoryHierarchyDefaultProps.invalidParentMessage,
  saveErrorMessage = categoryHierarchyDefaultProps.saveErrorMessage,
  deleteErrorMessage = categoryHierarchyDefaultProps.deleteErrorMessage,
  categories = categoryHierarchyDefaultProps.categories,
  expandedCategoryIds = categoryHierarchyDefaultProps.expandedCategoryIds,
  onSave = categoryHierarchyDefaultProps.onSave,
  onDelete = categoryHierarchyDefaultProps.onDelete,
}: CategoryHierarchyProps) {
  return (
    <ConsolePageLayout
      title={title}
      description={description}
      breadcrumb={[{ label: 'Admin', href: '#' }, { label: 'Categories' }]}
      mainClassName="space-y-5"
    >
      <CategoryHierarchyClient
        treeTitle={treeTitle ?? 'Tree'}
        detailsTitle={detailsTitle ?? 'Category details'}
        seoTitle={seoTitle ?? 'SEO'}
        statsTitle={statsTitle ?? 'Stats'}
        searchPlaceholder={searchPlaceholder ?? 'Search categories'}
        newCategoryLabel={newCategoryLabel ?? 'New category'}
        saveLabel={saveLabel ?? 'Save changes'}
        saveLoadingLabel={saveLoadingLabel ?? 'Saving...'}
        cancelLabel={cancelLabel ?? 'Cancel'}
        deleteLabel={deleteLabel ?? 'Delete category'}
        deleteLoadingLabel={deleteLoadingLabel ?? 'Deleting...'}
        displayNameLabel={displayNameLabel ?? 'Display name'}
        slugLabel={slugLabel ?? 'Slug'}
        parentLabel={parentLabel ?? 'Parent'}
        sortOrderLabel={sortOrderLabel ?? 'Sort order'}
        iconLabel={iconLabel ?? 'Icon (lucide)'}
        featuredLabel={featuredLabel ?? 'Featured'}
        showOnHomeLabel={showOnHomeLabel ?? 'Show on home'}
        metaTitleLabel={metaTitleLabel ?? 'Meta title'}
        metaDescriptionLabel={metaDescriptionLabel ?? 'Meta description'}
        canonicalUrlLabel={canonicalUrlLabel ?? 'Canonical URL'}
        rootParentLabel={rootParentLabel ?? '—'}
        productsStatLabel={productsStatLabel ?? 'Products'}
        liveVendorsStatLabel={liveVendorsStatLabel ?? 'Live vendors'}
        gmv30dStatLabel={gmv30dStatLabel ?? 'GMV (30d)'}
        emptyStateMessage={emptyStateMessage ?? 'Select category to edit details.'}
        emptyTreeMessage={
          emptyTreeMessage ?? 'No categories yet. Create first category to start hierarchy.'
        }
        noSearchResultsMessage={noSearchResultsMessage ?? 'No categories match search.'}
        newCategoryName={newCategoryName ?? 'New category'}
        newCategorySlug={newCategorySlug ?? 'new-category'}
        newCategoryMetaDescription={newCategoryMetaDescription ?? 'Add category SEO copy.'}
        defaultMetaTitleSuffix={defaultMetaTitleSuffix ?? 'Halo Market'}
        unsavedChangesMessage={
          unsavedChangesMessage ?? 'You have unsaved changes. Discard them and switch categories?'
        }
        cancelChangesMessage={cancelChangesMessage ?? 'Discard unsaved changes for this category?'}
        deleteCategoryMessage={deleteCategoryMessage ?? 'Delete "{name}"?'}
        deleteCategoryWithChildrenMessage={
          deleteCategoryWithChildrenMessage ??
          'Delete "{name}" and {count} nested subcategories? This cannot be undone.'
        }
        nameRequiredMessage={nameRequiredMessage ?? 'Display name is required.'}
        slugRequiredMessage={slugRequiredMessage ?? 'Slug is required.'}
        canonicalUrlRequiredMessage={canonicalUrlRequiredMessage ?? 'Canonical URL is required.'}
        duplicateSlugMessage={duplicateSlugMessage ?? 'Slug must be unique.'}
        invalidCanonicalUrlMessage={
          invalidCanonicalUrlMessage ?? 'Canonical URL must be relative path or valid http(s) URL.'
        }
        negativeSortOrderMessage={negativeSortOrderMessage ?? 'Sort order cannot be negative.'}
        invalidParentMessage={invalidParentMessage ?? 'Parent category is invalid.'}
        saveErrorMessage={saveErrorMessage ?? 'Save failed. Try again.'}
        deleteErrorMessage={deleteErrorMessage ?? 'Delete failed. Try again.'}
        categories={categories ?? []}
        expandedCategoryIds={expandedCategoryIds ?? []}
        onSave={onSave}
        onDelete={onDelete}
      />
    </ConsolePageLayout>
  )
}
