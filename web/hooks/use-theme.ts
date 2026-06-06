'use client'

import { useSyncExternalStore } from 'react'

// ─── Module-level theme store ────────────────────────────────────────────────
// Single source of truth shared by every useTheme() caller, so a toggle from
// any component re-renders all of them (per-instance useState would not).

let isDarkState =
  typeof window !== 'undefined'
    ? document.documentElement.classList.contains('dark')
    : true

const listeners = new Set<() => void>()

function setTheme(dark: boolean) {
  isDarkState = dark
  document.documentElement.classList.toggle('dark', dark)
  listeners.forEach((l) => l())
}

/** Flip the theme and persist the explicit choice. */
function toggleTheme() {
  setTheme(!isDarkState)
  try {
    localStorage.setItem('theme', isDarkState ? 'dark' : 'light')
  } catch {
    // localStorage unavailable (e.g. blocked storage) — theme still toggles,
    // just won't persist across reloads.
  }
}

// Follow system preference changes only while the user has no saved choice.
let systemListenerAttached = false
function attachSystemListener() {
  if (systemListenerAttached || typeof window === 'undefined') return
  systemListenerAttached = true
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (e) => {
      try {
        if (localStorage.getItem('theme') !== null) return
      } catch {
        // fall through — without storage there can be no saved choice
      }
      setTheme(e.matches)
    })
}

function subscribe(listener: () => void) {
  attachSystemListener()
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const getSnapshot = () => isDarkState
// SSR default matches layout.tsx's pre-paint script outcome being unknown;
// the script corrects the DOM class before hydration paints.
const getServerSnapshot = () => true

/**
 * Returns whether the app is currently in dark mode, plus a toggle.
 * Backed by a shared store reading the .dark class on <html>
 * (initialized by layout.tsx's inline script).
 */
export function useTheme(): { isDark: boolean; toggleTheme: () => void } {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return { isDark, toggleTheme }
}
