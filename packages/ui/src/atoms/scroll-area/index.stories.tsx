import type { Meta, StoryObj } from '@storybook/react'
import { ScrollArea } from './index'

const meta: Meta<typeof ScrollArea> = {
  title: 'atoms/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof ScrollArea>

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-48 w-80 rounded-[var(--radius-md)] border p-4">
      <div className="flex flex-col gap-4">
        {[
          'Wireless Noise Cancelling Headphones',
          'Mechanical Gaming Keyboard RGB',
          'Ergonomic Vertical Mouse USB-C',
          '4K Webcam with Auto-Focus',
          'Portable SSD 1TB USB 3.2',
          'Smart Watch Series 8',
          'USB-C Hub 7-in-1',
          'Standing Desk Converter',
          'Monitor Arm Dual Screen',
          'LED Desk Lamp with Wireless Charging',
        ].map((product) => (
          <div key={product} className="flex items-center justify-between border-b pb-3 last:border-b-0">
            <span className="text-sm">{product}</span>
            <span className="text-sm font-medium text-muted-foreground">In Stock</span>
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
}

export const Horizontal: Story = {
  render: () => (
    <ScrollArea orientation="horizontal" className="w-80 rounded-[var(--radius-md)] border p-4">
      <div className="flex gap-3 w-max">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <div
            key={n}
            className="h-24 w-32 shrink-0 rounded-[var(--radius-sm)] bg-muted flex items-center justify-center text-sm font-medium">
            Product {n}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
}

export const Both: Story = {
  render: () => (
    <ScrollArea orientation="both" className="h-48 w-80 rounded-[var(--radius-md)] border p-4">
      <div className="flex flex-col gap-3 w-96">
        {['Category A', 'Category B', 'Category C', 'Category D', 'Category E'].map((cat) => (
          <div key={cat} className="flex items-center gap-3 border-b pb-3 last:border-b-0">
            <div className="h-10 w-10 rounded bg-muted shrink-0" />
            <div>
              <p className="text-sm font-medium">{cat}</p>
              <p className="text-xs text-muted-foreground">12 items</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
}

export const WithMaxHeight: Story = {
  render: () => (
    <ScrollArea maxHeight="200px" className="w-72 rounded-[var(--radius-md)] border p-4">
      <div className="flex flex-col gap-3">
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} className="text-sm py-1 border-b last:border-b-0">
            Notification {i + 1}: New order received from customer
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
}
