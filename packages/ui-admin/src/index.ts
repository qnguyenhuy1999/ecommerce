// shadcn-style UI components for ecommerce
// Atomic design: atoms -> molecules -> organisms -> ...

// Re-export all base atoms/molecules/organisms from @ecom/ui
export {
  Button, buttonVariants,
  Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent,
  Badge, badgeVariants,
  Input,
  Label,
  Textarea,
  Select,
  Checkbox,
  Avatar, AvatarImage, AvatarFallback,
  Skeleton,
  Separator,
  Tooltip,
  Dropdown, DropdownTrigger, DropdownContent, DropdownItem,
  Tabs, TabsList, TabsTrigger, TabsContent,
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter,
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
  Pagination,
  ThemeProvider,
  cn,
} from "@ecom/ui";

// Re-export types
export type {
  ButtonProps,
  BadgeProps,
  InputProps,
  LabelProps,
  TextareaProps,
  SelectProps,
  CheckboxProps,
} from "@ecom/ui";

// Layouts
export { AdminLayout } from "./layouts";
export type { AdminLayoutProps } from "./layouts";

// Admin-specific components
export { Header, HeaderUserMenu } from "./components/header";
export type { HeaderProps, HeaderUserMenuProps } from "./components/header";

export { Sidebar } from "./components/sidebar";
export type { SidebarProps, SidebarNavGroup, SidebarNavItem } from "./components/sidebar";

export { Breadcrumb } from "./components/breadcrumb";
export type { BreadcrumbProps, BreadcrumbItem } from "./components/breadcrumb";

export { StatCard } from "./components/stat-card";
export type { StatCardProps } from "./components/stat-card";

export { DataTable } from "./components/data-table";
export type { DataTableProps, ColumnDef, SortDirection } from "./components/data-table";