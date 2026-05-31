import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConsoleLayout } from '../../layouts/ConsoleLayout'
import { SellerListPage } from '.'

const meta: Meta<typeof SellerListPage> = {
  title: 'Organisms/SellerListPage',
  component: SellerListPage,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    title: '',
    children: undefined,
  },
}

export default meta

type Story = StoryObj<typeof SellerListPage>

export const Default: Story = {
  render: () => (
    <ConsoleLayout>
      <SellerListPage
        title="Example Page"
        description="Demonstration of the SellerListPage shell with breadcrumb and content area."
        breadcrumb={[{ label: 'Admin', href: '#' }, { label: 'Example' }]}>
        <p className="text-muted-foreground py-8 text-center text-sm">Page content goes here.</p>
      </SellerListPage>
    </ConsoleLayout>
  ),
}

export const WithActions: Story = {
  render: () => (
    <ConsoleLayout>
      <SellerListPage
        title="With Actions"
        description="Page shell with an action slot in the header."
        breadcrumb={[{ label: 'Admin', href: '#' }, { label: 'With Actions' }]}
        actions={
          <button className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium">
            + New Item
          </button>
        }>
        <p className="text-muted-foreground py-8 text-center text-sm">Content area.</p>
      </SellerListPage>
    </ConsoleLayout>
  ),
}
