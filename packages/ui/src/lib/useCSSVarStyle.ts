import * as React from 'react'

/**
 * Converts a Record of CSS custom property names to values into a
 * React.CSSProperties object. Undefined values are omitted so they do not
 * override existing cascade values.
 *
 * @example
 * const style = useCSSVarStyle({ '--slider-value': `${pct}%` })
 * return <div style={style} />
 */
export function useCSSVarStyle(
  vars: Record<string, string | number | undefined>,
): React.CSSProperties {
  return React.useMemo(() => {
    const style: Record<string, string> = {}
    for (const [key, val] of Object.entries(vars)) {
      if (val !== undefined) {
        style[key] = String(val)
      }
    }
    return style as React.CSSProperties
    // JSON.stringify gives a stable dep for the object contents
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Intentionally depend on JSON.stringify(vars) for deep-ish compare.
  }, [JSON.stringify(vars)])
}
