'use client'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@ecom/core-ui/atoms/Form'
import { Button } from '@ecom/core-ui/atoms/Button'
import { Input } from '@ecom/core-ui/atoms/Input'
import { Typography } from '@ecom/core-ui/atoms/Typography'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@ecom/core-ui/molecules/Card'
import { useForm } from '@ecom/core-ui/vendors/react-hook-form'
import { zodResolver } from '@ecom/core-ui/vendors/zod-resolver'
import { CircleAlert, Mail, Send } from 'lucide-react'
import { useState } from 'react'
import { AuthPageShell } from '../../layouts/AuthPageShell'
import { forgotPasswordDefaultProps } from './ForgotPassword.fixtures'
import { forgotPasswordSchema } from './ForgotPassword.schema'
import type { ForgotPasswordProps } from './ForgotPassword.types'

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
  onSubmit,
}: ForgotPasswordClientProps) {
  const submitHandler = onSubmit ?? forgotPasswordDefaultProps.onSubmit
  const [errorMessage, setErrorMessage] = useState('')
  const [sent, setSent] = useState(false)

  const form = useForm<{ email: string }>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const submitting = form.formState.isSubmitting

  const handleSubmit = form.handleSubmit(async (values) => {
    setErrorMessage('')
    try {
      await submitHandler(values)
      setSent(true)
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
            Password recovery
          </Typography>
          <div className="space-y-1">
            <CardTitle className="text-foreground text-2xl">{title}</CardTitle>
            <Typography variant="body-sm" className="text-muted-foreground">
              {description}
            </Typography>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {sent ? (
            <div className="bg-success/10 border-success/20 space-y-4 rounded-3xl border p-5">
              <div className="bg-success text-success-foreground flex size-12 items-center justify-center rounded-2xl">
                <Send className="size-5" />
              </div>
              <div className="space-y-1">
                <Typography variant="label" className="text-success">
                  {successTitle}
                </Typography>
                <Typography variant="body-sm" className="text-success">
                  {successMessage}
                </Typography>
              </div>
            </div>
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
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>{emailLabel}</FormLabel>
                      <div className="relative">
                        <Mail className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            autoComplete="email"
                            placeholder={emailPlaceholder}
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
