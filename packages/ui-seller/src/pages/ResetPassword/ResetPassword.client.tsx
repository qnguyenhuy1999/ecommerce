'use client'

import { Button } from '@ecom/core-ui/atoms/Button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@ecom/core-ui/atoms/Form'
import { Input } from '@ecom/core-ui/atoms/Input'
import { Typography } from '@ecom/core-ui/atoms/Typography'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@ecom/core-ui/molecules/Card'
import { useForm } from '@ecom/core-ui/vendors/react-hook-form'
import { zodResolver } from '@ecom/core-ui/vendors/zod-resolver'
import { CircleAlert, CircleCheckBig, KeyRound, ShieldAlert } from 'lucide-react'
import { useState } from 'react'
import { AuthPageShell } from '../../layouts/AuthPageShell'
import { resetPasswordDefaultProps } from './ResetPassword.fixtures'
import { resetPasswordSchema } from './ResetPassword.schema'
import type { ResetPasswordProps, ResetPasswordSubmitValues } from './ResetPassword.types'

interface ResetPasswordClientProps {
  title: string
  description: string
  passwordLabel: string
  passwordPlaceholder: string
  confirmPasswordLabel: string
  confirmPasswordPlaceholder: string
  submitLabel: string
  submittingLabel: string
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

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message
  }
  return 'Password reset failed'
}

function ResetPasswordStatus({ tone, title, message }: ResetPasswordStatusProps) {
  const isWarning = tone === 'warning'

  return (
    <div
      className={`space-y-4 rounded-3xl border p-5 ${
        isWarning ? 'border-warning/20 bg-warning/10' : 'border-success/20 bg-success/10'
      }`}
    >
      <div
        className={`flex size-12 items-center justify-center rounded-2xl ${
          isWarning ? 'bg-warning text-warning-foreground' : 'bg-success text-success-foreground'
        }`}
      >
        {isWarning ? <ShieldAlert className="size-5" /> : <CircleCheckBig className="size-5" />}
      </div>
      <div className="space-y-1">
        <Typography variant="label" className={isWarning ? 'text-warning' : 'text-success'}>
          {title}
        </Typography>
        <Typography variant="body-sm" className={isWarning ? 'text-warning' : 'text-success'}>
          {message}
        </Typography>
      </div>
    </div>
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

  const submitting = form.formState.isSubmitting

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

  return (
    <AuthPageShell title={title} description={description}>
      <Card className="bg-card border-border shadow-sm">
        <CardHeader className="space-y-3 pb-2">
          <Typography
            variant="caption"
            className="text-muted-foreground tracking-[0.24em] uppercase"
          >
            Password reset
          </Typography>
          <div className="space-y-1">
            <CardTitle className="text-foreground text-2xl">{title}</CardTitle>
            <Typography variant="body-sm" className="text-muted-foreground">
              {description}
            </Typography>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {!token ? (
            <ResetPasswordStatus
              tone="warning"
              title={missingTokenTitle}
              message={missingTokenMessage}
            />
          ) : completed ? (
            <ResetPasswordStatus tone="success" title={successTitle} message={successMessage} />
          ) : (
            <Form {...form}>
              <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
                {errorMessage ? (
                  <div className="bg-destructive/10 text-destructive border-destructive/20 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm">
                    <CircleAlert className="mt-0.5 size-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                ) : null}

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>{passwordLabel}</FormLabel>
                      <div className="relative">
                        <KeyRound className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            autoComplete="new-password"
                            placeholder={passwordPlaceholder}
                            className="bg-background h-11 pl-10"
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
                      <FormLabel>{confirmPasswordLabel}</FormLabel>
                      <div className="relative">
                        <KeyRound className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            autoComplete="new-password"
                            placeholder={confirmPasswordPlaceholder}
                            className="bg-background h-11 pl-10"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" size="lg" className="w-full" loading={submitting}>
                  {submitting ? submittingLabel : submitLabel}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter>
          <a
            href={backToLoginHref}
            className="text-muted-foreground hover:text-foreground text-sm font-medium"
          >
            {backToLoginLabel}
          </a>
        </CardFooter>
      </Card>
    </AuthPageShell>
  )
}
