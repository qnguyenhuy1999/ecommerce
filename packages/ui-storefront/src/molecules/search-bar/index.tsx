'use client'

import * as React from 'react'
import { cn, Popover, PopoverContent, PopoverTrigger } from '@ecom/ui'
import { Search, X, Clock, TrendingUp } from 'lucide-react'

export interface SearchBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  placeholder?: string
  onSearch?: (query: string) => void
  suggestions?: string[]
  recentSearches?: string[]
}

function SearchBar({ 
  placeholder = "Search for products...", 
  onSearch, 
  suggestions = [], 
  recentSearches = [], 
  className, 
  ...props 
}: SearchBarProps) {
  const [query, setQuery] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const hasDropdownContent = suggestions.length > 0 || recentSearches.length > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim() && onSearch) {
      onSearch(query.trim())
      setOpen(false)
    }
  }

  const handleSelect = (text: string) => {
    setQuery(text)
    if (onSearch) onSearch(text)
    setOpen(false)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div 
          className={cn("search-bar group relative max-w-2xl w-full", className)} 
          {...props}
        >
           <form onSubmit={handleSubmit} className="flex relative w-full h-12">
             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none group-focus-within:text-brand transition-colors">
               <Search className="w-5 h-5" />
             </div>
             <input
               ref={inputRef}
               type="text"
               className="w-full h-full bg-transparent pl-12 pr-14 text-sm outline-none placeholder:text-muted-foreground"
               placeholder={placeholder}
               value={query}
               onChange={(e) => {
                 setQuery(e.target.value)
                 if (hasDropdownContent) setOpen(true)
               }}
               onFocus={() => {
                 if (hasDropdownContent) setOpen(true)
               }}
             />
             
             <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center">
               {query && (
                 <button
                   type="button"
                   onClick={() => { setQuery(''); inputRef.current?.focus(); }}
                   className="p-1 mr-1 text-muted-foreground hover:text-foreground rounded-full"
                 >
                   <X className="w-4 h-4" />
                 </button>
               )}
               <button type="submit" className="search-bar__cta" aria-label="Search">
                 <ArrowRightIcon className="w-4 h-4" />
               </button>
             </div>
           </form>
        </div>
      </PopoverTrigger>
      
      {hasDropdownContent && (
        <PopoverContent 
          className="w-[var(--radix-popover-trigger-width)] p-0 rounded-[20px] overflow-hidden mt-1" 
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
           <div className="flex flex-col py-2">
             {recentSearches.length > 0 && !query && (
               <div className="mb-2">
                 <div className="px-4 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                   Recent Searches
                 </div>
                 {recentSearches.map((item, i) => (
                   <button 
                     key={i} 
                     onClick={() => handleSelect(item)}
                     className="w-full text-left px-4 py-2 text-sm hover:bg-muted/50 flex items-center gap-3"
                   >
                     <Clock className="w-4 h-4 text-muted-foreground/70" />
                     {item}
                   </button>
                 ))}
               </div>
             )}

             {suggestions.length > 0 && (
               <div>
                 <div className="px-4 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                   {query ? 'Suggestions' : 'Trending'}
                 </div>
                 {suggestions.map((item, i) => (
                   <button 
                     key={i} 
                     onClick={() => handleSelect(item)}
                     className="w-full text-left px-4 py-2 text-sm hover:bg-muted/50 flex items-center gap-3"
                   >
                     {query ? <Search className="w-4 h-4 text-muted-foreground/70" /> : <TrendingUp className="w-4 h-4 text-brand/70" />}
                     {item}
                   </button>
                 ))}
               </div>
             )}
           </div>
        </PopoverContent>
      )}
    </Popover>
  )
}

function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

export { SearchBar }
