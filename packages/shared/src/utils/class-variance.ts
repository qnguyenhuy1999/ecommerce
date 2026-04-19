/**
 * Class Variance Authority (CVA) helper
 * Simplified implementation for variant merging
 */

type ClassDictionary = Record<string, boolean | undefined | null>
type ClassArray = (string | ClassDictionary | undefined | null | false)[]
type ClassValue = string | ClassDictionary | ClassArray

function _join(arr: (string | undefined | null | false)[]): string {
  return arr.filter(Boolean).join(' ')
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
    variants?: Record<string, Record<string, string | ClassArray>>
    compoundVariants?: Array<Record<string, string> & { class: string | ClassArray }>
    defaultVariants?: Record<string, string>
  },
) {
  return (props?: Record<string, string | undefined>) => {
    const { variants = {}, compoundVariants = [], defaultVariants = {} } = config

    // Resolve base classes
    const baseClasses = Array.isArray(base) ? base.filter(Boolean).join(' ') : base

    // Resolve variant classes
    const variantClasses: string[] = []
    for (const [key, value] of Object.entries(props ?? {})) {
      if (variants[key]) {
        const resolved = value ?? defaultVariants[key]
        if (resolved && variants[key][resolved]) {
          const v = variants[key][resolved]
          variantClasses.push(Array.isArray(v) ? v.filter(Boolean).join(' ') : v)
        }
      }
    }

    // Resolve compound variants
    const compoundClasses: string[] = []
    for (const cv of compoundVariants) {
      const { class: cvClass, ...cvProps } = cv
      const matches = Object.entries(cvProps).every(
        ([k, v]) => props?.[k] === v,
      )
      if (matches) {
        compoundClasses.push(Array.isArray(cvClass) ? cvClass.filter(Boolean).join(' ') : cvClass)
      }
    }

    return [baseClasses, ...variantClasses, ...compoundClasses].filter(Boolean).join(' ')
  }
}

export { _join as join, _clsxDictionary as classDictionary }
