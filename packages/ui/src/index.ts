// shadcn-style UI components for ecommerce
// Atomic design: atoms -> molecules -> organisms -> ...

// Atoms
export { Button, buttonVariants } from './atoms/button'
export type { ButtonProps } from './atoms/button'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './atoms/card'

export { Badge, badgeVariants } from './atoms/badge'
export type { BadgeProps } from './atoms/badge'

export { Input } from './atoms/input'
export type { InputProps } from './atoms/input'

export { Label } from './atoms/label'
export type { LabelProps } from './atoms/label'

export { Textarea } from './atoms/textarea'
export type { TextareaProps } from './atoms/textarea'

export { Select } from './atoms/select'
export type { SelectProps } from './atoms/select'

export { Checkbox } from './atoms/checkbox'
export type { CheckboxProps } from './atoms/checkbox'

export { Avatar, AvatarImage, AvatarFallback } from './atoms/avatar'

export { Skeleton } from './atoms/skeleton'

export { Separator } from './atoms/separator'

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './atoms/tooltip'

// Molecules
export { Dropdown, DropdownTrigger, DropdownContent, DropdownItem } from './molecules/dropdown'

export { Tabs, TabsList, TabsTrigger, TabsContent } from './molecules/tabs'

export {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from './molecules/sheet'

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './molecules/dialog'

// Organisms
export { Pagination } from './organisms/pagination'

// Providers
export { ThemeProvider } from './providers'

// Theme
export { cn } from './lib/utils'
