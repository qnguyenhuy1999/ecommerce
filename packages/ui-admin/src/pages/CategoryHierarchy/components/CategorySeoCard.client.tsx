'use client'

import { Input } from '@ecom/core-ui/atoms/Input'
import { Label } from '@ecom/core-ui/atoms/Label'
import { Textarea } from '@ecom/core-ui/atoms/Textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@ecom/core-ui/molecules/Card'
import { INPUT_CLASS_NAME, SECTION_CARD_CLASS_NAME } from '../CategoryHierarchy.constants'
import type { CategoryHierarchyCategory } from '../CategoryHierarchy.types'
import type { ValidationErrors } from '../CategoryHierarchy.utils'
import { FieldError } from './FieldError'

interface CategorySeoCardProps {
  seoTitle: string
  metaTitleLabel: string
  metaDescriptionLabel: string
  canonicalUrlLabel: string
  draft: CategoryHierarchyCategory
  errors: ValidationErrors
  onChange: (draft: CategoryHierarchyCategory) => void
}

export function CategorySeoCard({
  seoTitle,
  metaTitleLabel,
  metaDescriptionLabel,
  canonicalUrlLabel,
  draft,
  errors,
  onChange,
}: CategorySeoCardProps) {
  return (
    <Card className={SECTION_CARD_CLASS_NAME}>
      <CardHeader className="border-b px-4 pb-3 sm:px-5">
        <CardTitle className="text-base">{seoTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-4 sm:px-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="category-meta-title">{metaTitleLabel}</Label>
            <span className="text-muted-foreground text-xs" aria-live="polite">
              {draft.metaTitle.length} / 60
            </span>
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
            <span className="text-muted-foreground text-xs" aria-live="polite">
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
            aria-describedby={errors.canonicalUrl ? 'category-canonical-url-error' : undefined}
          />
          <FieldError id="category-canonical-url-error" message={errors.canonicalUrl} />
        </div>
      </CardContent>
    </Card>
  )
}
