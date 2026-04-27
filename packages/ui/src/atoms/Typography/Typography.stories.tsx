import type { Meta, StoryObj } from '@storybook/react'

import { Typography } from './Typography'

const meta: Meta<typeof Typography> = {
  title: 'Atoms/Typography',
  component: Typography,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'p', 'span'],
      description: 'The typographic variant to use',
    },
    as: {
      control: 'text',
      description: 'The underlying HTML element to render',
    },
    children: {
      control: 'text',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    variant: 'p',
    children: 'The quick brown fox jumps over the lazy dog',
  },
}

export const Heading1: Story = {
  args: {
    variant: 'h1',
    children: 'Heading 1 (Display Small)',
  },
}

export const Heading2: Story = {
  args: {
    variant: 'h2',
    children: 'Heading 2 (Heading Extra Large)',
  },
}

export const Heading3: Story = {
  args: {
    variant: 'h3',
    children: 'Heading 3 (Heading Large)',
  },
}

export const Heading4: Story = {
  args: {
    variant: 'h4',
    children: 'Heading 4 (Heading Medium)',
  },
}

export const Heading5: Story = {
  args: {
    variant: 'h5',
    children: 'Heading 5 (Heading Small)',
  },
}

export const Paragraph: Story = {
  args: {
    variant: 'p',
    children:
      'Paragraph (Body Medium). This is a longer text to demonstrate line height and spacing properties applied to the standard body paragraph variant.',
  },
  parameters: {
    layout: 'padded',
  },
}

export const Span: Story = {
  args: {
    variant: 'span',
    children: 'Span (Inline Body Medium)',
  },
}

export const Polymorphic: Story = {
  args: {
    variant: 'h3',
    as: 'h1',
    children: 'I am visually an H3, but semantically an H1 tag.',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col w-full max-w-3xl gap-8">
      <div className="flex flex-col gap-2">
        <Typography variant="h1">Heading 1</Typography>
        <Typography variant="span" className="text-sm text-muted-foreground">
          .typography-h1 — var(--font-size-display-sm)
        </Typography>
      </div>

      <div className="flex flex-col gap-2">
        <Typography variant="h2">Heading 2</Typography>
        <Typography variant="span" className="text-sm text-muted-foreground">
          .typography-h2 — var(--font-size-heading-xl)
        </Typography>
      </div>

      <div className="flex flex-col gap-2">
        <Typography variant="h3">Heading 3</Typography>
        <Typography variant="span" className="text-sm text-muted-foreground">
          .typography-h3 — var(--font-size-heading-lg)
        </Typography>
      </div>

      <div className="flex flex-col gap-2">
        <Typography variant="h4">Heading 4</Typography>
        <Typography variant="span" className="text-sm text-muted-foreground">
          .typography-h4 — var(--font-size-heading-md)
        </Typography>
      </div>

      <div className="flex flex-col gap-2">
        <Typography variant="h5">Heading 5</Typography>
        <Typography variant="span" className="text-sm text-muted-foreground">
          .typography-h5 — var(--font-size-heading-sm)
        </Typography>
      </div>

      <div className="flex flex-col gap-2">
        <Typography variant="p">
          Paragraph text. This showcases the line height and spacing. Lorem ipsum dolor sit amet, consectetur adipiscing
          elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Typography>
        <Typography variant="span" className="text-sm text-muted-foreground">
          .typography-p — var(--font-size-body-md)
        </Typography>
      </div>

      <div className="flex flex-col gap-2">
        <Typography variant="span">
          Span text. Good for inline elements or custom wrappers where you want to inherit line-height.
        </Typography>
        <Typography variant="span" className="block mt-1 text-sm text-muted-foreground">
          .typography-span — var(--font-size-body-md)
        </Typography>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
}
