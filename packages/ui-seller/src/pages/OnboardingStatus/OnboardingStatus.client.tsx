'use client'

import { Button } from '@ecom/core-ui/atoms/Button'

interface OnboardingStatusActionButtonProps {
  label: string
  onPrimaryAction: () => void
}

export function OnboardingStatusActionButton({
  label,
  onPrimaryAction,
}: OnboardingStatusActionButtonProps) {
  return (
    <Button variant="outline" size="lg" onClick={onPrimaryAction} className="min-w-40">
      {label}
    </Button>
  )
}
