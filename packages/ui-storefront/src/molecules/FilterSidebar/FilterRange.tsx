'use client'

import { Slider } from '@ecom/ui'

interface FilterRangeProps {
  min: number
  max: number
  step: number
  current: [number, number]
  onChange: (value: [number, number]) => void
}

export function FilterRange({ min, max, step, current, onChange }: FilterRangeProps) {
  return (
    <div className="px-1 space-y-4">
      <Slider
        min={min}
        max={max}
        step={step}
        value={current}
        onChange={(val) => {
          onChange(val as [number, number])
        }}
        formatLabel={(val) => `$${val}`}
      />
      <div className="flex items-center justify-between mt-5">
        <div className="flex flex-col gap-1">
          <span className="text-[length:var(--text-micro)] text-[var(--text-tertiary)] font-medium uppercase tracking-wider">
            Min
          </span>
          <span className="text-[var(--text-sm)] font-semibold text-[var(--text-primary)]">
            ${current[0]}
          </span>
        </div>
        <div className="h-px w-8 bg-[var(--border-default)]" />
        <div className="flex flex-col gap-1 text-right">
          <span className="text-[length:var(--text-micro)] text-[var(--text-tertiary)] font-medium uppercase tracking-wider">
            Max
          </span>
          <span className="text-[var(--text-sm)] font-semibold text-[var(--text-primary)]">
            ${current[1]}
          </span>
        </div>
      </div>
    </div>
  )
}
