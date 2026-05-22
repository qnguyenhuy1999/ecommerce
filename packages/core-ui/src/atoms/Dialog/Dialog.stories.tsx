import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '../Button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '.'

const meta: Meta<typeof Dialog> = {
  title: 'atoms/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
}

export default meta

type Story = StoryObj<typeof Dialog>

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Archive product</DialogTitle>
          <DialogDescription>Archived products stay in records and can be restored later.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Archive</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}
