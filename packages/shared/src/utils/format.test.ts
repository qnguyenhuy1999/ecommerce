import { describe, expect, it } from 'vitest'
import {
  formatCompactCurrency,
  formatCurrency,
  formatDate,
  formatDateIntl,
  formatDateTime,
  formatPercent,
} from './format'

const SAMPLE_ISO = '2026-05-27T10:00:00.000Z'

describe('format utilities', () => {
  it('formats currency with the default options', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56')
  })

  it('formats compact currency for dashboard summaries', () => {
    expect(formatCompactCurrency(12500)).toBe(
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(12500),
    )
  })

  it('formats percentages with a configurable precision', () => {
    expect(formatPercent(12.345)).toBe('12.3%')
    expect(formatPercent(12.345, 2)).toBe('12.35%')
  })

  it('formats dates with date-fns patterns', () => {
    expect(formatDate(SAMPLE_ISO)).toBe('May 27, 2026')
  })

  it('formats locale-aware date output through shared helpers', () => {
    expect(formatDateIntl(SAMPLE_ISO)).toBe(new Date(SAMPLE_ISO).toLocaleDateString())
    expect(
      formatDateIntl(
        SAMPLE_ISO,
        {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        },
        'en-US',
      ),
    ).toBe(
      new Date(SAMPLE_ISO).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    )
  })

  it('formats locale-aware date-time output through shared helpers', () => {
    expect(formatDateTime(SAMPLE_ISO)).toBe(new Date(SAMPLE_ISO).toLocaleString())
    expect(
      formatDateTime(SAMPLE_ISO, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    ).toBe(
      new Date(SAMPLE_ISO).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    )
  })
})
