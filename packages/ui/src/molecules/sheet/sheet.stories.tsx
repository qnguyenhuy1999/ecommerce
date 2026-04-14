import { useState } from 'react'

import type { Meta } from '@storybook/react'


import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from './index'
import { Button } from '../../atoms/button/index'

const meta = {
  title: 'Molecules/Sheet',
  component: Sheet,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Sheet>

export default meta

export const Right = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button
        onClick={() => {
          setOpen(true)
        }}
      >
        Open Sheet
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Notifications</SheetTitle>
            <SheetDescription>Manage your notification preferences.</SheetDescription>
          </SheetHeader>
          <div className="py-4 space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 border rounded-md text-sm">
                Notification item {i}
              </div>
            ))}
          </div>
          <SheetFooter>
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false)
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setOpen(false)
              }}
            >
              Save Changes
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}

export const Left = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button
        onClick={() => {
          setOpen(true)
        }}
      >
        Open Left Sheet
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <div className="py-4 space-y-1">
            {['Dashboard', 'Orders', 'Products', 'Settings'].map((item) => (
              <button
                key={item}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-accent rounded-md"
              >
                {item}
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

export const Bottom = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button
        onClick={() => {
          setOpen(true)
        }}
      >
        Open Bottom Sheet
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>Quick Actions</SheetTitle>
          </SheetHeader>
          <div className="py-4 grid grid-cols-3 gap-4">
            {['Share', 'Copy Link', 'Edit', 'Delete'].map((action) => (
              <button
                key={action}
                className="p-4 border rounded-md text-sm text-center hover:bg-accent"
              >
                {action}
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
