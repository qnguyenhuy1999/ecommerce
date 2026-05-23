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
import { type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { CategoryTreeRow } from '../../molecules'
import {
  INPUT_CLASS_NAME,
  SECTION_CARD_CLASS_NAME,
  TREE_CARD_CLASS_NAME,
} from './CategoryHierarchy.constants'
import { useCategoryHierarchyController } from './CategoryHierarchy.controller'
import type {
  CategoryHierarchyCategory,
  CategoryHierarchySavePayload,
} from './CategoryHierarchy.types'
import type { FlatCategoryItem, ValidationErrors, VisibleTreeItem } from './CategoryHierarchy.utils'

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
    <Card className={`${TREE_CARD_CLASS_NAME} h-fit overflow-hidden`}>
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
    <Card className={SECTION_CARD_CLASS_NAME}>
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
              className={INPUT_CLASS_NAME}
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
              className={INPUT_CLASS_NAME}
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
                className={`${INPUT_CLASS_NAME} w-full`}
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
              className={INPUT_CLASS_NAME}
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
              className={INPUT_CLASS_NAME}
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
    <Card className={SECTION_CARD_CLASS_NAME}>
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
            className={INPUT_CLASS_NAME}
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
            className={INPUT_CLASS_NAME}
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
    <Card className={SECTION_CARD_CLASS_NAME}>
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
    <Card className={SECTION_CARD_CLASS_NAME}>
      <CardContent className="flex min-h-80 items-center justify-center p-6">
        <Typography variant="body" className="text-muted-foreground">
          {message}
        </Typography>
      </CardContent>
    </Card>
  )
}

function CategoryDraftArea({
  draft,
  errorMessage,
  sortOrderInput,
  validationErrors,
  isSaving,
  isDeleting,
  parentOptions,
  detailsTitle,
  displayNameLabel,
  slugLabel,
  parentLabel,
  sortOrderLabel,
  iconLabel,
  featuredLabel,
  showOnHomeLabel,
  rootParentLabel,
  seoTitle,
  metaTitleLabel,
  metaDescriptionLabel,
  canonicalUrlLabel,
  statsTitle,
  productsStatLabel,
  liveVendorsStatLabel,
  gmv30dStatLabel,
  deleteLabel,
  deleteLoadingLabel,
  cancelLabel,
  saveLabel,
  saveLoadingLabel,
  onDraftChange,
  onSortOrderChange,
  onDelete,
  onCancel,
  onSave,
}: {
  draft: CategoryHierarchyCategory
  errorMessage: string | null | undefined
  sortOrderInput: string
  validationErrors: ValidationErrors
  isSaving: boolean
  isDeleting: boolean
  parentOptions: FlatCategoryItem[]
  detailsTitle: string
  displayNameLabel: string
  slugLabel: string
  parentLabel: string
  sortOrderLabel: string
  iconLabel: string
  featuredLabel: string
  showOnHomeLabel: string
  rootParentLabel: string
  seoTitle: string
  metaTitleLabel: string
  metaDescriptionLabel: string
  canonicalUrlLabel: string
  statsTitle: string
  productsStatLabel: string
  liveVendorsStatLabel: string
  gmv30dStatLabel: string
  deleteLabel: string
  deleteLoadingLabel: string
  cancelLabel: string
  saveLabel: string
  saveLoadingLabel: string
  onDraftChange: (draft: CategoryHierarchyCategory) => void
  onSortOrderChange: (value: string) => void
  onDelete: () => void
  onCancel: () => void
  onSave: () => void
}) {
  return (
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
        onChange={onDraftChange}
        onSortOrderChange={onSortOrderChange}
      />
      <CategorySeoCard
        seoTitle={seoTitle}
        metaTitleLabel={metaTitleLabel}
        metaDescriptionLabel={metaDescriptionLabel}
        canonicalUrlLabel={canonicalUrlLabel}
        draft={draft}
        errors={validationErrors}
        onChange={onDraftChange}
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
        disabled={false}
        isSaving={isSaving}
        isDeleting={isDeleting}
        onDelete={onDelete}
        onCancel={onCancel}
        onSave={onSave}
      />
    </div>
  )
}

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
  const { state, computed, handlers } = useCategoryHierarchyController({
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

  return (
    <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
      <CategoryTreePanel
        treeTitle={treeTitle}
        searchPlaceholder={searchPlaceholder}
        searchQuery={state.searchQuery}
        newCategoryLabel={newCategoryLabel}
        tree={computed.visibleTree}
        selectedId={state.selectedId}
        expandedIds={state.expandedIds}
        focusedId={state.focusedId}
        isSearching={computed.isSearching}
        emptyTreeMessage={emptyTreeMessage}
        noSearchResultsMessage={noSearchResultsMessage}
        onCreate={handlers.handleCreate}
        onSearchChange={handlers.setSearchQuery}
        onSelect={handlers.requestSelection}
        onToggle={handlers.handleToggle}
        onFocus={handlers.setFocusedId}
        onItemKeyDown={handlers.handleItemKeyDown}
      />

      {state.draft ? (
        <CategoryDraftArea
          draft={state.draft}
          errorMessage={state.errorMessage}
          sortOrderInput={state.sortOrderInput}
          validationErrors={state.validationErrors}
          isSaving={state.isSaving}
          isDeleting={state.isDeleting}
          parentOptions={computed.parentOptions}
          detailsTitle={detailsTitle}
          displayNameLabel={displayNameLabel}
          slugLabel={slugLabel}
          parentLabel={parentLabel}
          sortOrderLabel={sortOrderLabel}
          iconLabel={iconLabel}
          featuredLabel={featuredLabel}
          showOnHomeLabel={showOnHomeLabel}
          rootParentLabel={rootParentLabel}
          seoTitle={seoTitle}
          metaTitleLabel={metaTitleLabel}
          metaDescriptionLabel={metaDescriptionLabel}
          canonicalUrlLabel={canonicalUrlLabel}
          statsTitle={statsTitle}
          productsStatLabel={productsStatLabel}
          liveVendorsStatLabel={liveVendorsStatLabel}
          gmv30dStatLabel={gmv30dStatLabel}
          deleteLabel={deleteLabel}
          deleteLoadingLabel={deleteLoadingLabel}
          cancelLabel={cancelLabel}
          saveLabel={saveLabel}
          saveLoadingLabel={saveLoadingLabel}
          onDraftChange={handlers.setDraft}
          onSortOrderChange={handlers.handleSortOrderChange}
          onDelete={() => void handlers.handleDelete()}
          onCancel={handlers.handleCancel}
          onSave={() => void handlers.handleSave()}
        />
      ) : (
        <CategoryEmptyState message={emptyStateMessage} />
      )}
    </div>
  )
}
