'use client'

import React, { useEffect, useState, useRef } from 'react'

import { Search, FileText, Settings, User, Package, ShoppingCart } from 'lucide-react'

import { Dialog, DialogContent, Input, ScrollArea, cn } from '@ecom/ui'

export interface CommandItem {
  id: string
  label: string
  icon?: React.ReactNode
  shortcut?: string
  onSelect: () => void
}

export interface CommandGroup {
  heading: string
  items: CommandItem[]
}

export interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  groups: CommandGroup[]
}

const defaultIcons = {
  page: <FileText className="w-4 h-4" />,
  action: <Settings className="w-4 h-4" />,
  user: <User className="w-4 h-4" />,
  product: <Package className="w-4 h-4" />,
  order: <ShoppingCart className="w-4 h-4" />,
}

export function CommandPalette({ open, onOpenChange, groups }: CommandPaletteProps) {
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Flatten items for keyboard navigation
  const filteredGroups = groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.label.toLowerCase().includes(search.toLowerCase())),
    }))
    .filter((group) => group.items.length > 0)

  const flatItems = filteredGroups.flatMap((g) => g.items)

  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onOpenChange])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setSearch('')
    }
  }, [open])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => (i + 1) % Math.max(flatItems.length, 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => (i - 1 + flatItems.length) % Math.max(flatItems.length, 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (flatItems.length > 0 && selectedIndex >= 0) {
        flatItems[selectedIndex].onSelect()
        onOpenChange(false)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden max-w-2xl border-none shadow-[var(--elevation-modal)] bg-background/95 backdrop-blur-md [&>button:last-child]:hidden">
        <div role="search" className="flex items-center px-3 border-b" onKeyDown={handleKeyDown}>
          <Search className="w-5 h-5 text-muted-foreground shrink-0 ml-1" />
          <Input
            ref={inputRef}
            placeholder="Search commands..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 h-14 border-0 shadow-none focus-visible:ring-0 text-base bg-transparent"
          />
          <kbd className="hidden lg:inline-flex items-center gap-1 bg-muted px-1.5 rounded-[var(--radius-xs)] text-[10px] font-medium text-muted-foreground">
            ESC
          </kbd>
        </div>

        <ScrollArea className="max-h-[60vh] min-h-[300px]">
          {filteredGroups.length === 0 ? (
            <div className="py-14 px-6 text-center text-sm text-muted-foreground">
              No results found for "{search}"
            </div>
          ) : (
            <div className="p-2 space-y-4">
              {filteredGroups.map((group, groupIdx) => {
                // Calculate the global index of the first item in this group
                const startIndex = filteredGroups
                  .slice(0, groupIdx)
                  .reduce((acc, g) => acc + g.items.length, 0)

                return (
                  <div key={group.heading}>
                    <h4 className="px-3 py-2 text-xs font-semibold text-muted-foreground mb-1">
                      {group.heading}
                    </h4>
                    <div className="space-y-1">
                      {group.items.map((item, itemIdx) => {
                        const globalIndex = startIndex + itemIdx
                        const isSelected = selectedIndex === globalIndex

                        return (
                          <button
                            key={item.id}
                            className={cn(
                              'w-full flex items-center justify-between px-3 py-2.5 rounded-[var(--radius-sm)] text-sm cursor-pointer transition-colors duration-[var(--motion-fast)]',
                              isSelected
                                ? 'bg-brand text-brand-foreground shadow-sm'
                                : 'hover:bg-muted text-foreground',
                            )}
                            onClick={() => {
                              item.onSelect()
                              onOpenChange(false)
                            }}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                          >
                            <div className="flex items-center gap-2">
                              <span className={cn('opacity-70', isSelected && 'opacity-100')}>
                                {item.icon || defaultIcons.page}
                              </span>
                              <span>{item.label}</span>
                            </div>
                            {item.shortcut && (
                              <kbd
                                className={cn(
                                  'text-[10px] px-1.5 rounded-[var(--radius-xs)] border',
                                  isSelected
                                    ? 'bg-black/10 border-black/20 text-brand-foreground'
                                    : 'bg-muted text-muted-foreground',
                                )}
                              >
                                {item.shortcut}
                              </kbd>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
