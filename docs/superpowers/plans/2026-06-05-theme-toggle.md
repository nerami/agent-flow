# Theme Toggle Button Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a manual light/dark theme toggle button to the web app top bar, persisted in localStorage with system-preference fallback.

**Architecture:** Rework `useTheme()` from per-instance `useState` to a module-level store consumed via `useSyncExternalStore`, so all components re-render on toggle. The pre-paint inline script in `layout.tsx` honors `localStorage.theme` before falling back to `prefers-color-scheme`. A sun/moon `ToggleButton` in `top-bar.tsx` calls `toggleTheme()`.

**Tech Stack:** Next.js 16 (App Router), React 19 (`useSyncExternalStore`), Tailwind 4. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-06-05-theme-toggle-design.md`

**Note on testing:** The web app has no test runner (no vitest/jest configured; `web/package.json` scripts are dev/build/start only). Verification is `pnpm build` per task plus the manual checklist in Task 4. Do NOT add a test framework — out of scope.

All paths relative to the worktree root `/Users/zrmn/Documents/playground/agent-flow/feature/light-theme/`.

---

### Task 1: Rework `useTheme` into shared store with `toggleTheme`

**Files:**
- Modify: `web/hooks/use-theme.ts` (full rewrite, currently 27 lines)

- [ ] **Step 1: Replace file contents**

Replace the entire contents of `web/hooks/use-theme.ts` with:

```tsx
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
```

- [ ] **Step 2: Verify build passes**

Run: `cd web && pnpm build`
Expected: compiles with no type errors. All existing call sites destructure only `{ isDark }`, so the widened return type is non-breaking.

- [ ] **Step 3: Commit**

```bash
git add web/hooks/use-theme.ts
git commit -m "refactor(theme): shared useTheme store with toggleTheme"
```

---

### Task 2: Pre-paint script honors saved choice

**Files:**
- Modify: `web/app/layout.tsx:34-39` (inline script)

- [ ] **Step 1: Update the inline script**

In `web/app/layout.tsx`, replace:

```tsx
      {/* Apply .dark before first paint to prevent flash of wrong theme */}
      <script
        dangerouslySetInnerHTML={{
          __html: `if(window.matchMedia('(prefers-color-scheme: dark)').matches){document.documentElement.classList.add('dark')}`,
        }}
      />
```

with:

```tsx
      {/* Apply .dark before first paint to prevent flash of wrong theme.
          Saved choice in localStorage wins; otherwise follow system preference. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `try{var t=localStorage.getItem('theme')}catch(e){}var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d){document.documentElement.classList.add('dark')}`,
        }}
      />
```

Keep `className="light"` on `<html>` unchanged.

- [ ] **Step 2: Verify build passes**

Run: `cd web && pnpm build`
Expected: compiles clean.

- [ ] **Step 3: Commit**

```bash
git add web/app/layout.tsx
git commit -m "feat(theme): pre-paint script reads saved theme from localStorage"
```

---

### Task 3: Sun/moon toggle button in TopBar

**Files:**
- Modify: `web/components/agent-visualizer/top-bar.tsx`

- [ ] **Step 1: Add icon components**

In `top-bar.tsx`, directly below the existing `UnmutedIcon` function (after line 32), add:

```tsx
// ─── Theme SVG Icons ─────────────────────────────────────────────────────────

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="22" />
      <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" />
      <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" />
      <line x1="2" y1="12" x2="4" y2="12" />
      <line x1="20" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="19.07" x2="6.34" y2="17.66" />
      <line x1="17.66" y1="6.34" x2="19.07" y2="4.93" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}
```

- [ ] **Step 2: Destructure `toggleTheme` and render the button**

In the `TopBar` component, change line 116 from:

```tsx
  const { isDark } = useTheme()
```

to:

```tsx
  const { isDark, toggleTheme } = useTheme()
```

Then in the "Independent toggles" section, after the mute `ToggleButton` (currently lines 166-168), add:

```tsx
        <ToggleButton active={!isDark} onClick={toggleTheme} style={{ border: `1px solid ${COLORS.toggleBorder}` }}>
          {isDark ? <MoonIcon /> : <SunIcon />}
        </ToggleButton>
```

(`active={!isDark}` mirrors the mute button's pattern: lit when light mode is on, matching the sun icon.)

- [ ] **Step 3: Verify build passes**

Run: `cd web && pnpm build`
Expected: compiles clean.

- [ ] **Step 4: Commit**

```bash
git add web/components/agent-visualizer/top-bar.tsx
git commit -m "feat(theme): sun/moon toggle button in top bar"
```

---

### Task 4: Manual verification

**Files:** none (verification only)

- [ ] **Step 1: Start dev server**

Run: `cd web && pnpm dev`

- [ ] **Step 2: Verify in browser (http://localhost:3000)**

Checklist:
1. Toggle flips canvas + top-bar + panel colors instantly (all `useTheme()` consumers re-render).
2. Reload preserves the chosen theme (no flash of wrong theme).
3. DevTools → Application → Local Storage: `theme` key is `'dark'` or `'light'` after toggling.
4. Delete the `theme` key, reload: app follows OS preference again.
5. With a saved manual choice, flip OS theme: app does NOT change.

- [ ] **Step 3: Report results**

Record pass/fail per item. Any failure: use superpowers:systematic-debugging before changing code.
