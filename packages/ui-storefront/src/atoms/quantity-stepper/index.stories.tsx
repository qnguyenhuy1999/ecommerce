import type { Meta, StoryObj } from '@storybook/react'

import { useState } from 'react'

import { QuantityStepper } from './index'

const meta: Meta<typeof QuantityStepper> = {
  title: 'ui-storefront/atoms/QuantityStepper',
  component: QuantityStepper,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof QuantityStepper>

function StepperWithState(props: React.ComponentProps<typeof QuantityStepper>) {
  const [val, setVal] = useState(props.value)
  return <QuantityStepper {...props} value={val} onChange={setVal} />
}

export const Default: Story = {
  render: () => <StepperWithState value={1} onChange={() => {}} />,
}

export const Value2: Story = {
  render: () => <StepperWithState value={2} onChange={() => {}} />,
}

export const Value5: Story = {
  render: () => <StepperWithState value={5} onChange={() => {}} />,
}

export const Value10: Story = {
  render: () => <StepperWithState value={10} onChange={() => {}} />,
}

export const AtMax: Story = {
  render: () => <StepperWithState value={99} max={99} onChange={() => {}} />,
}

export const AtMin: Story = {
  render: () => <StepperWithState value={1} min={1} onChange={() => {}} />,
}

export const SmallSize: Story = {
  render: () => <StepperWithState value={3} size="sm" onChange={() => {}} />,
}

export const SmallAtMin: Story = {
  render: () => <StepperWithState value={1} size="sm" onChange={() => {}} />,
}

export const SmallAtMax: Story = {
  render: () => <StepperWithState value={99} size="sm" onChange={() => {}} />,
}

export const Disabled: Story = {
  render: () => <StepperWithState value={5} disabled onChange={() => {}} />,
}

export const CustomMinMax: Story = {
  render: () => <StepperWithState value={3} min={0} max={10} onChange={() => {}} />,
}
