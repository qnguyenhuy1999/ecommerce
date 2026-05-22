'use client'

import { ChevronDown, ChevronRight } from 'lucide-react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import type { CategoryHierarchyCategory } from '../../pages/CategoryHierarchy/CategoryHierarchy.types'
import type { VisibleTreeItem } from '../../pages/CategoryHierarchy/CategoryHierarchy.utils'

interface CategoryTreeRowProps {
  category: CategoryHierarchyCategory
  depth: number
  selectedId: string | null
  expandedIds: Set<string>
  focusedId: string | null
  forceExpanded: boolean
  onSelect: (categoryId: string) => void
  onToggle: (categoryId: string) => void
  onFocus: (categoryId: string) => void
  onItemKeyDown: (event: ReactKeyboardEvent<HTMLButtonElement>, item: VisibleTreeItem) => void
}

export function CategoryTreeRow({
  category,
  depth,
  selectedId,
  expandedIds,
  focusedId,
  forceExpanded,
  onSelect,
  onToggle,
  onFocus,
  onItemKeyDown,
}: CategoryTreeRowProps) {
  const hasChildren = category.children.length > 0
  const isExpanded = forceExpanded || expandedIds.has(category.id)
  const isSelected = selectedId === category.id
  const isFocused = focusedId === category.id
  const item: VisibleTreeItem = {
    id: category.id,
    parentId: category.parentId ?? null,
    hasChildren,
    isExpanded,
    firstChildId: hasChildren ? (category.children[0]?.id ?? null) : null,
  }

  return (
    <div role="none">
      <div
        className={`hover:bg-muted/50 flex items-center gap-2 rounded-2xl px-3 py-2 text-sm transition-colors ${
          isSelected ? 'bg-primary/10 text-primary' : 'text-foreground'
        }`}
        style={{ paddingLeft: `${12 + depth * 18}px` }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onToggle(category.id)
            }}
            className="text-muted-foreground inline-flex size-5 items-center justify-center rounded-full"
            aria-label={isExpanded ? `Collapse ${category.name}` : `Expand ${category.name}`}
            aria-hidden={forceExpanded}
            disabled={forceExpanded}
          >
            {isExpanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
          </button>
        ) : (
          <span className="inline-flex size-5" />
        )}
        <button
          type="button"
          role="treeitem"
          aria-level={depth + 1}
          aria-selected={isSelected}
          aria-expanded={hasChildren ? isExpanded : undefined}
          data-treeitem-id={category.id}
          onClick={() => onSelect(category.id)}
          onFocus={() => onFocus(category.id)}
          onKeyDown={(event) => onItemKeyDown(event, item)}
          tabIndex={isFocused ? 0 : -1}
          className="min-w-0 flex-1 truncate text-left outline-none"
        >
          {category.name}
        </button>
      </div>

      {hasChildren && isExpanded
        ? category.children.map((child) => (
            <CategoryTreeRow
              key={child.id}
              category={child}
              depth={depth + 1}
              selectedId={selectedId}
              expandedIds={expandedIds}
              focusedId={focusedId}
              forceExpanded={forceExpanded}
              onSelect={onSelect}
              onToggle={onToggle}
              onFocus={onFocus}
              onItemKeyDown={onItemKeyDown}
            />
          ))
        : null}
    </div>
  )
}
