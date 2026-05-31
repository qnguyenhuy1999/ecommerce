'use client'

import { Checkbox } from '@ecom/core-ui/atoms/Checkbox'
import { Input } from '@ecom/core-ui/atoms/Input'
import { Label } from '@ecom/core-ui/atoms/Label'
import { Typography } from '@ecom/core-ui/atoms/Typography'
import { Card, CardContent, CardHeader, CardTitle } from '@ecom/core-ui/molecules/Card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ecom/core-ui/molecules/Select'
import { INPUT_CLASS_NAME, SECTION_CARD_CLASS_NAME } from '../CategoryHierarchy.constants'
import type { CategoryHierarchyCategory } from '../CategoryHierarchy.types'
import type { FlatCategoryItem, ValidationErrors } from '../CategoryHierarchy.utils'
import { FieldError } from './FieldError'

interface CategoryDetailsCardProps {
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
}

export function CategoryDetailsCard({
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
}: CategoryDetailsCardProps) {
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
              aria-describedby={errors.name ? 'category-name-error' : undefined}
            />
            <FieldError id="category-name-error" message={errors.name} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-slug">{slugLabel}</Label>
            <Input
              id="category-slug"
              value={draft.slug}
              onChange={(event) => onChange({ ...draft, slug: event.target.value })}
              className={INPUT_CLASS_NAME}
              aria-invalid={Boolean(errors.slug)}
              aria-describedby={errors.slug ? 'category-slug-error' : undefined}
            />
            <FieldError id="category-slug-error" message={errors.slug} />
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
                aria-describedby={errors.parentId ? 'category-parent-error' : undefined}
              >
                <SelectValue placeholder={rootParentLabel} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="root">{rootParentLabel}</SelectItem>
                {parentOptions.map((category) => (
                  <SelectItem
                    key={category.id}
                    value={category.id}
                  >{`${'— '.repeat(category.depth)}${category.name}`}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError id="category-parent-error" message={errors.parentId} />
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
              aria-describedby={errors.sortOrder ? 'category-sort-order-error' : undefined}
            />
            <FieldError id="category-sort-order-error" message={errors.sortOrder} />
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
