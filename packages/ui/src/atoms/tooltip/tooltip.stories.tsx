import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '../button/index'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './index'

const meta = {
  title: 'Atoms/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <TooltipProvider>{children}</TooltipProvider>
)

export const Default = {
  render: () => (
    <Wrapper>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>This is a tooltip</p>
        </TooltipContent>
      </Tooltip>
    </Wrapper>
  ),
}

export const Top = {
  render: () => (
    <Wrapper>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Top tooltip</Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Tooltip on top</p>
        </TooltipContent>
      </Tooltip>
    </Wrapper>
  ),
}

export const Bottom = {
  render: () => (
    <Wrapper>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Bottom tooltip</Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Tooltip on bottom</p>
        </TooltipContent>
      </Tooltip>
    </Wrapper>
  ),
}

export const Multiple = {
  render: () => (
    <Wrapper>
      <div className="flex gap-4">
        {['Top', 'Right', 'Bottom', 'Left'].map((side) => (
          <Tooltip key={side}>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">
                {side}
              </Button>
            </TooltipTrigger>
            <TooltipContent side={side.toLowerCase() as 'top' | 'right' | 'bottom' | 'left'}>
              <p>{side} tooltip</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </Wrapper>
  ),
}
