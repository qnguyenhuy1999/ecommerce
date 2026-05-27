'use client'

import {
  Button,
  Card,
  CardContent,
  Checkbox,
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
  type UseFormReturn,
} from '@ecom/core-ui'
import { ArrowLeft, CircleAlert, Eye, EyeOff, KeyRound, Mail, ShieldCheck } from 'lucide-react'
import { useState, useEffect } from 'react'
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
import { loginDefaultProps } from './Login.fixtures'
import type { LoginProps, LoginSubmitValues } from './Login.types'
import { createLoginSchema } from './Login.schema'

interface LoginClientProps {
  title: string
  description: string
  emailLabel: string
  emailPlaceholder: string
  passwordLabel: string
  passwordPlaceholder: string
  showOtp: boolean
  otpLabel: string
  otpPlaceholder: string
  otpHint: string
  securityBadge: string
  submitLabel: string
  submittingLabel: string
  forgotPasswordHref: string
  forgotPasswordLabel: string
  trustDeviceLabel: string
  trustDeviceHint: string
  passkeyLabel: string
  marketplaceHref: string
  marketplaceLabel: string
  sellerLoginHref: string
  sellerLoginLabel: string
  requestAccessHref: string
  requestAccessLabel: string
  policyMessage: string
  noticeMessage?: string
  defaultEmail: string
  defaultOtp: string
  onSubmit: NonNullable<LoginProps['onSubmit']>
}

interface LoginFormProps {
  form: UseFormReturn<LoginSubmitValues>
  emailLabel: string
  emailPlaceholder: string
  passwordLabel: string
  passwordPlaceholder: string
  showOtp: boolean
  showPassword: boolean
  onTogglePassword: () => void
  forgotPasswordHref: string
  forgotPasswordLabel: string
  otpLabel: string
  otpPlaceholder: string
  otpHint: string
  trustDeviceLabel: string
  trustDeviceHint: string
  passkeyLabel: string
  submitLabel: string
  submittingLabel: string
  submitting: boolean
  onSubmit: (event: React.SyntheticEvent<HTMLFormElement>) => void
}

interface LoginFormFieldProps {
  form: UseFormReturn<LoginSubmitValues>
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Sign in failed'
}

function LoginHeader({
  title,
  description,
  securityBadge,
}: Pick<LoginClientProps, 'title' | 'description' | 'securityBadge'>) {
  return (
    <div className="flex items-start justify-between gap-3">
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
      <div
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${authStatusToneClassNames.success.container} ${authStatusToneClassNames.success.text}`}
      >
        <span
          className={`inline-flex size-2 rounded-full ${authStatusToneClassNames.success.dot}`}
        />
        <span>{securityBadge}</span>
      </div>
    </div>
  )
}

function LoginNotice({ message }: { message: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`rounded-2xl border px-4 py-3 text-sm ${authStatusToneClassNames.success.container} ${authStatusToneClassNames.success.text}`}
    >
      {message}
    </div>
  )
}

function LoginError({ message }: { message: string }) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${authStatusToneClassNames.destructive.container} ${authStatusToneClassNames.destructive.text}`}
    >
      <CircleAlert className="mt-0.5 size-4 shrink-0" />
      <span>{message}</span>
    </div>
  )
}

function LoginEmailField({
  form,
  emailLabel,
  emailPlaceholder,
}: LoginFormFieldProps & Pick<LoginFormProps, 'emailLabel' | 'emailPlaceholder'>) {
  return (
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
                className={authInputClassName}
              />
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function LoginTrustDeviceField({
  form,
  trustDeviceLabel,
  trustDeviceHint,
  passkeyLabel,
}: LoginFormFieldProps &
  Pick<LoginFormProps, 'trustDeviceLabel' | 'trustDeviceHint' | 'passkeyLabel'>) {
  return (
    <FormField
      control={form.control}
      name="trustDevice"
      render={({ field }) => (
        <FormItem>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <label className="text-foreground flex items-center gap-3 text-sm">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                  className="border-input"
                />
              </FormControl>
              <span className="flex items-center gap-1.5">
                <span>{trustDeviceLabel}</span>
                <span className="text-muted-foreground">{trustDeviceHint}</span>
              </span>
            </label>

            <span
              aria-disabled="true"
              className="text-muted-foreground inline-flex items-center gap-2 text-sm font-medium"
            >
              <ShieldCheck className="text-muted-foreground/70 size-4" />
              <span>{passkeyLabel}</span>
            </span>
          </div>
        </FormItem>
      )}
    />
  )
}

function LoginForm({
  form,
  emailLabel,
  emailPlaceholder,
  passwordLabel,
  passwordPlaceholder,
  showOtp,
  showPassword,
  onTogglePassword,
  forgotPasswordHref,
  forgotPasswordLabel,
  otpLabel,
  otpPlaceholder,
  otpHint,
  trustDeviceLabel,
  trustDeviceHint,
  passkeyLabel,
  submitLabel,
  submittingLabel,
  submitting,
  onSubmit,
}: LoginFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-3.5">
        <LoginEmailField form={form} emailLabel={emailLabel} emailPlaceholder={emailPlaceholder} />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <FormLabel className={authLabelClassName}>{passwordLabel}</FormLabel>
                <a href={forgotPasswordHref} className={authPrimaryLinkClassName}>
                  {forgotPasswordLabel}
                </a>
              </div>
              <div className="relative">
                <KeyRound className={authIconClassName} />
                <FormControl>
                  <Input
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder={passwordPlaceholder}
                    className={authInputClassName}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 hover:bg-transparent"
                  onClick={onTogglePassword}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {showOtp ? (
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <FormLabel className={authLabelClassName}>{otpLabel}</FormLabel>
                  <Typography variant="body-sm" className="text-muted-foreground">
                    {otpHint}
                  </Typography>
                </div>
                <div className="relative">
                  <ShieldCheck className={authIconClassName} />
                  <FormControl>
                    <Input
                      {...field}
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      placeholder={otpPlaceholder}
                      className={`${authInputClassName} tracking-[0.36em]`}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}

        <LoginTrustDeviceField
          form={form}
          trustDeviceLabel={trustDeviceLabel}
          trustDeviceHint={trustDeviceHint}
          passkeyLabel={passkeyLabel}
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
  )
}

function LoginFooterLinks({
  marketplaceHref,
  marketplaceLabel,
  sellerLoginHref,
  sellerLoginLabel,
  requestAccessHref,
  requestAccessLabel,
}: Pick<
  LoginClientProps,
  | 'marketplaceHref'
  | 'marketplaceLabel'
  | 'sellerLoginHref'
  | 'sellerLoginLabel'
  | 'requestAccessHref'
  | 'requestAccessLabel'
>) {
  return (
    <div className="border-border flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t pt-3 text-sm">
      <a
        href={marketplaceHref}
        className={`inline-flex items-center gap-2 ${authSecondaryLinkClassName}`}
      >
        <ArrowLeft className="size-4" />
        {marketplaceLabel}
      </a>
      <div className="flex items-center gap-4">
        <a href={sellerLoginHref} className={authSecondaryLinkClassName}>
          {sellerLoginLabel}
        </a>
        <a href={requestAccessHref} className={authPrimaryLinkClassName}>
          {requestAccessLabel}
        </a>
      </div>
    </div>
  )
}

export function LoginClient({
  title,
  description,
  emailLabel,
  emailPlaceholder,
  passwordLabel,
  passwordPlaceholder,
  showOtp = loginDefaultProps.showOtp,
  otpLabel,
  otpPlaceholder,
  otpHint,
  securityBadge,
  submitLabel,
  submittingLabel,
  forgotPasswordHref,
  forgotPasswordLabel,
  trustDeviceLabel,
  trustDeviceHint,
  passkeyLabel,
  marketplaceHref,
  marketplaceLabel,
  sellerLoginHref,
  sellerLoginLabel,
  requestAccessHref,
  requestAccessLabel,
  policyMessage,
  noticeMessage,
  defaultEmail,
  defaultOtp,
  onSubmit,
}: LoginClientProps) {
  const submitHandler = onSubmit ?? loginDefaultProps.onSubmit
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const form = useForm<LoginSubmitValues>({
    resolver: zodResolver(createLoginSchema(showOtp)),
    defaultValues: {
      email: defaultEmail ?? '',
      password: '',
      otp: defaultOtp ?? '',
      trustDevice: false,
    },
  })

  useEffect(() => {
    form.reset({
      email: defaultEmail ?? '',
      password: '',
      otp: defaultOtp ?? '',
      trustDevice: false,
    })
  }, [defaultEmail, defaultOtp, form])

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
    <AuthPageShell title={title}>
      <div className="space-y-3">
        <Card className={authSurfaceClassName}>
          <CardContent className="space-y-4 p-4 sm:p-5">
            <LoginHeader title={title} description={description} securityBadge={securityBadge} />

            {noticeMessage ? <LoginNotice message={noticeMessage} /> : null}
            {errorMessage ? <LoginError message={errorMessage} /> : null}

            <LoginForm
              form={form}
              emailLabel={emailLabel}
              emailPlaceholder={emailPlaceholder}
              passwordLabel={passwordLabel}
              passwordPlaceholder={passwordPlaceholder}
              showOtp={showOtp}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword((current) => !current)}
              forgotPasswordHref={forgotPasswordHref}
              forgotPasswordLabel={forgotPasswordLabel}
              otpLabel={otpLabel}
              otpPlaceholder={otpPlaceholder}
              otpHint={otpHint}
              trustDeviceLabel={trustDeviceLabel}
              trustDeviceHint={trustDeviceHint}
              passkeyLabel={passkeyLabel}
              submitLabel={submitLabel}
              submittingLabel={submittingLabel}
              submitting={submitting}
              onSubmit={(event) => {
                void handleSubmit(event)
              }}
            />

            <LoginFooterLinks
              marketplaceHref={marketplaceHref}
              marketplaceLabel={marketplaceLabel}
              sellerLoginHref={sellerLoginHref}
              sellerLoginLabel={sellerLoginLabel}
              requestAccessHref={requestAccessHref}
              requestAccessLabel={requestAccessLabel}
            />
          </CardContent>
        </Card>

        <Typography
          variant="caption"
          className="text-muted-foreground block px-1 text-center text-[0.875rem] lg:text-left"
        >
          {policyMessage}
        </Typography>
      </div>
    </AuthPageShell>
  )
}
