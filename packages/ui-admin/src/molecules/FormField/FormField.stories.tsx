import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'

import { Input } from '@ecom/ui'
import { cn } from '@ecom/ui/utils'
import { Search, Mail, Eye, EyeOff, DollarSign, AtSign, Hash, User, Lock } from 'lucide-react'

import { FormField } from './FormField'

type Story = StoryObj<typeof FormField>

const meta: Meta<typeof FormField> = {
  title: 'molecules/FormField',
  component: FormField,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Admin-grade form field wrapper providing label, description, validation states, icons, character counting, and more.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Controls the input height and padding',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the entire field',
    },
    required: {
      control: 'boolean',
      description: 'Adds an asterisk to the label',
    },
  },
}

export default meta

const DefaultInput = (props: React.ComponentProps<typeof Input>) => <Input className="w-full" {...props} />

export const Default: Story = {
  name: 'Default',
  render: () => (
    <div className="max-w-md space-y-8">
      <FormField
        label="Product Name"
        htmlFor="default-name"
        description="Enter a unique name for your product."
        required>
        <DefaultInput id="default-name" placeholder="Wireless Headphones Pro" />
      </FormField>
    </div>
  ),
}

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => {
    function VariantDemo() {
      const [showPassword, setShowPassword] = useState(false)
      const [bioLength, setBioLength] = useState(85)

      return (
        <div className="max-w-lg space-y-8 not-prose">
          {/* 1 — Default */}
          <FormField label="Full Name" htmlFor="v-default" description="As it appears on your ID.">
            <DefaultInput id="v-default" placeholder="Placeholder text" />
          </FormField>

          {/* 2 — Required */}
          <FormField label="Email Address" htmlFor="v-required" required>
            <DefaultInput
              id="v-required"
              placeholder="This field is required"
              defaultValue="alex.morgan@company.co"
              prefixIcon={<Mail />}
            />
          </FormField>

          {/* 3 — With Leading Icon */}
          <FormField
            label="Search Products"
            htmlFor="v-search"
            leadingIcon={<Search />}
            description="Search across products, orders, and customers.">
            <DefaultInput id="v-search" placeholder="Search by name, SKU, or category..." />
          </FormField>

          {/* 4 — With Helper Text */}
          <FormField label="Username" htmlFor="v-helper" description="Help users fill this in correctly.">
            <DefaultInput id="v-helper" placeholder="Choose a unique username" prefixIcon={<AtSign />} />
          </FormField>

          {/* 5 — Error State */}
          <FormField label="Email" htmlFor="v-error" error="This is not a valid email address.">
            <DefaultInput id="v-error" placeholder="bad input" prefixIcon={<Mail />} />
          </FormField>

          {/* 6 — Success State */}
          <FormField label="SKU" htmlFor="v-success" success>
            <DefaultInput id="v-success" defaultValue="Validated value" prefixIcon={<Hash />} />
          </FormField>

          {/* 7 — Success with message */}
          <FormField label="Discount Code" htmlFor="v-success-msg" success="Code verified and applied.">
            <DefaultInput id="v-success-msg" defaultValue="SAVE20" prefixIcon={<DollarSign />} />
          </FormField>

          {/* 8 — Character Counter */}
          <FormField
            label="Product Description"
            htmlFor="v-charcount"
            characterCount={{ current: bioLength, max: 200, warnAt: 0.8 }}
            description="Describe the product in detail.">
            <DefaultInput
              id="v-charcount"
              placeholder="Type up to 200 characters..."
              value={
                bioLength > 0
                  ? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.'
                  : ''
              }
              onChange={(e) => setBioLength(e.target.value.length)}
            />
          </FormField>

          {/* 9 — Password with toggle */}
          <FormField
            label="Password"
            htmlFor="v-password"
            description="Use 8+ characters with a mix of letters, numbers & symbols."
            leadingIcon={<Lock />}
            required>
            <DefaultInput
              id="v-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              defaultValue="s3cur3P@ss!"
              suffixIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="pointer-events-auto cursor-pointer hover:text-[var(--text-primary)] transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              }
            />
          </FormField>

          {/* 10 — With Prefix */}
          <FormField label="Price" htmlFor="v-prefix" description="Set a competitive price for your product.">
            <DefaultInput id="v-prefix" placeholder="0.00" />
          </FormField>

          {/* 11 — Disabled */}
          <FormField label="Account ID" htmlFor="v-disabled" description="This field is read-only.">
            <DefaultInput id="v-disabled" defaultValue="ACC-0042-X" disabled />
          </FormField>

          {/* 12 — Size: Small */}
          <FormField label="Short Label" htmlFor="v-sm" size="sm" description="Compact form size for dense layouts.">
            <Input id="v-sm" placeholder="Small input" className="w-full" />
          </FormField>

          {/* 13 — Size: Large */}
          <FormField label="Hero Title" htmlFor="v-lg" size="lg" description="Large input for prominent fields.">
            <Input id="v-lg" placeholder="Large input" className="w-full" />
          </FormField>
        </div>
      )
    }
    return <VariantDemo />
  },
}

export const WithLeadingIcon: Story = {
  name: 'With Leading Icon',
  render: () => (
    <div className="max-w-md space-y-6 not-prose">
      <FormField label="Search" htmlFor="search" leadingIcon={<Search />}>
        <DefaultInput id="search" placeholder="Search products, orders, customers..." />
      </FormField>

      <FormField label="Email" htmlFor="email" required>
        <DefaultInput id="email" type="email" placeholder="you@company.com" prefixIcon={<Mail />} />
      </FormField>

      <FormField label="Username" htmlFor="username">
        <DefaultInput id="username" placeholder="your_handle" prefixIcon={<User />} />
      </FormField>
    </div>
  ),
}

export const ValidationStates: Story = {
  name: 'Validation States',
  render: () => (
    <div className="max-w-md space-y-6 not-prose">
      {/* Error */}
      <FormField label="Email" htmlFor="val-email" error="Please enter a valid email address.">
        <DefaultInput id="val-email" placeholder="user@example.com" prefixIcon={<Mail />} />
      </FormField>

      {/* Success */}
      <FormField label="Username" htmlFor="val-username" success>
        <DefaultInput id="val-username" defaultValue="alex_morgan" prefixIcon={<User />} />
      </FormField>

      {/* Success with message */}
      <FormField label="Coupon Code" htmlFor="val-coupon" success="25% discount applied successfully.">
        <DefaultInput id="val-coupon" defaultValue="SUMMER25" prefixIcon={<DollarSign />} />
      </FormField>

      {/* Warning */}
      <FormField label="Inventory Stock" htmlFor="val-warning" description="Stock is running low. Consider restocking.">
        <DefaultInput id="val-warning" defaultValue="12 units" className="border-[var(--intent-warning)]" />
      </FormField>
    </div>
  ),
}

export const CharacterCounter: Story = {
  name: 'Character Counter',
  render: () => {
    function CharCountDemo() {
      const [value, setValue] = useState('')
      const max = 280

      return (
        <div className="max-w-md not-prose">
          <FormField
            label="Tweet"
            htmlFor="tweet"
            characterCount={{ current: value.length, max, warnAt: 0.9 }}
            description="Write your thoughts (280 characters max).">
            <textarea
              id="tweet"
              className={cn(
                'flex w-full min-h-[80px] rounded-[var(--radius-sm)]',
                'border border-[var(--border-default)] bg-[var(--surface-base)]',
                'px-3 py-2 text-[length:var(--text-base)] text-[var(--text-primary)]',
                'placeholder:text-[var(--text-secondary)]',
                'transition-[border-color,box-shadow] duration-[var(--motion-fast)]',
                'focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring-color)] focus:ring-offset-2',
                'resize-none',
              )}
              placeholder="What's happening?"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </FormField>
        </div>
      )
    }
    return <CharCountDemo />
  },
}

export const PasswordToggle: Story = {
  name: 'Password Toggle',
  render: () => {
    function PasswordDemo() {
      const [visible, setVisible] = useState(false)

      return (
        <div className="max-w-md space-y-6 not-prose">
          <FormField
            label="Password"
            htmlFor="password"
            description="Must be at least 8 characters."
            leadingIcon={<Lock />}
            required>
            <DefaultInput
              id="password"
              type={visible ? 'text' : 'password'}
              placeholder="Enter password"
              defaultValue="MyS3cur3P@ss!"
              suffixIcon={
                <button
                  type="button"
                  onClick={() => setVisible((v) => !v)}
                  className="pointer-events-auto cursor-pointer hover:text-[var(--text-primary)] transition-colors"
                  aria-label={visible ? 'Hide password' : 'Show password'}>
                  {visible ? <EyeOff /> : <Eye />}
                </button>
              }
            />
          </FormField>
        </div>
      )
    }
    return <PasswordDemo />
  },
}

export const Sizes: Story = {
  name: 'Sizes',
  render: () => (
    <div className="max-w-lg space-y-8 not-prose">
      <FormField label="Compact — sm" htmlFor="size-sm" size="sm">
        <Input id="size-sm" placeholder="Small input" className="w-full" />
      </FormField>

      <FormField label="Default — md" htmlFor="size-md" size="md">
        <DefaultInput id="size-md" placeholder="Medium input (default)" />
      </FormField>

      <FormField label="Spacious — lg" htmlFor="size-lg" size="lg">
        <Input id="size-lg" placeholder="Large input" className="w-full" />
      </FormField>
    </div>
  ),
}

export const Disabled: Story = {
  name: 'Disabled',
  render: () => (
    <div className="max-w-md space-y-6 not-prose">
      <FormField label="Account Owner" htmlFor="disabled-owner" description="This field cannot be edited.">
        <DefaultInput id="disabled-owner" defaultValue="Alex Morgan" disabled />
      </FormField>

      <FormField label="Created At" htmlFor="disabled-date" description="Auto-generated on account creation.">
        <DefaultInput id="disabled-date" defaultValue="March 15, 2025 at 09:42 AM" disabled />
      </FormField>
    </div>
  ),
}

export const InteractiveForm: Story = {
  name: 'Interactive Form',
  render: () => {
    function InteractiveFormDemo() {
      const [form, setForm] = useState({
        name: '',
        email: '',
        username: '',
        password: '',
        bio: '',
      })
      const [showPassword, setShowPassword] = useState(false)
      const [touched, setTouched] = useState<Record<string, boolean>>({})

      const errors: Record<string, string> = {}
      if (touched.name && !form.name.trim()) errors.name = 'Name is required.'
      if (touched.email && !form.email.includes('@')) errors.email = 'Enter a valid email address.'
      if (touched.username && form.username.length < 3) errors.username = 'Username must be at least 3 characters.'
      if (touched.password && form.password.length < 8) errors.password = 'Password must be at least 8 characters.'

      const hasErrors = Object.keys(errors).length > 0

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Mark all as touched
        setTouched({ name: true, email: true, username: true, password: true })
      }

      return (
        <div className="max-w-md not-prose">
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField label="Full Name" htmlFor="if-name" error={errors.name} required>
              <DefaultInput
                id="if-name"
                placeholder="Alex Morgan"
                prefixIcon={<User />}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              />
            </FormField>

            <FormField label="Email Address" htmlFor="if-email" error={errors.email} required>
              <DefaultInput
                id="if-email"
                type="email"
                placeholder="alex@company.co"
                prefixIcon={<Mail />}
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              />
            </FormField>

            <FormField
              label="Username"
              htmlFor="if-username"
              error={errors.username}
              success={touched.username && !errors.username && form.username.length >= 3}>
              <DefaultInput
                id="if-username"
                placeholder="your_handle"
                prefixIcon={<AtSign />}
                value={form.username}
                onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                onBlur={() => setTouched((t) => ({ ...t, username: true }))}
              />
            </FormField>

            <FormField label="Password" htmlFor="if-password" error={errors.password} leadingIcon={<Lock />} required>
              <DefaultInput
                id="if-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                suffixIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="pointer-events-auto cursor-pointer hover:text-[var(--text-primary)] transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                }
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              />
            </FormField>

            <FormField
              label="Bio"
              htmlFor="if-bio"
              characterCount={{ current: form.bio.length, max: 160, warnAt: 0.85 }}
              description="Tell customers a bit about yourself.">
              <DefaultInput
                id="if-bio"
                placeholder="Write a short bio..."
                value={form.bio}
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              />
            </FormField>

            <button
              type="submit"
              className={cn(
                'w-full h-10 px-4',
                'rounded-[var(--radius-sm)]',
                'bg-[var(--action-primary)] text-[var(--action-primary-foreground)]',
                'font-[var(--font-weight-semibold)] text-sm',
                'transition-all duration-[var(--motion-fast)]',
                'hover:brightness-110 active:brightness-90',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color)] focus-visible:ring-offset-2',
                'disabled:opacity-[var(--opacity-40)] disabled:cursor-not-allowed',
                hasErrors && 'opacity-[var(--opacity-60)]',
              )}
              disabled={hasErrors}>
              Create Account
            </button>
          </form>
        </div>
      )
    }
    return <InteractiveFormDemo />
  },
}
