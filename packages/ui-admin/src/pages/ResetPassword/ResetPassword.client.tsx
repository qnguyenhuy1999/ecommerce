'use client'

import {
  Button,
  Card,
  CardContent,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Typography,
  useForm,
  zodResolver,
} from '@ecom/core-ui'
import { CircleAlert, CircleCheckBig, KeyRound, ShieldAlert } from 'lucide-react'
import { useState } from 'react'
import {
  authIconClassName,
  authInputClassName,
  authLabelClassName,
  authPrimaryButtonClassName,
  authSecondaryLinkClassName,
  authStatusToneClassNames,
  authSurfaceClassName,
} from '../../lib/auth-theme'
import { AuthPageShell } from '../../layouts/AuthPageShell'
import { resetPasswordDefaultProps } from './ResetPassword.fixtures'
import type { ResetPasswordProps, ResetPasswordSubmitValues } from './ResetPassword.types'
import { resetPasswordSchema } from './ResetPassword.schema'

interface ResetPasswordClientProps {
  title: string
  description: string
  passwordLabel: string
  passwordPlaceholder: string
  confirmPasswordLabel: string
  confirmPasswordPlaceholder: string
  submitLabel: string
  submittingLabel: string
  passwordHint: string
  missingTokenTitle: string
  missingTokenMessage: string
  successTitle: string
  successMessage: string
  backToLoginHref: string
  backToLoginLabel: string
  token?: string
  onSubmit: NonNullable<ResetPasswordProps['onSubmit']>
}

interface ResetPasswordStatusProps {
  tone: 'warning' | 'success'
  title: string
  message: string
}

interface ResetPasswordFormProps {
  errorMessage: string
  form: ReturnType<typeof useForm<{ password: string; confirmPassword: string }>>
  passwordLabel: string
  passwordPlaceholder: string
  confirmPasswordLabel: string
  confirmPasswordPlaceholder: string
  passwordHint: string
  submitLabel: string
  submittingLabel: string
  submitting: boolean
  onSubmit: (event: React.SyntheticEvent<HTMLFormElement>) => void
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Password reset failed'
}

function ResetPasswordStatus({ tone, title, message }: ResetPasswordStatusProps) {
  const isWarning = tone === 'warning'
  const toneClassNames = isWarning
    ? authStatusToneClassNames.warning
    : authStatusToneClassNames.success

  return (
    <div
      role={isWarning ? 'alert' : 'status'}
      aria-live={isWarning ? 'assertive' : 'polite'}
      className={`space-y-4 rounded-[24px] border p-5 ${toneClassNames.container}`}
    >
      <div
        className={`flex size-12 items-center justify-center rounded-2xl ${toneClassNames.icon}`}
      >
        {isWarning ? <ShieldAlert className="size-5" /> : <CircleCheckBig className="size-5" />}
      </div>
      <div className="space-y-1">
        <Typography variant="label" className={toneClassNames.text}>
          {title}
        </Typography>
        <Typography variant="body-sm" className={toneClassNames.text}>
          {message}
        </Typography>
      </div>
    </div>
  )
}

function ResetPasswordHeader({
  title,
  description,
}: Pick<ResetPasswordClientProps, 'title' | 'description'>) {
  return (
    <div className="space-y-1">
      <Typography
        as="h2"
        variant="h3"
        className="text-foreground text-[1.6rem] leading-tight font-semibold tracking-[-0.03em] text-balance"
      >
        {title}
      </Typography>
      <Typography variant="body-sm" className="text-muted-foreground text-[0.9rem] leading-5">
        {description}
      </Typography>
    </div>
  )
}

function ResetPasswordForm({
  errorMessage,
  form,
  passwordLabel,
  passwordPlaceholder,
  confirmPasswordLabel,
  confirmPasswordPlaceholder,
  passwordHint,
  submitLabel,
  submittingLabel,
  submitting,
  onSubmit,
}: ResetPasswordFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-3.5">
        {errorMessage ? (
          <div
            role="alert"
            aria-live="assertive"
            className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${authStatusToneClassNames.destructive.container} ${authStatusToneClassNames.destructive.text}`}
          >
            <CircleAlert className="mt-0.5 size-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        ) : null}

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className={authLabelClassName}>{passwordLabel}</FormLabel>
              <div className="relative">
                <KeyRound className={authIconClassName} />
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    autoComplete="new-password"
                    placeholder={passwordPlaceholder}
                    className={authInputClassName.replace('pr-11', '')}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className={authLabelClassName}>{confirmPasswordLabel}</FormLabel>
              <div className="relative">
                <KeyRound className={authIconClassName} />
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    autoComplete="new-password"
                    placeholder={confirmPasswordPlaceholder}
                    className={authInputClassName.replace('pr-11', '')}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Typography variant="body-sm" className="text-muted-foreground text-[0.95rem]">
          {passwordHint}
        </Typography>

        <Button
          type="submit"
          size="lg"
          className={`${authPrimaryButtonClassName} h-12`}
          loading={submitting}
        >
          {submitting ? submittingLabel : submitLabel}
        </Button>
      </form>
    </Form>
  )
}

export function ResetPasswordClient({
  title,
  description,
  passwordLabel,
  passwordPlaceholder,
  confirmPasswordLabel,
  confirmPasswordPlaceholder,
  submitLabel,
  submittingLabel,
  passwordHint,
  missingTokenTitle,
  missingTokenMessage,
  successTitle,
  successMessage,
  backToLoginHref,
  backToLoginLabel,
  token,
  onSubmit,
}: ResetPasswordClientProps) {
  const submitHandler = onSubmit ?? resetPasswordDefaultProps.onSubmit
  const [errorMessage, setErrorMessage] = useState('')
  const [completed, setCompleted] = useState(false)

  const form = useForm<{ password: string; confirmPassword: string }>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!token) {
      setErrorMessage(missingTokenMessage)
      return
    }
    setErrorMessage('')
    const submitValues: ResetPasswordSubmitValues = { token, password: values.password }
    try {
      await submitHandler(submitValues)
      setCompleted(true)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  })

  const submitting = form.formState.isSubmitting

  return (
    <AuthPageShell title={title}>
      <Card className={authSurfaceClassName}>
        <CardContent className="space-y-4 p-4 sm:p-5">
          <ResetPasswordHeader title={title} description={description} />

          {!token ? (
            <ResetPasswordStatus
              tone="warning"
              title={missingTokenTitle}
              message={missingTokenMessage}
            />
          ) : completed ? (
            <ResetPasswordStatus tone="success" title={successTitle} message={successMessage} />
          ) : (
            <ResetPasswordForm
              errorMessage={errorMessage}
              form={form}
              passwordLabel={passwordLabel}
              passwordPlaceholder={passwordPlaceholder}
              confirmPasswordLabel={confirmPasswordLabel}
              confirmPasswordPlaceholder={confirmPasswordPlaceholder}
              passwordHint={passwordHint}
              submitLabel={submitLabel}
              submittingLabel={submittingLabel}
              submitting={submitting}
              onSubmit={(event) => {
                void handleSubmit(event)
              }}
            />
          )}

          <div className="border-border border-t pt-3 text-sm">
            <a href={backToLoginHref} className={authSecondaryLinkClassName}>
              {backToLoginLabel}
            </a>
          </div>
        </CardContent>
      </Card>
    </AuthPageShell>
  )
}
