import type { Meta, StoryObj } from '@storybook/react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './Accordion'

const meta: Meta<typeof Accordion> = {
  title: 'molecules/Accordion',
  component: Accordion,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Accordion>

export const Default: Story = {
  render: () => (
    <Accordion type="single" collapsible>
      <AccordionItem value="shipping">
        <AccordionTrigger>What are the shipping options?</AccordionTrigger>
        <AccordionContent>
          We offer free standard shipping (3–5 business days) on orders over $50. Express shipping ($12.99) delivers in
          1–2 business days. Overnight delivery ($29.99) is available for select locations.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="returns">
        <AccordionTrigger>How do I return a product?</AccordionTrigger>
        <AccordionContent>
          Visit your order history, select the item, and initiate a return. We provide a prepaid return label. Refunds
          are processed within 5–7 business days after we receive the item.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="warranty">
        <AccordionTrigger>What warranty do products come with?</AccordionTrigger>
        <AccordionContent>
          All products include a minimum 1-year manufacturer warranty. Extended warranty options (2–3 years) are
          available at checkout for select items.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="tracking">
        <AccordionTrigger>How can I track my order?</AccordionTrigger>
        <AccordionContent>
          Once your order ships, you'll receive a confirmation email with a tracking number. You can also check the
          status in your order history on our website.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const EcommerceFAQ: Story = {
  render: () => (
    <Accordion type="multiple">
      <AccordionItem value="payment">
        <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
        <AccordionContent>
          We accept Visa, Mastercard, American Express, PayPal, Apple Pay, and Google Pay. Bank transfer is available
          for orders over $500.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="discount">
        <AccordionTrigger>Do you offer discounts for bulk orders?</AccordionTrigger>
        <AccordionContent>
          Yes! Orders of 10+ items qualify for a 15% bulk discount. Contact our sales team at sales@example.com for
          custom quotes on larger quantities.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="gift">
        <AccordionTrigger>Can I send a gift card?</AccordionTrigger>
        <AccordionContent>
          Digital gift cards are available in denominations of $25, $50, $100, and $250. They can be emailed directly to
          the recipient with a personalized message.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const ProductSpecs: Story = {
  render: () => (
    <Accordion type="multiple">
      <AccordionItem value="audio">
        <AccordionTrigger>Audio Specifications</AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-2 text-sm">
            {[
              ['Driver Size', '40mm dynamic drivers'],
              ['Frequency Response', '20Hz – 40kHz'],
              ['Impedance', '32 ohms'],
              ['Sensitivity', '105 dB/mW'],
              ['THD', '<0.1%'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-1 border-b last:border-b-0">
                <span className="text-muted-foreground">{k}</span>
                <span className="font-medium">{v}</span>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="connectivity">
        <AccordionTrigger>Connectivity</AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-2 text-sm">
            {[
              ['Bluetooth Version', '5.2'],
              ['Range', '10m (33ft)'],
              ['Multi-point', 'Up to 2 devices'],
              ['Codec Support', 'SBC, AAC, aptX'],
              ['Wired', '3.5mm / USB-C'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-1 border-b last:border-b-0">
                <span className="text-muted-foreground">{k}</span>
                <span className="font-medium">{v}</span>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const Ghost: Story = {
  render: () => (
    <Accordion type="single" collapsible>
      <AccordionItem value="item1" variant="ghost">
        <AccordionTrigger>Section One</AccordionTrigger>
        <AccordionContent>
          <p className="text-sm text-muted-foreground">
            This is a ghost variant accordion — no borders, clean styling.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item2" variant="ghost">
        <AccordionTrigger>Section Two</AccordionTrigger>
        <AccordionContent>
          <p className="text-sm text-muted-foreground">Ghost accordions work well in sidebars and compact layouts.</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item3" variant="ghost">
        <AccordionTrigger>Section Three</AccordionTrigger>
        <AccordionContent>
          <p className="text-sm text-muted-foreground">Each item has border:0 in ghost mode.</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const Card: Story = {
  render: () => (
    <Accordion type="single" collapsible className="max-w-md">
      <AccordionItem value="feature1" variant="card">
        <AccordionTrigger>Active Noise Cancellation</AccordionTrigger>
        <AccordionContent>
          <p className="text-sm text-muted-foreground">
            Advanced ANC technology with 8 microphones detects and cancels ambient noise in real time, letting you focus
            on your music.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="feature2" variant="card">
        <AccordionTrigger>Transparency Mode</AccordionTrigger>
        <AccordionContent>
          <p className="text-sm text-muted-foreground">
            Stay aware of your surroundings with one-tap transparency mode — perfect for commuting and outdoor
            activities.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="feature3" variant="card">
        <AccordionTrigger>Multipoint Connection</AccordionTrigger>
        <AccordionContent>
          <p className="text-sm text-muted-foreground">
            Connect to two Bluetooth devices simultaneously and seamlessly switch between them — phone, laptop, or
            tablet.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}
