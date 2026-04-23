import { useCallback, useEffect, useRef, useState } from 'react'

export interface UseCountdownOptions {
  /** The target future date to count down to */
  targetDate: Date
  /** Called once when the countdown reaches zero */
  onExpire?: () => void
}

export interface UseCountdownReturn {
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
  /** Zero-padded string "DD:HH:MM:SS" (omits days if days === 0) */
  formatted: string
  pause: () => void
  resume: () => void
}

function computeTimeLeft(targetDate: Date) {
  const diff = Math.max(0, targetDate.getTime() - Date.now())
  const totalSeconds = Math.floor(diff / 1000)
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    isExpired: diff === 0,
  }
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

/**
 * Counts down to a target date and returns days/hours/minutes/seconds plus
 * a formatted display string. Fires `onExpire` once when the timer reaches zero.
 *
 * @example
 * const { days, hours, minutes, seconds, formatted } = useCountdown({
 *   targetDate: new Date('2026-12-31T23:59:59'),
 * })
 */
export function useCountdown({ targetDate, onExpire }: UseCountdownOptions): UseCountdownReturn {
  const [timeLeft, setTimeLeft] = useState(() => computeTimeLeft(targetDate))
  const [paused, setPaused] = useState(false)
  const expiredRef = useRef(false)

  useEffect(() => {
    if (paused || timeLeft.isExpired) return

    const id = setInterval(() => {
      const next = computeTimeLeft(targetDate)
      setTimeLeft(next)

      if (next.isExpired && !expiredRef.current) {
        expiredRef.current = true
        onExpire?.()
      }
    }, 1000)

    return () => clearInterval(id)
  }, [paused, targetDate, onExpire, timeLeft.isExpired])

  const pause = useCallback(() => setPaused(true), [])
  const resume = useCallback(() => setPaused(false), [])

  const { days, hours, minutes, seconds, isExpired } = timeLeft
  const formatted =
    days > 0
      ? `${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
      : `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`

  return { days, hours, minutes, seconds, isExpired, formatted, pause, resume }
}
