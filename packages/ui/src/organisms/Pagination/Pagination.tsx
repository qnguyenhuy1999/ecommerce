import { PaginationClient, type PaginationClientProps } from './PaginationClient'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  siblings?: number
  boundaries?: number
  className?: string
}

function buildPageList(
  page: number,
  totalPages: number,
  siblings: number,
  boundaries: number,
): (number | 'ellipsis')[] {
  const range = (from: number, to: number): number[] =>
    Array.from({ length: to - from + 1 }, (_, i) => from + i)

  const leftRange = range(1, Math.min(boundaries, totalPages))
  const rightRange = range(
    Math.max(totalPages - boundaries + 1, 1),
    totalPages,
  )

  const middleStart = page - siblings
  const middleEnd = page + siblings
  const middleRange = range(
    Math.max(2, middleStart),
    Math.min(totalPages - 1, middleEnd),
  )

  const segments: (number | 'ellipsis')[] = []

  segments.push(...leftRange)

  if (middleRange.length > 0) {
    const lastLeft = leftRange[leftRange.length - 1] ?? 0
    const firstMiddle = middleRange[0] ?? 0
    if (firstMiddle - lastLeft > 1) segments.push('ellipsis')
    segments.push(...middleRange)
  }

  if (rightRange.length > 0) {
    const lastMiddle =
      middleRange.length > 0
        ? middleRange[middleRange.length - 1] ?? 0
        : leftRange[leftRange.length - 1] ?? 0
    const firstRight = rightRange[0] ?? 0
    if (firstRight - lastMiddle > 1) segments.push('ellipsis')
    segments.push(...rightRange)
  }

  return segments
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblings = 1,
  boundaries = 1,
  className,
}: PaginationProps) {
  const pages = buildPageList(currentPage, totalPages, siblings, boundaries)

  const clientProps: PaginationClientProps = {
    page: currentPage,
    pages,
    totalPages,
    onPageChange,
    className,
  }

  return <PaginationClient {...clientProps} />
}

export { Pagination }