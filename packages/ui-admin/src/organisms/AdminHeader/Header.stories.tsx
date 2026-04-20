import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { Bell, Mail } from 'lucide-react'

import { AdminHeader } from './Header'
import type { AdminHeaderProps } from './Header'

const meta: Meta<typeof AdminHeader> = {
  title: 'organisms/AdminHeader',
  component: AdminHeader,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof AdminHeader>

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-background">
      {/* Render header inside a sticky context */}
      <div className="sticky top-0 z-40">
        {children}
      </div>
      {/* Page placeholder */}
      <div className="p-8 space-y-4">
        <div className="h-24 rounded-xl border bg-background shadow-sm" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-xl border bg-background shadow-sm" />
          ))}
        </div>
      </div>
    </div>
  )
}

export const Default: Story = {
  render: (args) => (
    <Frame>
      <AdminHeader {...args} />
    </Frame>
  ),
  args: {
    search: {
      placeholder: 'Search anything...',
      onChange: (v) => console.log('Search:', v),
      onSearch: (v) => console.log('Submit:', v),
    },
    user: {
      name: 'Marcus George',
      role: 'Admin',
      avatarUrl: 'https://i.pravatar.cc/150?img=12',
    },
    iconButtons: [
      {
        label: 'Messages',
        icon: <Mail className="w-5 h-5" />,
      },
      {
        label: 'Notifications',
        icon: <Bell className="w-5 h-5" />,
        hasNotification: true,
      },
    ],
    onUserClick: () => console.log('User clicked'),
    onSignOut: () => console.log('Sign out'),
  } as Partial<AdminHeaderProps>,
}

export const WithSearchDisabled: Story = {
  render: (args) => (
    <Frame>
      <AdminHeader {...args} />
    </Frame>
  ),
  args: {
    search: false,
    user: {
      name: 'Marcus George',
      role: 'Admin',
    },
    onUserClick: () => console.log('User clicked'),
  } as Partial<AdminHeaderProps>,
}

export const UserOnly: Story = {
  render: (args) => (
    <Frame>
      <AdminHeader {...args} />
    </Frame>
  ),
  args: {
    search: false,
    iconButtons: [],
    user: {
      name: 'Marcus George',
      role: 'Admin',
      avatarUrl: 'https://i.pravatar.cc/150?img=12',
      initials: 'MG',
    },
    onUserClick: () => console.log('User clicked'),
  } as Partial<AdminHeaderProps>,
}

export const NoUser: Story = {
  render: (args) => (
    <Frame>
      <AdminHeader {...args} />
    </Frame>
  ),
  args: {
    search: {
      placeholder: 'Search anything...',
    },
    user: false,
    iconButtons: [
      {
        label: 'Messages',
        icon: <Mail className="w-5 h-5" />,
      },
      {
        label: 'Notifications',
        icon: <Bell className="w-5 h-5" />,
        hasNotification: true,
      },
    ],
  } as Partial<AdminHeaderProps>,
}

export const WithLeading: Story = {
  render: (args) => (
    <Frame>
      <AdminHeader
        {...args}
        leading={
          <button
            type="button"
            className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
        }
      />
    </Frame>
  ),
  args: {
    user: {
      name: 'Marcus George',
      role: 'Admin',
    },
  } as Partial<AdminHeaderProps>,
}

export const WithNotificationBadge: Story = {
  render: (args) => (
    <Frame>
      <AdminHeader {...args} />
    </Frame>
  ),
  args: {
    user: {
      name: 'Marcus George',
      role: 'Admin',
      avatarUrl: 'https://i.pravatar.cc/150?img=12',
    },
    iconButtons: [
      {
        label: 'Messages',
        icon: <Mail className="w-5 h-5" />,
        hasNotification: true,
      },
      {
        label: 'Notifications',
        icon: <Bell className="w-5 h-5" />,
        hasNotification: true,
      },
    ],
  } as Partial<AdminHeaderProps>,
}

export const Minimal: Story = {
  render: (args) => (
    <Frame>
      <AdminHeader {...args} search={false} user={false} />
    </Frame>
  ),
  args: {} as Partial<AdminHeaderProps>,
}
