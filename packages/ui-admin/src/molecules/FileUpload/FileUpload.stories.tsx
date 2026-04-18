import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { FileUpload } from './FileUpload'

const meta: Meta<typeof FileUpload> = {
  title: 'molecules/FileUpload',
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

export const WithProgress: Story = {
  args: {
    accept: 'image/*,.pdf',
    multiple: true,
    upload: async (_file, { onProgress, signal }) => {
      await new Promise<void>((resolve, reject) => {
        let progress = 0
        const interval = setInterval(() => {
          if (signal.aborted) {
            clearInterval(interval)
            reject(new DOMException('Aborted', 'AbortError'))
            return
          }

          progress += 8
          onProgress(progress)

          if (progress >= 100) {
            clearInterval(interval)
            setTimeout(resolve, 200)
          }
        }, 120)
      })
    },
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
