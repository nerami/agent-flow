# Theme Toggle Button — Design

**Date:** 2026-06-05
**Branch:** `light-theme`
**Status:** Approved (Approach A)

## Goal

Manual light/dark toggle button in the web app's top bar, with localStorage
persistence and system-preference fallback.

## Current State

- `web/lib/colors.ts` exports `DARK_COLORS`, `LIGHT_COLORS`, and `getColors(isDark)`.
- `web/hooks/use-theme.ts` exposes `useTheme(): { isDark }`. Each hook instance
  keeps independent `useState` initialized from the `.dark` class on `<html>`,
  synced only via a `matchMedia('(prefers-color-scheme: dark)')` listener.
- `web/app/layout.tsx` has an inline pre-paint script that adds `.dark` based on
  system preference only.
- `web/components/agent-visualizer/top-bar.tsx` renders the right-aligned
  control group (Files/Chat/$Cost, Timeline, mute) using a local `ToggleButton`
  component. No theme toggle exists.
- Canvas drawing is already theme-aware: all draw functions receive a
  `colors: ColorPalette` parameter sourced from `getColors(isDark)`.

## Design

### 1. `web/hooks/use-theme.ts` — shared store + toggle

Replace per-instance `useState` with a module-level store consumed via
`useSyncExternalStore` so every component calling `useTheme()` re-renders when
the theme changes from anywhere.

- Module state: `isDark` boolean, `Set` of subscriber callbacks.
- `getSnapshot()`: current `isDark`. `getServerSnapshot()`: `true` (matches the
  SSR default; the pre-paint script corrects the DOM before hydration paints).
- `setTheme(dark: boolean)`: toggles `.dark` on `document.documentElement`,
  updates module state, notifies subscribers.
- `toggleTheme()`: `setTheme(!isDark)` and writes
  `localStorage.theme = 'dark' | 'light'` (manual choice persists).
- System listener (registered once at module level on first subscribe):
  `matchMedia` change applies `setTheme(e.matches)` **only when
  `localStorage.theme` is unset** — an explicit user choice always wins.
- Hook API becomes `useTheme(): { isDark: boolean; toggleTheme: () => void }`.
  Existing call sites destructure `{ isDark }` only, so no changes needed there.

### 2. `web/app/layout.tsx` — pre-paint script honors saved choice

Inline script order: read `localStorage.theme`; if `'dark'` or `'light'`, apply
it; otherwise fall back to `prefers-color-scheme: dark`. Wrapped in `try/catch`
(localStorage can throw in some privacy modes). Keep `className="light"` as the
SSR baseline.

### 3. `web/components/agent-visualizer/top-bar.tsx` — toggle button

- Add `SunIcon` / `MoonIcon` SVGs alongside the existing mute icons (same
  16×16, `stroke="currentColor"` style).
- Render one more `ToggleButton` in the "Independent toggles" group next to
  mute: `active={!isDark}`, `onClick={toggleTheme}`, showing `SunIcon` in light
  mode and `MoonIcon` in dark mode.
- `isDark`/`toggleTheme` come from `useTheme()` already called in `TopBar`.
  No new props on `TopBarProps`.

## Out of Scope

- `globals.css` `.dark` token block currently mirrors `:root` (Tailwind/oklch
  values identical in both themes). Real light values for CSS-variable-driven
  UI are a separate task. Canvas colors flow through `getColors()` and work
  regardless.

## Error Handling

- `localStorage` access wrapped in `try/catch` in both the inline script and
  the hook (Safari private mode, blocked storage).
- SSR: hook guards `typeof window === 'undefined'`, server snapshot is stable.

## Testing

No test infrastructure for the web app (no test runner configured). Verify by:

1. `pnpm build` (or `next build`) compiles clean.
2. Manual: toggle flips canvas + UI colors instantly across all components;
   reload preserves choice; clearing `localStorage.theme` restores
   system-preference behavior; OS theme flip while a manual choice is saved
   does NOT override it.
