'use client'

import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  Typography,
  type UseFormReturn,
} from '@ecom/core-ui'
import { ArrowLeft, ArrowRight, Check, Upload } from 'lucide-react'
import { useMemo } from 'react'
import { SectionCard } from '../../atoms/SectionCard'
import { SELLER_ONBOARDING_MAX_STEP } from './SellerOnboarding.constants'
import { useSellerOnboardingController } from './SellerOnboarding.controller'
import type {
  SellerOnboardingDocumentKey,
  SellerOnboardingDocumentSlot,
  SellerOnboardingFormValues,
  SellerOnboardingProps,
  SellerOnboardingStepIndex,
} from './SellerOnboarding.types'
import type { SellerOnboardingController } from './SellerOnboarding.controller'

interface SellerOnboardingHeaderClientProps {
  title: string
  saveExitLabel: string
  saveExitHref?: string
  onSaveExit?: SellerOnboardingProps['onSaveExit']
}

function maskPassword(password: string) {
  return '*'.repeat(Math.max(password.length, 6))
}

function maskIdNumber(value: string) {
  const trimmed = value.trim()

  if (trimmed.length <= 4) {
    return trimmed
  }

  return `** ${trimmed.slice(-4)}`
}

function maskAccountNumber(value: string) {
  const digits = value.replace(/\s+/g, '')

  if (digits.length <= 4) {
    return digits
  }

  return `** ${digits.slice(-4)}`
}

function getReviewItems(values: SellerOnboardingFormValues) {
  return [
    {
      label: 'Account',
      value: `${values.account.email} * ${values.account.mobileNumber}`,
    },
    {
      label: 'Shop',
      value: `${values.shop.shopName} * ${values.shop.category} * ${values.shop.country}`,
    },
    {
      label: 'KYC',
      value: `${values.kyc.businessType} * ${values.kyc.idType} * ${Object.values(values.kyc.documents).filter(Boolean).length} documents uploaded`,
    },
    {
      label: 'Bank',
      value: `${values.kyc.bankName} * ${maskAccountNumber(values.kyc.accountNumber)} * ${values.kyc.accountHolder}`,
    },
  ]
}

function SellerOnboardingStepRail({
  currentStep,
  stepLabels,
}: {
  currentStep: SellerOnboardingStepIndex
  stepLabels: [string, string, string, string]
}) {
  return (
    <div className="flex items-center gap-3 overflow-x-auto px-1">
      {stepLabels.map((label, index) => {
        const stepNumber = (index + 1) as SellerOnboardingStepIndex
        const status =
          stepNumber < currentStep ? 'completed' : stepNumber === currentStep ? 'active' : 'pending'

        return (
          <div key={label} className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex shrink-0 items-center gap-3">
              <span
                className={[
                  'flex size-8 items-center justify-center rounded-full border text-sm font-semibold',
                  status === 'active' && 'border-primary bg-primary text-primary-foreground',
                  status === 'completed' && 'border-emerald-600 bg-emerald-600 text-white',
                  status === 'pending' && 'border-border bg-background text-muted-foreground',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {status === 'completed' ? <Check className="size-4" /> : stepNumber}
              </span>
              <span
                className={[
                  'text-sm font-medium whitespace-nowrap',
                  status === 'pending' ? 'text-muted-foreground' : 'text-foreground',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {label}
              </span>
            </div>

            {index < stepLabels.length - 1 ? (
              <span
                className={[
                  'h-px min-w-12 flex-1',
                  stepNumber < currentStep ? 'bg-emerald-600' : 'bg-border',
                ]
                  .filter(Boolean)
                  .join(' ')}
              />
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

function DocumentUploadSlot({
  label,
  fileName,
  onOpen,
  inputRef,
  onFileChange,
}: {
  label: string
  fileName: string
  onOpen: () => void
  inputRef: (node: HTMLInputElement | null) => void
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="border-border hover:border-primary flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed bg-white px-4 py-5 text-center transition-colors"
    >
      <input ref={inputRef} type="file" className="sr-only" onChange={onFileChange} />
      <span className="bg-muted text-muted-foreground mb-5 flex size-10 items-center justify-center rounded-full">
        <Upload className="size-5" />
      </span>
      <span className="text-sm font-medium">{label}</span>
      <span className="text-muted-foreground mt-2 text-xs">{fileName || 'Upload file'}</span>
    </button>
  )
}

function SellerOnboardingHeader({
  title,
  saveExitLabel,
  saveExitHref,
  onSaveExit,
  onClickSaveExit,
}: SellerOnboardingHeaderClientProps & {
  onClickSaveExit: () => Promise<boolean>
}) {
  return (
    <header className="border-border bg-background border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-full text-sm font-semibold">
            O
          </span>
          <Typography variant="label" as="h1" className="text-lg">
            {title}
          </Typography>
        </div>

        {saveExitHref ? (
          <a
            href={saveExitHref}
            onClick={(event) => {
              if (!onSaveExit) {
                return
              }

              event.preventDefault()
              void (async () => {
                const didSave = await onClickSaveExit()

                if (didSave) {
                  window.location.assign(saveExitHref)
                }
              })()
            }}
            className="text-muted-foreground hover:text-foreground text-sm font-medium"
          >
            {saveExitLabel}
          </a>
        ) : (
          <button
            type="button"
            onClick={() => {
              void onClickSaveExit()
            }}
            className="text-muted-foreground hover:text-foreground text-sm font-medium"
          >
            {saveExitLabel}
          </button>
        )}
      </div>
    </header>
  )
}

function SellerOnboardingAccountStep({
  control,
}: {
  control: UseFormReturn<SellerOnboardingFormValues>['control']
}) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={control}
          name="account.email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="account.mobileNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile number *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={control}
          name="account.password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password *</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormDescription>At least 8 characters with a number</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="account.otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>OTP</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>We sent a 6-digit code</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

function SellerOnboardingShopStep({
  control,
  categoryOptions,
  countryOptions,
}: {
  control: UseFormReturn<SellerOnboardingFormValues>['control']
  categoryOptions: string[]
  countryOptions: string[]
}) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={control}
          name="shop.shopName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shop name *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="shop.shopUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shop URL</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>halomarket.co/shop/{field.value}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={control}
          name="shop.category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary category *</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="shop.country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country *</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {countryOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="shop.pickupAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pickup address *</FormLabel>
            <FormControl>
              <Textarea rows={5} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

function SellerOnboardingKycStep({
  control,
  businessTypeOptions,
  idTypeOptions,
  documentSlots,
  documentInputRefs,
  updateDocument,
}: {
  control: UseFormReturn<SellerOnboardingFormValues>['control']
  businessTypeOptions: string[]
  idTypeOptions: string[]
  documentSlots: SellerOnboardingDocumentSlot[]
  documentInputRefs: React.RefObject<Record<SellerOnboardingDocumentKey, HTMLInputElement | null>>
  updateDocument: SellerOnboardingController['updateDocument']
}) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={control}
          name="kyc.businessType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business type *</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {businessTypeOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="kyc.idType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID type *</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select ID type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {idTypeOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={control}
          name="kyc.legalName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Legal name *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="kyc.idNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID number *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="kyc.documents"
        render={({ field }) => (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {documentSlots.map((slot) => (
              <DocumentUploadSlot
                key={slot.key}
                label={slot.label}
                fileName={field.value[slot.key] ?? ''}
                inputRef={(node) => {
                  documentInputRefs.current[slot.key] = node
                }}
                onOpen={() => documentInputRefs.current[slot.key]?.click()}
                onFileChange={(event) => {
                  const file = event.target.files?.[0]
                  if (file) {
                    updateDocument(slot.key, file.name)
                  }
                }}
              />
            ))}
          </div>
        )}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={control}
          name="kyc.bankName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bank name *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="kyc.accountHolder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account holder *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={control}
          name="kyc.accountNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account number *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="kyc.swiftRouting"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SWIFT / Routing</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

function SellerOnboardingReviewStep({
  values,
  reviewBannerMessage,
}: {
  values: SellerOnboardingFormValues
  reviewBannerMessage: string
}) {
  const reviewItems = useMemo(() => getReviewItems(values), [values])

  return (
    <div className="grid gap-6">
      <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
        {reviewBannerMessage}
      </div>

      <div className="divide-border divide-y rounded-2xl border bg-white">
        {reviewItems.map((item) => (
          <div key={item.label} className="grid gap-3 px-4 py-4 md:grid-cols-[160px_1fr]">
            <span className="text-muted-foreground text-sm">{item.label}</span>
            <div className="text-right text-sm font-medium">{item.value}</div>
          </div>
        ))}
        <div className="grid gap-3 px-4 py-4 md:grid-cols-[160px_1fr]">
          <span className="text-muted-foreground text-sm">Password</span>
          <div className="text-right text-sm font-medium">
            {maskPassword(values.account.password)}
          </div>
        </div>
        <div className="grid gap-3 px-4 py-4 md:grid-cols-[160px_1fr]">
          <span className="text-muted-foreground text-sm">ID number</span>
          <div className="text-right text-sm font-medium">{maskIdNumber(values.kyc.idNumber)}</div>
        </div>
      </div>
    </div>
  )
}

function SellerOnboardingStepContent({
  controller,
  categoryOptions,
  countryOptions,
  businessTypeOptions,
  idTypeOptions,
  documentSlots,
  reviewBannerMessage,
}: {
  controller: SellerOnboardingController
  categoryOptions: string[]
  countryOptions: string[]
  businessTypeOptions: string[]
  idTypeOptions: string[]
  documentSlots: SellerOnboardingDocumentSlot[]
  reviewBannerMessage: string
}) {
  if (controller.activeStep === 1) {
    return <SellerOnboardingAccountStep control={controller.form.control} />
  }

  if (controller.activeStep === 2) {
    return (
      <SellerOnboardingShopStep
        control={controller.form.control}
        categoryOptions={categoryOptions}
        countryOptions={countryOptions}
      />
    )
  }

  if (controller.activeStep === 3) {
    return (
      <SellerOnboardingKycStep
        control={controller.form.control}
        businessTypeOptions={businessTypeOptions}
        idTypeOptions={idTypeOptions}
        documentSlots={documentSlots}
        documentInputRefs={controller.documentInputRefs}
        updateDocument={controller.updateDocument}
      />
    )
  }

  return (
    <SellerOnboardingReviewStep
      values={controller.form.getValues()}
      reviewBannerMessage={reviewBannerMessage}
    />
  )
}

function SellerOnboardingFooter({
  activeStep,
  submitting,
  onBack,
  onNext,
  onSubmit,
}: {
  activeStep: SellerOnboardingStepIndex
  submitting: boolean
  onBack: () => void
  onNext: () => void
  onSubmit: () => Promise<boolean>
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={onBack}
        disabled={activeStep === 1}
      >
        <ArrowLeft />
        Back
      </Button>

      {activeStep < SELLER_ONBOARDING_MAX_STEP ? (
        <Button type="button" size="lg" onClick={onNext}>
          Next
          <ArrowRight />
        </Button>
      ) : (
        <Button type="button" size="lg" onClick={() => void onSubmit()} loading={submitting}>
          Submit
          <Check />
        </Button>
      )}
    </div>
  )
}

function SellerOnboardingMain({
  controller,
  stepLabels,
  categoryOptions,
  countryOptions,
  businessTypeOptions,
  idTypeOptions,
  documentSlots,
  reviewBannerMessage,
}: {
  controller: SellerOnboardingController
  stepLabels: [string, string, string, string]
  categoryOptions: string[]
  countryOptions: string[]
  businessTypeOptions: string[]
  idTypeOptions: string[]
  documentSlots: SellerOnboardingDocumentSlot[]
  reviewBannerMessage: string
}) {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-5 px-4 py-8 sm:px-6 lg:px-8">
      <SellerOnboardingStepRail currentStep={controller.activeStep} stepLabels={stepLabels} />

      <Form {...controller.form}>
        <SectionCard
          title={stepLabels[controller.activeStep - 1]}
          className="rounded-[24px] bg-white"
        >
          {controller.actionError ? (
            <div className="border-destructive/20 bg-destructive/10 text-destructive mb-4 rounded-2xl border px-4 py-3 text-sm">
              {controller.actionError}
            </div>
          ) : null}

          <SellerOnboardingStepContent
            controller={controller}
            categoryOptions={categoryOptions}
            countryOptions={countryOptions}
            businessTypeOptions={businessTypeOptions}
            idTypeOptions={idTypeOptions}
            documentSlots={documentSlots}
            reviewBannerMessage={reviewBannerMessage}
          />
        </SectionCard>
      </Form>

      <SellerOnboardingFooter
        activeStep={controller.activeStep}
        submitting={controller.submitting}
        onBack={controller.handleBack}
        onNext={controller.handleNext}
        onSubmit={controller.handleSubmit}
      />
    </main>
  )
}

interface SellerOnboardingClientProps {
  title: string
  saveExitLabel: string
  saveExitHref?: string
  stepLabels: [string, string, string, string]
  defaultStep: SellerOnboardingStepIndex
  currentStep?: SellerOnboardingProps['currentStep']
  onCurrentStepChange?: SellerOnboardingProps['onCurrentStepChange']
  defaultValues: SellerOnboardingFormValues
  categoryOptions: string[]
  countryOptions: string[]
  businessTypeOptions: string[]
  idTypeOptions: string[]
  documentSlots: SellerOnboardingDocumentSlot[]
  reviewBannerMessage: string
  onSaveExit?: SellerOnboardingProps['onSaveExit']
  onSubmit: NonNullable<SellerOnboardingProps['onSubmit']>
}

export function SellerOnboardingClient({
  title,
  saveExitLabel,
  saveExitHref,
  stepLabels,
  defaultStep,
  currentStep,
  onCurrentStepChange,
  defaultValues,
  categoryOptions,
  countryOptions,
  businessTypeOptions,
  idTypeOptions,
  documentSlots,
  reviewBannerMessage,
  onSaveExit,
  onSubmit,
}: SellerOnboardingClientProps) {
  const controller = useSellerOnboardingController({
    defaultStep,
    currentStep,
    onCurrentStepChange,
    defaultValues,
    documentSlots,
    onSaveExit,
    onSubmit,
  })

  return (
    <div className="min-h-screen bg-[#eef3fb]">
      <SellerOnboardingHeader
        title={title}
        saveExitLabel={saveExitLabel}
        {...(saveExitHref !== undefined ? { saveExitHref } : {})}
        {...(onSaveExit !== undefined ? { onSaveExit } : {})}
        onClickSaveExit={controller.handleSaveExit}
      />

      <SellerOnboardingMain
        controller={controller}
        stepLabels={stepLabels}
        categoryOptions={categoryOptions}
        countryOptions={countryOptions}
        businessTypeOptions={businessTypeOptions}
        idTypeOptions={idTypeOptions}
        documentSlots={documentSlots}
        reviewBannerMessage={reviewBannerMessage}
      />
    </div>
  )
}
