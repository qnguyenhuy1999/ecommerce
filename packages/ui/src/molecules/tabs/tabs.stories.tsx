import type { Meta, StoryObj } from '@storybook/react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './index'

const meta = {
  title: 'Molecules/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default = () => (
  <Tabs defaultValue="tab1" className="w-[400px]">
    <TabsList>
      <TabsTrigger value="tab1">Overview</TabsTrigger>
      <TabsTrigger value="tab2">Analytics</TabsTrigger>
      <TabsTrigger value="tab3">Settings</TabsTrigger>
    </TabsList>
    <TabsContent value="tab1">
      <p className="p-4 text-sm">Overview tab content — see what's happening at a glance.</p>
    </TabsContent>
    <TabsContent value="tab2">
      <p className="p-4 text-sm">Analytics tab content — track your metrics and performance.</p>
    </TabsContent>
    <TabsContent value="tab3">
      <p className="p-4 text-sm">Settings tab content — configure your preferences.</p>
    </TabsContent>
  </Tabs>
)

export const TwoTabs = () => (
  <Tabs defaultValue="account" className="w-[400px]">
    <TabsList>
      <TabsTrigger value="account">Account</TabsTrigger>
      <TabsTrigger value="password">Password</TabsTrigger>
    </TabsList>
    <TabsContent value="account">
      <p className="p-4 text-sm">Manage your account settings and preferences.</p>
    </TabsContent>
    <TabsContent value="password">
      <p className="p-4 text-sm">Change your password and security settings.</p>
    </TabsContent>
  </Tabs>
)
