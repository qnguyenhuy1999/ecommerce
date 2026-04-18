import type { Meta, StoryObj } from '@storybook/react'

import { Kbd } from './Kbd'

const meta: Meta<typeof Kbd> = {
  title: 'atoms/Kbd',
  component: Kbd,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof Kbd>

export const Default: Story = {
  args: {
    children: 'K',
  },
}

export const SingleKeys: Story = {
  render: () => (
    <div className="flex gap-2">
      <Kbd>A</Kbd>
      <Kbd>B</Kbd>
      <Kbd>C</Kbd>
      <Kbd>Enter</Kbd>
      <Kbd>Space</Kbd>
      <Kbd>Tab</Kbd>
      <Kbd>Esc</Kbd>
      <Kbd>Delete</Kbd>
    </div>
  ),
}

export const KeyCombos: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Command palette:</span>
        <Kbd keys={['⌘', 'K']} />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Quick search:</span>
        <Kbd keys={['⌘', 'Shift', 'P']} />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Save file:</span>
        <Kbd keys={['⌘', 'S']} />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Find & replace:</span>
        <Kbd keys={['⌘', 'F']} />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Undo:</span>
        <Kbd keys={['⌘', 'Z']} />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Select all:</span>
        <Kbd keys={['⌘', 'A']} />
      </div>
    </div>
  ),
}

export const InContext: Story = {
  render: () => (
    <div className="flex flex-col gap-3 max-w-sm">
      <div className="flex items-center justify-between p-3 border border-border rounded-md">
        <span className="text-sm">Open command palette</span>
        <Kbd keys={['⌘', 'K']} />
      </div>
      <div className="flex items-center justify-between p-3 border border-border rounded-md">
        <span className="text-sm">Toggle dark mode</span>
        <Kbd keys={['⌘', 'Shift', 'D']} />
      </div>
      <div className="flex items-center justify-between p-3 border border-border rounded-md">
        <span className="text-sm">Quick switch window</span>
        <Kbd keys={['⌘', 'Tab']} />
      </div>
    </div>
  ),
}
