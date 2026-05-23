import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect } from 'react'
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
  useForm,
} from '../../index'

const meta: Meta<typeof Form> = {
  title: 'atoms/Form',
  component: Form,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof Form>

export const Default: Story = {
  render: () => {
    const form = useForm({
      defaultValues: {
        email: 'jane.doe@example.com',
      },
    })
    const onSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
      void form.handleSubmit(() => {})(event)
    }

    return (
      <Form {...form}>
        <form className="max-w-sm space-y-6" onSubmit={onSubmit}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="jane.doe@example.com" />
                </FormControl>
                <FormDescription>Used for receipt delivery and order updates.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Save email</Button>
        </form>
      </Form>
    )
  },
}

export const WithDescriptionAndValidation: Story = {
  render: () => {
    const form = useForm({
      defaultValues: {
        email: 'not-an-email',
      },
      mode: 'onChange',
    })

    useEffect(() => {
      void form.trigger('email')
    }, [form])
    const onSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
      void form.handleSubmit(() => {})(event)
    }

    return (
      <Form {...form}>
        <form className="max-w-sm space-y-6" onSubmit={onSubmit}>
          <FormField
            control={form.control}
            name="email"
            rules={{
              required: 'Email is required.',
              validate: (value) => {
                if (value.includes('@') && value.includes('.')) return true
                return 'Enter a valid email address.'
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="orders@example.com" />
                </FormControl>
                <FormDescription>
                  We use this to send order confirmations, shipment updates, and support replies.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Validate email</Button>
        </form>
      </Form>
    )
  },
}

export const Disabled: Story = {
  render: () => {
    const form = useForm({
      defaultValues: {
        email: 'locked.account@example.com',
      },
    })
    const onSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
      void form.handleSubmit(() => {})(event)
    }

    return (
      <Form {...form}>
        <form className="max-w-sm space-y-6" onSubmit={onSubmit}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormDescription>This account email is managed by support.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled>
            Save email
          </Button>
        </form>
      </Form>
    )
  },
}
