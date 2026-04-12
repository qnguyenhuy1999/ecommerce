import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Button } from '../button'
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './index'

const meta = {
  title: 'Atoms/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>A description of the card content.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>The main content of the card goes here.</p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Save</Button>
      </CardFooter>
    </Card>
  ),
}

export const WithoutFooter = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Project Update</CardTitle>
        <CardDescription>Q1 2026 Progress Report</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Your project is progressing well. 75% complete with all milestones on track.</p>
      </CardContent>
    </Card>
  ),
}

export const WithActions = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>New Feature</CardTitle>
        <CardDescription>Released in v2.0</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This new feature allows you to do more with less effort.</p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" size="sm">
          Dismiss
        </Button>
        <Button size="sm">Learn more</Button>
      </CardFooter>
    </Card>
  ),
}
