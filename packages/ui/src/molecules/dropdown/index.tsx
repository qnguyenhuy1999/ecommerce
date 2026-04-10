'use client'

// Re-export all Radix-backed shadcn dropdown-menu components
// Existing exports: Dropdown, DropdownTrigger, DropdownContent, DropdownItem
// shadcn exports: DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem
// We re-export under the existing names for backward compatibility
export {
  DropdownMenu as Dropdown,
  DropdownMenuTrigger as DropdownTrigger,
  DropdownMenuContent as DropdownContent,
  DropdownMenuItem as DropdownItem,
} from '../../components/ui/dropdown-menu'
