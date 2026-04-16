import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from './index'
import { Badge } from '../badge'

const meta: Meta<typeof Table> = {
  title: 'atoms/Table',
  component: Table,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Table>

const products = [
  { id: 'PRD-001', name: 'Wireless Headphones Pro', category: 'Audio', price: '$249.99', stock: 142, status: 'Active' },
  {
    id: 'PRD-002',
    name: 'Mechanical Gaming Keyboard',
    category: 'Peripherals',
    price: '$189.00',
    stock: 58,
    status: 'Active',
  },
  {
    id: 'PRD-003',
    name: 'USB-C Hub 7-in-1',
    category: 'Accessories',
    price: '$49.99',
    stock: 0,
    status: 'Out of Stock',
  },
  { id: 'PRD-004', name: '4K Webcam AutoFocus', category: 'Video', price: '$129.00', stock: 31, status: 'Low Stock' },
]

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>Recent product inventory</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Product ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((p) => (
          <TableRow key={p.id}>
            <TableCell className="font-mono text-xs text-muted-foreground">{p.id}</TableCell>
            <TableCell className="font-medium">{p.name}</TableCell>
            <TableCell>{p.category}</TableCell>
            <TableCell className="font-medium">{p.price}</TableCell>
            <TableCell>
              <Badge variant={p.stock === 0 ? 'out-of-stock' : p.stock < 50 ? 'warning' : 'success'} size="sm">
                {p.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}

export const WithFooter: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead className="text-right">Qty</TableHead>
          <TableHead className="text-right">Unit Price</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Premium Headphones</TableCell>
          <TableCell className="text-right">1</TableCell>
          <TableCell className="text-right">$249.99</TableCell>
          <TableCell className="text-right font-medium">$249.99</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>USB-C Hub</TableCell>
          <TableCell className="text-right">2</TableCell>
          <TableCell className="text-right">$49.99</TableCell>
          <TableCell className="text-right font-medium">$99.98</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3} className="text-right font-semibold">
            Order Total
          </TableCell>
          <TableCell className="text-right font-semibold">$349.97</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
}

export const SelectableRows: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [selected, setSelected] = React.useState<string[]>([])
    const toggle = (id: string) => { setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])) }
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-input accent-brand"
                checked={selected.length === products.length}
                onChange={() => {
                  if (selected.length === products.length) {
                    setSelected([])
                  } else {
                    setSelected(products.map((p) => p.id))
                  }
                }}
              />
            </TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((p) => (
            <TableRow key={p.id}>
              <TableCell>
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-input accent-brand"
                  checked={selected.includes(p.id)}
                  onChange={() => { toggle(p.id) }}
                />
              </TableCell>
              <TableCell className="font-medium">{p.name}</TableCell>
              <TableCell>{p.category}</TableCell>
              <TableCell className="font-medium">{p.price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  },
}
