import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { FileUpload } from './index'

const meta: Meta<typeof FileUpload> = {
  title: 'ui-admin/molecules/FileUpload',
  component: FileUpload,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FileUpload>

export const Default: Story = {
  args: {
    accept: 'image/*',
    maxSize: 10485760,
  },
}

export const MultipleFiles: Story = {
  args: {
    accept: 'image/*,.pdf,.doc,.docx',
    maxSize: 20971520,
    multiple: true,
  },
}

export const DocumentUpload: Story = {
  args: {
    accept: '.pdf,.doc,.docx,.xls,.xlsx',
    maxSize: 52428800,
    multiple: true,
  },
}

export const Disabled: Story = {
  args: {
    accept: 'image/*',
    maxSize: 10485760,
    disabled: true,
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-6 max-w-lg">
      <div>
        <p className="text-sm font-medium mb-2 text-foreground">Image Upload (Single)</p>
        <FileUpload accept="image/*" />
      </div>
      <div>
        <p className="text-sm font-medium mb-2 text-foreground">Documents (Multi)</p>
        <FileUpload accept=".pdf,.doc,.docx" multiple maxSize={52428800} />
      </div>
    </div>
  ),
}
