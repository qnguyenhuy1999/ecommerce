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
import { CircleAlert, Mail, Send } from 'lucide-react'
import { useState } from 'react'
import {
  authIconClassName,
  authInputClassName,
  authLabelClassName,
  authPrimaryButtonClassName,
  authPrimaryLinkClassName,
  authSecondaryLinkClassName,
  authStatusToneClassNames,
  authSurfaceClassName,
} from '../../lib/auth-theme'
import { AuthPageShell } from '../../layouts/AuthPageShell'
import { forgotPasswordDefaultProps } from './ForgotPassword.fixtures'
import type { ForgotPasswordProps } from './ForgotPassword.types'
import { forgotPasswordSchema } from './ForgotPassword.schema'

interface ForgotPasswordClientProps {
  title: string
  description: string
  emailLabel: string
  emailPlaceholder: string
  submitLabel: string
  submittingLabel: string
  successTitle: string
  successMessage: string
  backToLoginHref: string
  backToLoginLabel: string
  requestAccessHref: string
  requestAccessLabel: string
  onSubmit: NonNullable<ForgotPasswordProps['onSubmit']>
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Request failed'
}

export function ForgotPasswordClient({
  title,
  description,
  emailLabel,
  emailPlaceholder,
  submitLabel,
  submittingLabel,
  successTitle,
  successMessage,
  backToLoginHref,
  backToLoginLabel,
  requestAccessHref,
  requestAccessLabel,
  onSubmit,
}: ForgotPasswordClientProps) {
  const submitHandler = onSubmit ?? forgotPasswordDefaultProps.onSubmit
  const [errorMessage, setErrorMessage] = useState('')
  const [sent, setSent] = useState(false)

  const form = useForm<{ email: string }>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    setErrorMessage('')
    try {
      await submitHandler(values)
      setSent(true)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  })

  const submitting = form.formState.isSubmitting

  return (
    <AuthPageShell title={title}>
      <Card className={authSurfaceClassName}>
        <CardContent className="space-y-4 p-4 sm:p-5">
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

          {sent ? (
            <div
              role="status"
              aria-live="polite"
              className={`space-y-4 rounded-[24px] border p-5 ${authStatusToneClassNames.success.container}`}
            >
              <div
                className={`flex size-12 items-center justify-center rounded-2xl ${authStatusToneClassNames.success.icon}`}
              >
                <Send className="size-5" />
              </div>
              <div className="space-y-1">
                <Typography variant="label" className={authStatusToneClassNames.success.text}>
                  {successTitle}
                </Typography>
                <Typography variant="body-sm" className={authStatusToneClassNames.success.text}>
                  {successMessage}
                </Typography>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={(event) => {
                  void handleSubmit(event)
                }}
                className="space-y-3.5"
              >
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
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className={authLabelClassName}>{emailLabel}</FormLabel>
                      <div className="relative">
                        <Mail className={authIconClassName} />
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            autoComplete="email"
                            placeholder={emailPlaceholder}
                            className={authInputClassName.replace('pr-11', '')}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
          )}

          <div className="border-border flex items-center justify-between gap-3 border-t pt-3 text-sm">
            <a href={backToLoginHref} className={authSecondaryLinkClassName}>
              {backToLoginLabel}
            </a>
            <a href={requestAccessHref} className={authPrimaryLinkClassName}>
              {requestAccessLabel}
            </a>
          </div>
        </CardContent>
      </Card>
    </AuthPageShell>
  )
}
