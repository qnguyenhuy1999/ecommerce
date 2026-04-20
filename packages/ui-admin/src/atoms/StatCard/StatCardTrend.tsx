'use client'

import { useEffect, useState } from 'react'

import { Minus, TrendingDown, TrendingUp } from 'lucide-react'

import { cn } from '@ecom/ui'

interface StatCardTrendProps {
  value: string
  positive: boolean | null
  className?: string
}

function StatCardTrend({ value, positive, className }: StatCardTrendProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center text-[length:var(--text-micro)] font-semibold px-1.5 py-0.5 rounded-[var(--radius-sm)]',
        positive === true
          ? 'bg-[var(--intent-success-muted)] text-[var(--intent-success)]'
          : positive === false
            ? 'bg-[var(--intent-danger-muted)] text-[var(--intent-danger)]'
            : 'bg-muted text-muted-foreground',
        className,
      )}
    >
      {positive === true ? (
        <TrendingUp className="w-3 h-3 mr-1" />
      ) : positive === false ? (
        <TrendingDown className="w-3 h-3 mr-1" />
      ) : (
        <Minus className="w-3 h-3 mr-1" />
      )}
      {value}
    </span>
  )
}

interface NumberCounterProps {
  value: string | number
  duration?: number
}

function NumberCounter({ value, duration = 1000 }: NumberCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)

  const stringVal = String(value)
  const isNumeric = /^[\d.,$€£]+$/.test(stringVal)
  const numericVal = isNumeric ? parseFloat(stringVal.replace(/[^\d.-]/g, '')) : NaN

  useEffect(() => {
    if (isNaN(numericVal)) return

    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      const easeProgress = 1 - Math.pow(1 - progress, 3)

      setDisplayValue(numericVal * easeProgress)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [numericVal, duration])

  if (isNaN(numericVal)) return <>{value}</>

  const formatted = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: stringVal.includes('.') ? 2 : 0,
  }).format(displayValue)

  const prefix = stringVal.match(/^[^\d]+/)?.[0] ?? ''
  const suffix = stringVal.match(/[^\d]+$/)?.[0] ?? ''

  return (
    <>
      {prefix}
      {formatted}
      {suffix}
    </>
  )
}

export { StatCardTrend, NumberCounter }
