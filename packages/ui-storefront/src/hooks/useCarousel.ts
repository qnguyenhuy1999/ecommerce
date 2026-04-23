import { useCallback, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'

export interface UseCarouselOptions {
  /** Total number of items in the carousel */
  total: number
  /** Index to start on (default: 0) */
  initialIndex?: number
  /** Auto-advance slides (default: false) */
  autoPlay?: boolean
  /** Milliseconds between auto-advance (default: 4000) */
  autoPlayInterval?: number
  /** Wrap around at boundaries (default: true) */
  loop?: boolean
}

export interface UseCarouselReturn {
  activeIndex: number
  isPlaying: boolean
  canScrollLeft: boolean
  canScrollRight: boolean
  goTo: (index: number) => void
  prev: () => void
  next: () => void
  pause: () => void
  resume: () => void
}

/**
 * Manages carousel state: active index, auto-play, and scroll boundary detection
 * when attached to a scroll container via the returned `scrollRef`.
 *
 * @example
 * const { activeIndex, prev, next, scrollRef, canScrollLeft, canScrollRight } = useCarousel({ total: items.length })
 */
export function useCarousel({
  total,
  initialIndex = 0,
  autoPlay = false,
  autoPlayInterval = 4000,
  loop = true,
}: UseCarouselOptions): UseCarouselReturn & { scrollRef: RefObject<HTMLDivElement | null> } {
  const [activeIndex, setActiveIndex] = useState(initialIndex)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = useCallback(
    (index: number) => {
      let next = index
      if (loop) {
        next = ((index % total) + total) % total
      } else {
        next = Math.max(0, Math.min(index, total - 1))
      }
      setActiveIndex(next)

      const el = scrollRef.current
      if (el) {
        const itemWidth = el.querySelector<HTMLElement>(':scope > div')?.clientWidth ?? 300
        el.scrollTo({ left: next * itemWidth, behavior: 'smooth' })
      }
    },
    [loop, total],
  )

  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo])
  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo])
  const pause = useCallback(() => setIsPlaying(false), [])
  const resume = useCallback(() => setIsPlaying(true), [])

  // Sync scroll state for boundary buttons
  const updateScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 8)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateScrollState()
    el.addEventListener('scroll', updateScrollState, { passive: true })
    const ro = new ResizeObserver(updateScrollState)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', updateScrollState)
      ro.disconnect()
    }
  }, [updateScrollState])

  // Auto-play
  useEffect(() => {
    if (!isPlaying || total <= 1) return
    intervalRef.current = setInterval(() => {
      setActiveIndex((i) => (loop ? (i + 1) % total : Math.min(i + 1, total - 1)))
    }, autoPlayInterval)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying, total, loop, autoPlayInterval])

  return {
    activeIndex,
    isPlaying,
    canScrollLeft,
    canScrollRight,
    goTo,
    prev,
    next,
    pause,
    resume,
    scrollRef,
  }
}
