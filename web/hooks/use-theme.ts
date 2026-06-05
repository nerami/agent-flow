'use client'

import { useState, useEffect } from 'react'

/**
 * Returns whether the app is currently in dark mode.
 * Reads the .dark class on <html> (set by layout.tsx inline script)
 * and stays in sync when the system preference changes.
 */
export function useTheme(): { isDark: boolean } {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true
    return document.documentElement.classList.contains('dark')
  })

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle('dark', e.matches)
      setIsDark(e.matches)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return { isDark }
}
