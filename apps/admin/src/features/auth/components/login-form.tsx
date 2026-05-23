'use client'

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  useForm,
  zodResolver,
} from '@ecom/core-ui'
import { loginSchema, type LoginFormValues } from '../schemas/login.schema'
import { useLogin } from '../hooks/use-auth'

export function LoginForm() {
  const login = useLogin()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = form.handleSubmit(async (data) => {
    await login.mutateAsync(data)
  })

  const submitting = form.formState.isSubmitting || login.isPending

  return (
    <Form {...form}>
      <form
        onSubmit={(event) => {
          void onSubmit(event)
        }}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="admin@example.com"
                  autoComplete="email"
                  className="h-10"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="h-10"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {login.error && (
          <div className="border-destructive/50 bg-destructive/10 text-destructive rounded-md border p-3 text-sm">
            {login.error.message}
          </div>
        )}

        <Button type="submit" className="w-full" loading={submitting}>
          {submitting ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </Form>
  )
}
