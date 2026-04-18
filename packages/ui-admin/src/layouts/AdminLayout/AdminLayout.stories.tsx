import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import {
  LayoutDashboard,
  BarChart3,
  Package,
  Tags,
  ShoppingCart,
  Users,
  Settings,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Truck,
  Box,
  CreditCard,
  Plus,
} from 'lucide-react'

import { Button } from '@ecom/ui'
import { AdminLayout } from './AdminLayout'
import { Sidebar } from '../../organisms/Sidebar/Sidebar'
import { Header, HeaderUserMenu } from '../../organisms/AdminHeader/AdminHeader'
import { StatCard } from '../../atoms/StatCard/StatCard'
import { MetricCard } from '../../atoms/MetricCard/MetricCard'
import { StatusBadge } from '../../atoms/StatusBadge/StatusBadge'
import { OrderTimeline } from '../../molecules/OrderTimeline/OrderTimeline'
import { FormField } from '../../molecules/FormField/FormField'
import { FileUpload } from '../../molecules/FileUpload/FileUpload'
import {
  DataTable,
  DataTableHeader,
  DataTableColumn,
  DataTableBody,
  DataTableRow,
  DataTableCell,
} from '../../molecules/DataTable/DataTable'
import { ActivityFeed } from '../../organisms/ActivityFeed/ActivityFeed'
import { RevenueChart } from '../../organisms/RevenueChart/RevenueChart'
import { CommandPalette } from '../../organisms/CommandPalette/CommandPalette'

const meta: Meta<typeof AdminLayout> = {
  title: 'layouts/AdminLayout',
  component: AdminLayout,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof AdminLayout>

const SIDEBAR_NAV = [
  {
    label: 'DASHBOARD',
    items: [
      { label: 'Overview', href: '#overview', icon: <LayoutDashboard className="w-4 h-4" />, isActive: true },
      { label: 'Analytics', href: '#analytics', icon: <BarChart3 className="w-4 h-4" /> },
    ],
  },
  {
    label: 'CATALOG',
    items: [
      { label: 'Products', href: '#products', icon: <Package className="w-4 h-4" />, badge: '24' },
      { label: 'Categories', href: '#categories', icon: <Tags className="w-4 h-4" /> },
    ],
  },
  {
    label: 'SALES',
    items: [
      { label: 'Orders', href: '#orders', icon: <ShoppingCart className="w-4 h-4" /> },
      { label: 'Customers', href: '#customers', icon: <Users className="w-4 h-4" /> },
    ],
  },
  {
    label: 'SETTINGS',
    items: [{ label: 'General', href: '#settings', icon: <Settings className="w-4 h-4" /> }],
  },
]

const recentOrders = [
  {
    id: 'ORD-8847',
    customer: 'Sarah Johnson',
    date: '2 hours ago',
    amount: 149.99,
    status: 'delivered' as const,
  },
  {
    id: 'ORD-8846',
    customer: 'Michael Chen',
    date: '5 hours ago',
    amount: 89.5,
    status: 'processing' as const,
  },
  { id: 'ORD-8845', customer: 'Emily Davis', date: '1 day ago', amount: 234.0, status: 'pending' as const },
]

function FullDashboard() {
  const [commandsOpen, setCommandsOpen] = useState(false)

  return (
    <>
      <AdminLayout
        sidebar={
          <Sidebar
            logo={
              <div className="flex items-center gap-2 px-6 py-4">
                <Box className="w-6 h-6 text-primary" />
                <span className="font-bold text-lg">ECOM</span>
              </div>
            }
            navGroups={SIDEBAR_NAV}
          />
        }
        header={
          <Header
            title="Dashboard Overview"
            subtitle="Here's what's happening with your store today."
            actions={<HeaderUserMenu userName="Admin User" userEmail="admin@ecom.internal" />}
          />
        }>
        <div className="space-y-6">
          {/* STATS (Atoms) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              label="Total Revenue"
              value="$48,750"
              trend={{ value: '12.5%', positive: true }}
              icon={<DollarSign className="w-5 h-5" />}
            />
            <StatCard
              label="Total Orders"
              value="1,284"
              trend={{ value: '8.2%', positive: true }}
              icon={<ShoppingCart className="w-5 h-5" />}
            />
            <MetricCard
              label="Active Users"
              value={3892}
              previousValue={3500}
              format="number"
              icon={<Users className="w-5 h-5" />}
            />
            <MetricCard
              label="Avg Order Value"
              value={37.97}
              previousValue={39.0}
              format="currency"
              icon={<TrendingUp className="w-5 h-5" />}
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* CHARTS & DATATABLE (Organisms & Molecules) */}
            <div className="xl:col-span-2 space-y-6">
              <RevenueChart
                data={[
                  { date: 'Mon', revenue: 400 },
                  { date: 'Tue', revenue: 300 },
                  { date: 'Wed', revenue: 550 },
                  { date: 'Thu', revenue: 450 },
                  { date: 'Fri', revenue: 700 },
                ]}
              />

              <DataTable>
                <DataTableHeader>
                  <DataTableColumn>Order ID</DataTableColumn>
                  <DataTableColumn>Customer</DataTableColumn>
                  <DataTableColumn>Status</DataTableColumn>
                  <DataTableColumn align="right">Amount</DataTableColumn>
                </DataTableHeader>
                <DataTableBody>
                  {recentOrders.map((order) => (
                    <DataTableRow key={order.id}>
                      <DataTableCell className="font-medium">{order.id}</DataTableCell>
                      <DataTableCell>{order.customer}</DataTableCell>
                      <DataTableCell>
                        <StatusBadge status={order.status} />
                      </DataTableCell>
                      <DataTableCell align="right">${order.amount.toFixed(2)}</DataTableCell>
                    </DataTableRow>
                  ))}
                </DataTableBody>
              </DataTable>
            </div>

            {/* SIDE PANELS (Molecules & Organisms) */}
            <div className="space-y-6">
              <div className="bg-background p-6 rounded-2xl border border-border">
                <h3 className="font-semibold mb-4">Order Status Example</h3>
                <OrderTimeline
                  steps={[
                    { label: 'Order Placed', status: 'completed', icon: <ShoppingCart /> },
                    { label: 'Processing', status: 'completed', icon: <CreditCard /> },
                    { label: 'Shipped', status: 'current', icon: <Truck /> },
                    { label: 'Delivered', status: 'upcoming', icon: <CheckCircle /> },
                  ]}
                />
              </div>

              <div className="bg-background p-6 rounded-2xl border border-border">
                <h3 className="font-semibold mb-4">Recent Activity</h3>
                <ActivityFeed
                  items={[
                    {
                      id: '1',
                      user: { name: 'System' },
                      action: 'Product updated',
                      target: 'Nike Shoes price',
                      timestamp: '2 mins ago',
                      isLatest: true,
                    },
                    {
                      id: '2',
                      user: { name: 'Alice' },
                      action: 'joined',
                      target: 'New Customer',
                      timestamp: '1 hour ago',
                    },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* FORMS & FILE UPLOAD (Molecules) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted p-6 rounded-2xl border border-border">
            <div>
              <h3 className="font-semibold mb-4">Quick Add Product</h3>
              <div className="space-y-4">
                <FormField label="Product Name" hint="Enter the product title">
                  <div className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm">
                    Product Input
                  </div>
                </FormField>
                <Button>Save Product</Button>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product Image</h3>
              <FileUpload />
            </div>
          </div>
        </div>
      </AdminLayout>

      <CommandPalette
        open={commandsOpen}
        onOpenChange={setCommandsOpen}
        groups={[
          {
            heading: 'Actions',
            items: [
              {
                id: '1',
                label: 'Create Product',
                icon: <Plus />,
                onSelect: () => setCommandsOpen(false),
              },
            ],
          },
        ]}
      />
    </>
  )
}

export const CombinationDemo: Story = {
  render: () => <FullDashboard />,
}
