import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Switch } from '../../lib/shadcn/switch'

const meta: Meta<typeof Switch> = {
  title: 'atoms/Switch',
  component: Switch,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Switch>

export const Default: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- Story render uses hooks for local demo state.
    const [checked, setChecked] = React.useState(false)
    return (
      <div className="flex items-center gap-3">
        <Switch checked={checked} onCheckedChange={setChecked} />
        <span className="text-sm font-medium">Enable notifications</span>
      </div>
    )
  },
}

export const Off: Story = {
  args: {
    checked: false,
  },
}

export const On: Story = {
  args: {
    checked: true,
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-3">
        <Switch size="sm" />
        <span className="text-sm text-muted-foreground">Small</span>
      </div>
      <div className="flex items-center gap-3">
        <Switch size="default" />
        <span className="text-sm text-muted-foreground">Default</span>
      </div>
      <div className="flex items-center gap-3">
        <Switch size="lg" />
        <span className="text-sm text-muted-foreground">Large</span>
      </div>
    </div>
  ),
}

export const Settings: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- Story render uses hooks for local demo state.
    const [settings, setSettings] = React.useState({
      email: true,
      push: false,
      sms: false,
      marketing: false,
    })
    const toggle = (key: string) => {
      setSettings((s) => ({ ...s, [key]: !s[key as keyof typeof s] }))
    }
    return (
      <div className="flex flex-col gap-4 p-5 border rounded-[var(--radius-lg)] max-w-sm">
        <h3 className="text-sm font-semibold">Notification Preferences</h3>
        <div className="flex flex-col gap-3">
          {[
            { key: 'email', label: 'Email notifications', desc: 'Receive order updates via email' },
            { key: 'push', label: 'Push notifications', desc: 'Browser push notifications' },
            { key: 'sms', label: 'SMS alerts', desc: 'Text messages for shipping updates' },
            { key: 'marketing', label: 'Marketing emails', desc: 'Promotions and deal alerts' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{label}</span>
                <span className="text-xs text-muted-foreground">{desc}</span>
              </div>
              <Switch
                checked={settings[key as keyof typeof settings]}
                onCheckedChange={() => {
                  toggle(key)
                }}
              />
            </div>
          ))}
        </div>
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Switch disabled />
      <span className="text-sm text-muted-foreground">Disabled (off)</span>
      <Switch disabled defaultChecked />
      <span className="text-sm text-muted-foreground">Disabled (on)</span>
    </div>
  ),
}
