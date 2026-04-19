import { useRef, useCallback } from 'react'

export function useThrottle<T extends (...args: Parameters<T>) => ReturnType<T>>(
  callback: T,
  delay: number,
): T {
  const lastRun = useRef(Date.now())

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now()
      if (now - lastRun.current >= delay) {
        callback(...args)
        lastRun.current = now
      }
    }) as T,
    [callback, delay],
  )
}
