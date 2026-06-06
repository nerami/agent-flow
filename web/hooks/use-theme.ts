'use client'

import { useSyncExternalStore } from 'react'

export type ThemePreference = 'light' | 'dark' | 'system'

// ─── Module-level theme store ────────────────────────────────────────────────
// Single source of truth shared by every useTheme() caller, so a change from
// any component re-renders all of them (per-instance useState would not).
// "System" preference is represented by the ABSENCE of localStorage.theme —
// the same semantics the layout.tsx pre-paint script implements.

function readStoredPreference(): ThemePreference {
  try {
    const t = localStorage.getItem('theme')
    if (t === 'dark' || t === 'light') return t
  } catch {
    // localStorage unavailable — treat as no saved choice
  }
  return 'system'
}

let isDarkState =
  typeof window !== 'undefined'
    ? document.documentElement.classList.contains('dark')
    : true

let preferenceState: ThemePreference =
  typeof window !== 'undefined' ? readStoredPreference() : 'system'

const listeners = new Set<() => void>()

function setTheme(dark: boolean) {
  isDarkState = dark
  document.documentElement.classList.toggle('dark', dark)
  listeners.forEach((l) => l())
}

/** Cycle light → dark → system → light, persisting explicit choices. */
function cycleTheme() {
  const next: ThemePreference =
    preferenceState === 'light' ? 'dark'
    : preferenceState === 'dark' ? 'system'
    : 'light'
  preferenceState = next
  try {
    if (next === 'system') localStorage.removeItem('theme')
    else localStorage.setItem('theme', next)
  } catch {
    // localStorage unavailable — theme still cycles, just won't persist
    // across reloads.
  }
  setTheme(
    next === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : next === 'dark'
  )
}

// Follow live OS preference changes only while in system mode.
let systemListenerAttached = false
function attachSystemListener() {
  if (systemListenerAttached || typeof window === 'undefined') return
  systemListenerAttached = true
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (e) => {
      if (preferenceState !== 'system') return
      setTheme(e.matches)
    })
}

function subscribe(listener: () => void) {
  attachSystemListener()
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const getIsDark = () => isDarkState
const getPreference = () => preferenceState
// SSR defaults: dark + system. The pre-paint script corrects the DOM class
// before hydration paints, and the client snapshots re-derive from it.
const getServerIsDark = () => true
const getServerPreference = (): ThemePreference => 'system'

/**
 * Returns the current dark-mode flag, the user's theme preference, and a
 * cycle function (light → dark → system). Backed by a shared store reading
 * the .dark class on <html> (initialized by layout.tsx's inline script).
 */
export function useTheme(): {
  isDark: boolean
  preference: ThemePreference
  cycleTheme: () => void
} {
  const isDark = useSyncExternalStore(subscribe, getIsDark, getServerIsDark)
  const preference = useSyncExternalStore(subscribe, getPreference, getServerPreference)
  return { isDark, preference, cycleTheme }
}
