'use client'

import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
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
import { CircleAlert, KeyRound, Mail } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AuthPageShell } from '../../layouts/AuthPageShell'
import { loginDefaultProps } from './Login.fixtures'
import { loginSchema } from './Login.schema'
import type { LoginProps, LoginSubmitValues } from './Login.types'

interface LoginClientProps {
  title: string
  description: string
  emailLabel: string
  emailPlaceholder: string
  passwordLabel: string
  passwordPlaceholder: string
  submitLabel: string
  submittingLabel: string
  forgotPasswordHref: string
  forgotPasswordLabel: string
  registerHref: string
  registerLabel: string
  registerPrompt: string
  noticeMessage?: string
  defaultEmail: string
  onSubmit: NonNullable<LoginProps['onSubmit']>
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message
  }
  return 'Login failed'
}

export function LoginClient({
  title,
  description,
  emailLabel,
  emailPlaceholder,
  passwordLabel,
  passwordPlaceholder,
  submitLabel,
  submittingLabel,
  forgotPasswordHref,
  forgotPasswordLabel,
  registerHref,
  registerLabel,
  registerPrompt,
  noticeMessage,
  defaultEmail,
  onSubmit,
}: LoginClientProps) {
  const submitHandler = onSubmit ?? loginDefaultProps.onSubmit
  const [errorMessage, setErrorMessage] = useState('')
  const form = useForm<LoginSubmitValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: defaultEmail ?? loginDefaultProps.defaultEmail ?? '',
      password: '',
    },
  })

  useEffect(() => {
    form.reset({
      email: defaultEmail ?? loginDefaultProps.defaultEmail ?? '',
      password: '',
    })
  }, [defaultEmail, form])

  const handleSubmit = form.handleSubmit(async (values) => {
    setErrorMessage('')

    try {
      await submitHandler(values)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  })

  const submitting = form.formState.isSubmitting

  return (
    <AuthPageShell title={title} description={description}>
      <Card className="bg-card border-border shadow-sm">
        <CardHeader className="space-y-3 pb-2">
          <Typography
            variant="caption"
            className="text-muted-foreground tracking-[0.24em] uppercase"
          >
            Seller Center
          </Typography>
          <div className="space-y-1">
            <CardTitle className="text-foreground text-2xl">{title}</CardTitle>
            <Typography variant="body-sm" className="text-muted-foreground">
              {description}
            </Typography>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {noticeMessage ? (
            <div className="bg-success/10 text-success border-success/20 rounded-2xl border px-4 py-3 text-sm">
              {noticeMessage}
            </div>
          ) : null}

          {errorMessage ? (
            <div className="bg-destructive/10 text-destructive border-destructive/20 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm">
              <CircleAlert className="mt-0.5 size-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          ) : null}

          <Form {...form}>
            <form
              onSubmit={(event) => {
                void handleSubmit(event)
              }}
              className="space-y-4"
            >
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

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <FormLabel>{passwordLabel}</FormLabel>
                      <a
                        href={forgotPasswordHref}
                        className="text-muted-foreground hover:text-foreground text-sm font-medium transition"
                      >
                        {forgotPasswordLabel}
                      </a>
                    </div>
                    <div className="relative">
                      <KeyRound className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          autoComplete="current-password"
                          placeholder={passwordPlaceholder}
                          className="bg-background h-11 pl-10"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" size="lg" className="mt-2 w-full" loading={submitting}>
                {submitting ? submittingLabel : submitLabel}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Typography variant="body-sm" className="text-muted-foreground">
            {registerPrompt}{' '}
            <a href={registerHref} className="text-foreground hover:text-primary font-semibold">
              {registerLabel}
            </a>
          </Typography>
        </CardFooter>
      </Card>
    </AuthPageShell>
  )
}
