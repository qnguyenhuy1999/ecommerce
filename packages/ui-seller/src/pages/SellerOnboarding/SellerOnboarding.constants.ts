import type { SellerOnboardingStepIndex } from './SellerOnboarding.types'

export const SELLER_ONBOARDING_MAX_STEP = 4

export const SELLER_ONBOARDING_STEP_SEQUENCE: SellerOnboardingStepIndex[] = [1, 2, 3, 4]

export const SELLER_ONBOARDING_ERRORS = {
  saveExit: 'Unable to save your progress right now. Please try again.',
  submit: 'Unable to submit your onboarding right now. Please try again.',
} as const
