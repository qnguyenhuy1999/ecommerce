import type { Meta, StoryObj } from '@storybook/react'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '../../components/ui/tooltip'
import { IconButton } from '../IconButton/IconButton'
import { Search, Bookmark, Bell, Settings } from 'lucide-react'

const meta: Meta<typeof Tooltip> = {
  title: 'atoms/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="text-sm border rounded px-3 py-1.5 hover:bg-accent">Hover me</button>
        </TooltipTrigger>
        <TooltipContent>Tooltip content</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
}

export const IconButtons: Story = {
  render: () => (
    <TooltipProvider>
      <div className="flex items-center gap-2 p-4 border rounded-[var(--radius-lg)]">
        <Tooltip>
          <TooltipTrigger asChild>
            <IconButton icon={<Search />} label="Search" variant="outline" />
          </TooltipTrigger>
          <TooltipContent>Search products</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <IconButton icon={<Bookmark />} label="Save" variant="outline" />
          </TooltipTrigger>
          <TooltipContent>Save to wishlist</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <IconButton icon={<Bell />} label="Notifications" variant="outline" />
          </TooltipTrigger>
          <TooltipContent>Notifications (3 new)</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <IconButton icon={<Settings />} label="Settings" variant="outline" />
          </TooltipTrigger>
          <TooltipContent>Account settings</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
}

export const AllPositions: Story = {
  render: () => (
    <TooltipProvider>
      <div className="flex items-center gap-8 p-8">
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="text-xs border rounded px-2 py-1">Top</button>
          </TooltipTrigger>
          <TooltipContent side="top">Tooltip on top</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="text-xs border rounded px-2 py-1">Bottom</button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Tooltip on bottom</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="text-xs border rounded px-2 py-1">Left</button>
          </TooltipTrigger>
          <TooltipContent side="left">Tooltip on left</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="text-xs border rounded px-2 py-1">Right</button>
          </TooltipTrigger>
          <TooltipContent side="right">Tooltip on right</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
}

export const WithKeyboardShortcut: Story = {
  render: () => (
    <TooltipProvider>
      <div className="flex items-center gap-4 p-4 border rounded-[var(--radius-lg)]">
        <Tooltip>
          <TooltipTrigger asChild>
            <IconButton icon={<Search />} label="Search" variant="ghost" />
          </TooltipTrigger>
          <TooltipContent className="flex items-center gap-2">
            Search <kbd className="ml-2 text-xs bg-muted px-1.5 py-0.5 rounded border">⌘K</kbd>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <IconButton icon={<Settings />} label="Settings" variant="ghost" />
          </TooltipTrigger>
          <TooltipContent className="flex items-center gap-2">
            Settings <kbd className="ml-2 text-xs bg-muted px-1.5 py-0.5 rounded border">⌘,</kbd>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
}
