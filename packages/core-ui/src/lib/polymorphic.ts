import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'

type AsProp<TElement extends ElementType> = {
  as?: TElement
}

type PropsToOmit<TElement extends ElementType, TProps extends object> = keyof (AsProp<TElement> &
  TProps)

export type PolymorphicComponentProps<
  TElement extends ElementType,
  TProps extends object = object,
> = TProps &
  AsProp<TElement> &
  Omit<ComponentPropsWithoutRef<TElement>, PropsToOmit<TElement, TProps>>

export interface PolymorphicPropsWithChildren {
  children?: ReactNode
}
