'use client'

import { useRef, useState } from 'react'
import { useForm, zodResolver, type UseFormReturn } from '@ecom/core-ui'
import { useControllableState } from '../../hooks'
import {
  SELLER_ONBOARDING_ERRORS,
  SELLER_ONBOARDING_MAX_STEP,
  SELLER_ONBOARDING_STEP_SEQUENCE,
} from './SellerOnboarding.constants'
import { sellerOnboardingSchema } from './SellerOnboarding.schema'
import type {
  SellerOnboardingDocumentKey,
  SellerOnboardingDocumentSlot,
  SellerOnboardingFormValues,
  SellerOnboardingProps,
  SellerOnboardingStepIndex,
} from './SellerOnboarding.types'

interface SellerOnboardingControllerParams {
  defaultStep: SellerOnboardingStepIndex
  currentStep?: SellerOnboardingProps['currentStep']
  onCurrentStepChange?: SellerOnboardingProps['onCurrentStepChange']
  defaultValues: SellerOnboardingFormValues
  documentSlots: SellerOnboardingDocumentSlot[]
  onSaveExit?: SellerOnboardingProps['onSaveExit']
  onSubmit: NonNullable<SellerOnboardingProps['onSubmit']>
}

export interface SellerOnboardingController {
  activeStep: SellerOnboardingStepIndex
  form: UseFormReturn<SellerOnboardingFormValues>
  submitting: boolean
  actionError: string | null
  documentInputRefs: React.RefObject<Record<SellerOnboardingDocumentKey, HTMLInputElement | null>>
  handleBack: () => void
  handleNext: () => void
  handleSaveExit: () => Promise<boolean>
  handleSubmit: () => Promise<boolean>
  updateDocument: (key: SellerOnboardingDocumentKey, fileName: string) => void
}

function isStepIndex(value: number): value is SellerOnboardingStepIndex {
  return SELLER_ONBOARDING_STEP_SEQUENCE.includes(value as SellerOnboardingStepIndex)
}

function getInitialDocumentInputs(
  slots: SellerOnboardingDocumentSlot[],
): Record<SellerOnboardingDocumentKey, HTMLInputElement | null> {
  return slots.reduce(
    (accumulator, slot) => ({
      ...accumulator,
      [slot.key]: null,
    }),
    {
      idFront: null,
      idBack: null,
      selfieWithId: null,
      businessRegistration: null,
    } satisfies Record<SellerOnboardingDocumentKey, HTMLInputElement | null>,
  )
}

export function useSellerOnboardingController({
  defaultStep,
  currentStep,
  onCurrentStepChange,
  defaultValues,
  documentSlots,
  onSaveExit,
  onSubmit,
}: SellerOnboardingControllerParams): SellerOnboardingController {
  const normalizedDefaultStep = isStepIndex(defaultStep) ? defaultStep : 1
  const normalizedCurrentStep =
    currentStep !== undefined && isStepIndex(currentStep) ? currentStep : undefined

  const [activeStep, setActiveStep] = useControllableState({
    defaultValue: normalizedDefaultStep,
    ...(normalizedCurrentStep !== undefined ? { value: normalizedCurrentStep } : {}),
    ...(onCurrentStepChange !== undefined ? { onChange: onCurrentStepChange } : {}),
  })
  const [submitting, setSubmitting] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const documentInputRefs = useRef(getInitialDocumentInputs(documentSlots))

  const form = useForm<SellerOnboardingFormValues>({
    resolver: zodResolver(sellerOnboardingSchema),
    defaultValues,
  })

  const updateDocument = (key: SellerOnboardingDocumentKey, fileName: string) => {
    form.setValue(`kyc.documents.${key}`, fileName)
  }

  const handleNext = () => {
    if (activeStep < SELLER_ONBOARDING_MAX_STEP) {
      setActionError(null)
      setActiveStep((activeStep + 1) as SellerOnboardingStepIndex)
    }
  }

  const handleBack = () => {
    if (activeStep > 1) {
      setActionError(null)
      setActiveStep((activeStep - 1) as SellerOnboardingStepIndex)
    }
  }

  const handleSaveExit = async () => {
    if (!onSaveExit) {
      return true
    }

    setActionError(null)

    try {
      await Promise.resolve(onSaveExit(form.getValues()))
      return true
    } catch {
      setActionError(SELLER_ONBOARDING_ERRORS.saveExit)
      return false
    }
  }

  const handleSubmit = async () => {
    if (submitting) {
      return false
    }

    setSubmitting(true)
    setActionError(null)

    try {
      await Promise.resolve(onSubmit(form.getValues()))
      return true
    } catch {
      setActionError(SELLER_ONBOARDING_ERRORS.submit)
      return false
    } finally {
      setSubmitting(false)
    }
  }

  return {
    activeStep,
    form,
    submitting,
    actionError,
    documentInputRefs,
    handleBack,
    handleNext,
    handleSaveExit,
    handleSubmit,
    updateDocument,
  }
}
