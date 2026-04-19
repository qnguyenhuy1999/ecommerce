'use client'

// Re-export Radix-backed shadcn sheet components
// shadcn API matches existing: Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter
// shadcn additionally exports: SheetPortal, SheetOverlay, SheetTrigger, SheetClose
export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetPortal,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '../../lib/shadcn/sheet'
