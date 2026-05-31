'use client'

import { Button } from '@ecom/core-ui/atoms/Button'
import { Input } from '@ecom/core-ui/atoms/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@ecom/core-ui/molecules/Card'
import { Plus, Search } from 'lucide-react'
import { type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { CategoryTreeRow } from '../../../molecules'
import { TREE_CARD_CLASS_NAME } from '../CategoryHierarchy.constants'
import type { CategoryHierarchyCategory } from '../CategoryHierarchy.types'
import type { VisibleTreeItem } from '../CategoryHierarchy.utils'

interface CategoryTreePanelProps {
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
}

export function CategoryTreePanel({
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
}: CategoryTreePanelProps) {
  const emptyMessage = isSearching ? noSearchResultsMessage : emptyTreeMessage

  return (
    <Card className={`${TREE_CARD_CLASS_NAME} h-fit overflow-hidden`}>
      <CardHeader className="border-b px-4">
        <CardTitle className="text-base">{treeTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 px-3">
        <div className="relative">
          <Search
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
            aria-hidden="true"
          />
          <Input
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            className="h-11 rounded-2xl pl-9"
            aria-label={searchPlaceholder}
          />
        </div>

        <Button type="button" className="w-full rounded-2xl" onClick={onCreate}>
          <Plus className="size-4" aria-hidden="true" />
          {newCategoryLabel}
        </Button>

        {tree.length > 0 ? (
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
          <div
            className="text-muted-foreground rounded-2xl border border-dashed px-4 py-8 text-sm"
            role="status"
          >
            {emptyMessage}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
