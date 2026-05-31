'use client'

import { Typography } from '@ecom/core-ui/atoms/Typography'
import { CircleAlert } from 'lucide-react'
import type { CategoryHierarchyCategory } from '../CategoryHierarchy.types'
import type { FlatCategoryItem, ValidationErrors } from '../CategoryHierarchy.utils'
import { CategoryActions } from './CategoryActions.client'
import { CategoryDetailsCard } from './CategoryDetailsCard.client'
import { CategorySeoCard } from './CategorySeoCard.client'
import { CategoryStatsCard } from './CategoryStatsCard'

interface CategoryDraftAreaProps {
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
}

export function CategoryDraftArea({
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
}: CategoryDraftAreaProps) {
  return (
    <section className="space-y-4" aria-label={detailsTitle}>
      {errorMessage ? (
        <div
          role="alert"
          className="text-destructive border-destructive/20 bg-destructive/8 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm"
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <Typography as="span" variant="body-sm">
            {errorMessage}
          </Typography>
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
      <CategoryActions
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
    </section>
  )
}
