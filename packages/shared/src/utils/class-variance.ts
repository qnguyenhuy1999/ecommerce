/**
 * Class Variance Authority (CVA) helper
 * Simplified implementation for variant merging
 */

import { clsx, type ClassValue } from 'clsx'

type ClassDictionary = Record<string, boolean | undefined | null>
type ClassArray = (string | ClassDictionary | undefined | null | false)[]

function _join(arr: (string | undefined | null | false)[]): string {
  return clsx(arr)
}

function _clsxDictionary(dict: ClassDictionary): string {
  return Object.entries(dict)
    .filter(([, value]) => Boolean(value))
    .map(([key]) => key)
    .join(' ')
}

export function cva(
  base: string | ClassArray,
  config: {
    variants?: Partial<Record<string, Partial<Record<string, string | ClassArray>>>>
    compoundVariants?: Array<Record<string, string> & { class: string | ClassArray }>
    defaultVariants?: Partial<Record<string, string>>
  },
) {
  return (props?: Record<string, string | undefined>) => {
    const { variants = {}, compoundVariants = [], defaultVariants = {} } = config

    // Resolve base classes
    const baseClasses = clsx(base)

    // Resolve variant classes
    const variantClasses: string[] = []
    for (const [key, value] of Object.entries(props ?? {})) {
      const variantMap = variants[key]
      if (variantMap) {
        const resolved = value ?? defaultVariants[key]
        if (resolved === undefined) {
          continue
        }

        const v = variantMap[resolved]
        if (v !== undefined) {
          variantClasses.push(clsx(v as ClassValue))
        }
      }
    }

    // Resolve compound variants
    const compoundClasses: string[] = []
    for (const cv of compoundVariants) {
      const { class: cvClass, ...cvProps } = cv
      const matches = Object.entries(cvProps).every(([k, v]) => props?.[k] === v)
      if (matches) {
        compoundClasses.push(clsx(cvClass as ClassValue))
      }
    }

    return clsx(baseClasses, variantClasses, compoundClasses)
  }
}

export { _join as join, _clsxDictionary as classDictionary }
