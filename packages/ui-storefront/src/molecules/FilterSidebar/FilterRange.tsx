'use client'

import React, { useState, useEffect } from 'react'
import { Slider, Input } from '@ecom/ui'

interface FilterRangeProps {
  min: number
  max: number
  step: number
  current: [number, number]
  onChange: (value: [number, number]) => void
}

export function FilterRange({ min, max, step, current, onChange }: FilterRangeProps) {
  const [localMin, setLocalMin] = useState<string>(current[0].toString())
  const [localMax, setLocalMax] = useState<string>(current[1].toString())

  useEffect(() => {
    setLocalMin(current[0].toString())
    setLocalMax(current[1].toString())
  }, [current])

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalMin(e.target.value)
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalMax(e.target.value)
  }

  const handleMinBlur = () => {
    let parsed = Number(localMin)
    if (isNaN(parsed)) parsed = min
    const newMin = Math.max(min, Math.min(parsed, current[1]))
    setLocalMin(newMin.toString())
    if (newMin !== current[0]) {
      onChange([newMin, current[1]])
    }
  }

  const handleMaxBlur = () => {
    let parsed = Number(localMax)
    if (isNaN(parsed)) parsed = max
    const newMax = Math.min(max, Math.max(parsed, current[0]))
    setLocalMax(newMax.toString())
    if (newMax !== current[1]) {
      onChange([current[0], newMax])
    }
  }

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
      <div className="flex items-center justify-between mt-5 gap-3">
        <div className="flex flex-col gap-1 w-full">
          <span className="text-[length:var(--text-micro)] text-[var(--text-tertiary)] font-medium uppercase tracking-wider">
            Min
          </span>
          <Input
            type="number"
            size="sm"
            min={min}
            max={current[1]}
            step={step}
            value={localMin}
            onChange={handleMinChange}
            onBlur={handleMinBlur}
            prefixIcon={<span className="text-muted-foreground">$</span>}
          />
        </div>
        <div className="h-px w-3 bg-[var(--border-default)] shrink-0 mt-5" />
        <div className="flex flex-col gap-1 w-full text-right">
          <span className="text-[length:var(--text-micro)] text-[var(--text-tertiary)] font-medium uppercase tracking-wider">
            Max
          </span>
          <Input
            type="number"
            size="sm"
            min={current[0]}
            max={max}
            step={step}
            value={localMax}
            onChange={handleMaxChange}
            onBlur={handleMaxBlur}
            prefixIcon={<span className="text-muted-foreground">$</span>}
            className="text-right"
          />
        </div>
      </div>
    </div>
  )
}
