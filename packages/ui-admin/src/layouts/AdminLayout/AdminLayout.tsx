import { AdminLayoutContentHeader, type AdminLayoutContentHeaderProps } from './components/AdminLayoutContentHeader'
import { AdminLayoutHeader, type AdminLayoutHeaderProps } from './components/AdminLayoutHeader'
import { AdminLayoutMain, type AdminLayoutMainProps } from './components/AdminLayoutMain'
import { AdminLayoutRoot, type AdminLayoutRootProps } from './components/AdminLayoutRoot'
import { AdminLayoutSidebar, type AdminLayoutSidebarProps } from './components/AdminLayoutSidebar'
import { AdminLayoutTopbar, type AdminLayoutTopbarProps } from './components/AdminLayoutTopbar'

export type { AdminLayoutRootProps as AdminLayoutProps }
export type {
  AdminLayoutSidebarProps,
  AdminLayoutHeaderProps,
  AdminLayoutTopbarProps,
  AdminLayoutContentHeaderProps,
  AdminLayoutMainProps,
}

export type AdminLayoutCompound = typeof AdminLayoutRoot & {
  Sidebar: typeof AdminLayoutSidebar
  Topbar: typeof AdminLayoutTopbar
  Header: typeof AdminLayoutHeader
  ContentHeader: typeof AdminLayoutContentHeader
  Main: typeof AdminLayoutMain
}

const AdminLayout = Object.assign(AdminLayoutRoot, {
  Sidebar: AdminLayoutSidebar,
  Topbar: AdminLayoutTopbar,
  Header: AdminLayoutHeader,
  ContentHeader: AdminLayoutContentHeader,
  Main: AdminLayoutMain,
}) as AdminLayoutCompound

export { AdminLayout }
