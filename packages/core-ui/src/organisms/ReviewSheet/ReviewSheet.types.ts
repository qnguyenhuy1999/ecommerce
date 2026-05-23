import type { ReactNode } from 'react'

export interface ReviewSheetProps {
  open: boolean
  onOpenChange: (value: boolean) => void
  title: ReactNode
  subtitle?: ReactNode
  footer?: ReactNode
  children: ReactNode
  className?: string
}
