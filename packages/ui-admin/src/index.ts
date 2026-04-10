// shadcn-style UI components for ecommerce admin
// Atomic design: atoms -> molecules -> organisms -> layouts

// Re-export all base atoms/molecules/organisms from @ecom/ui
export {
  Button,
  buttonVariants,
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  badgeVariants,
  Input,
  Label,
  Textarea,
  Select,
  Checkbox,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Skeleton,
  Separator,
  Tooltip,
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  Pagination,
  ThemeProvider,
  cn,
} from '@ecom/ui'

// Re-export types from @ecom/ui
export type {
  ButtonProps,
  BadgeProps,
  InputProps,
  LabelProps,
  TextareaProps,
  SelectProps,
  CheckboxProps,
} from '@ecom/ui'

// --- Atoms ---
export { Breadcrumb } from './atoms/breadcrumb'
export type { BreadcrumbProps, BreadcrumbItem } from './atoms/breadcrumb'

export { StatCard } from './atoms/stat-card'
export type { StatCardProps } from './atoms/stat-card'

// --- Molecules ---
export { DataTable } from './molecules/data-table'
export type { DataTableProps, ColumnDef, SortDirection } from './molecules/data-table'

// --- Organisms ---
export { Sidebar } from './organisms/sidebar'
export type { SidebarProps, SidebarNavGroup, SidebarNavItem } from './organisms/sidebar'

export { Header, HeaderUserMenu } from './organisms/admin-header'
export type { HeaderProps, HeaderUserMenuProps } from './organisms/admin-header'

// --- Layouts ---
export { AdminLayout } from './layouts/admin-layout'
export type { AdminLayoutProps } from './layouts/admin-layout'
