import type { LucideIcon } from 'lucide-react'

export type Accent = 'primary' | 'success' | 'info' | 'warning' | 'destructive'

export interface StatSparkPoint {
  x: number
  y: number
}

export interface StatCardProps {
  label: string
  value: string | number
  icon?: LucideIcon
  trend?: number
  spark?: StatSparkPoint[]
  accent?: Accent
  className?: string
  loading?: boolean
  description?: string
}

export type StatCardHeader = { label: string; icon?: LucideIcon; accent?: Accent }

export interface StatChartProps {
  spark: StatSparkPoint[]
  accent?: Accent
}
