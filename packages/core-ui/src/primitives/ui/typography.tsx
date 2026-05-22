import type { ElementType } from 'react'
import type { PolymorphicComponentProps, PolymorphicPropsWithChildren } from '../../lib/polymorphic'
import { cn } from '../../lib/utils'
import { typographyVariantRecipes, type TypographyVariant } from '../../tokens/typography'

type TypographyProps<TElement extends ElementType = 'p'> = PolymorphicComponentProps<
  TElement,
  PolymorphicPropsWithChildren & {
    variant: TypographyVariant
  }
>

function Typography<TElement extends ElementType = 'p'>({
  as,
  children,
  className,
  variant,
  ...props
}: TypographyProps<TElement>) {
  const recipe = typographyVariantRecipes[variant]
  const Component = as ?? recipe.element

  return (
    <Component className={cn(recipe.className, className)} {...props}>
      {children}
    </Component>
  )
}

/**
 * @deprecated Prefer `Typography` with `variant="h1"`.
 */
function TypographyH1(props: Omit<TypographyProps<'h1'>, 'as' | 'variant'>) {
  return <Typography<'h1'> variant="h1" {...props} />
}

/**
 * @deprecated Prefer `Typography` with `variant="h2"`.
 */
function TypographyH2(props: Omit<TypographyProps<'h2'>, 'as' | 'variant'>) {
  return <Typography<'h2'> variant="h2" {...props} />
}

/**
 * @deprecated Prefer `Typography` with `variant="h3"`.
 */
function TypographyH3(props: Omit<TypographyProps<'h3'>, 'as' | 'variant'>) {
  return <Typography<'h3'> variant="h3" {...props} />
}

/**
 * @deprecated Prefer `Typography` with `variant="h4"`.
 */
function TypographyH4(props: Omit<TypographyProps<'h4'>, 'as' | 'variant'>) {
  return <Typography<'h4'> variant="h4" {...props} />
}

/**
 * @deprecated Prefer `Typography` with `variant="body"`.
 */
function TypographyP(props: Omit<TypographyProps<'p'>, 'as' | 'variant'>) {
  return <Typography<'p'> variant="body" {...props} />
}

/**
 * @deprecated Prefer `Typography` with `variant="blockquote"`.
 */
function TypographyBlockquote(props: Omit<TypographyProps<'blockquote'>, 'as' | 'variant'>) {
  return <Typography<'blockquote'> variant="blockquote" {...props} />
}

/**
 * @deprecated Prefer `Typography` with `variant="label"` and `as="small"` when needed.
 */
function TypographySmall(props: Omit<TypographyProps<'small'>, 'variant'>) {
  return <Typography<'small'> as="small" variant="label" {...props} />
}

export {
  Typography,
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyP,
  TypographyBlockquote,
  TypographySmall,
}
export type { TypographyProps, TypographyVariant }
