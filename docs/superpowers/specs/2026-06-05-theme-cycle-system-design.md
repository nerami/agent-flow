# Theme Cycle Button with System Option — Design

**Date:** 2026-06-05
**Branch:** `light-theme`
**Status:** Approved (Approach A: system = absence of localStorage key)
**Builds on:** `2026-06-05-theme-toggle-design.md`

## Goal

Extend the 2-state sun/moon theme toggle to a 3-state cycle button:
light → dark → system. "System" follows the OS `prefers-color-scheme` live.

## Current State

- `web/hooks/use-theme.ts`: module-level store + `useSyncExternalStore`;
  `toggleTheme()` flips `.dark` and writes `localStorage.theme = 'dark'|'light'`.
  System `matchMedia` listener applies only when no valid (`'dark'`/`'light'`)
  saved value exists.
- `web/app/layout.tsx`: pre-paint script — valid saved value wins, anything
  else (including absence) falls back to `prefers-color-scheme`.
- `web/components/agent-visualizer/top-bar.tsx`: sun/moon `ToggleButton`,
  `active={!isDark}`, onClick `toggleTheme`.

## Design

### State model

`preference: 'light' | 'dark' | 'system'`, where **system is represented by
the absence of `localStorage.theme`** — the semantics the pre-paint script and
system listener already implement. No third stored value is introduced.

### 1. `web/hooks/use-theme.ts`

- Store tracks `preference` alongside `isDark`:
  - Init: stored `'dark'` → `('dark', true)`; stored `'light'` → `('light', false)`;
    anything else → `('system', current .dark class state)` (class was set by the
    pre-paint script from the OS preference).
  - `isDark` for `'system'` is whatever the OS says; the existing `matchMedia`
    listener keeps it live (it already bails when a valid value is stored).
- `cycleTheme()` replaces `toggleTheme()` (only call site is TopBar):
  - light → dark: set preference `'dark'`, `localStorage.setItem('theme','dark')`, `setTheme(true)`.
  - dark → system: `localStorage.removeItem('theme')`, preference `'system'`,
    `setTheme(matchMedia('(prefers-color-scheme: dark)').matches)`.
  - system → light: `localStorage.setItem('theme','light')`, preference `'light'`, `setTheme(false)`.
  - All storage access in `try/catch` (existing pattern).
- Hook returns `{ isDark, preference, cycleTheme }`. Snapshot for
  `useSyncExternalStore` stays a primitive-compatible approach: two stores are
  overkill — keep one snapshot object cached and replaced on change, or expose
  two `useSyncExternalStore` calls over primitive getters (`isDark`,
  `preference`). Implementation uses two primitive getters to avoid
  object-identity churn breaking the snapshot-caching contract.
- Server snapshots: `isDark` → `true`, `preference` → `'system'` (stable).

### 2. `web/components/agent-visualizer/top-bar.tsx`

- Add `MonitorIcon` (16×16, `stroke="currentColor"`, strokeWidth 2 — matches
  existing icon style): display rect + stand.
- Theme button:
  - Icon by `preference`: `'light'` → `SunIcon`, `'dark'` → `MoonIcon`,
    `'system'` → `MonitorIcon`.
  - `active={preference !== 'system'}` — lit means manual override engaged.
  - `title={'Theme: ' + preference}` for icon-only clarity.
  - `onClick={cycleTheme}`.

### 3. `web/app/layout.tsx`

Untouched. Absence-of-key semantics already correct.

## Out of Scope

- Real light palette values (`transformColor` identity placeholder), CSS-var
  `.dark` block, aria-labels file-wide — unchanged from previous spec.

## Error Handling

- `localStorage` failures: theme still cycles in-session, preference just does
  not persist (existing try/catch pattern).
- SSR: stable server snapshots, no window access at module eval beyond the
  existing guarded init.

## Testing

No test runner (unchanged). Verify:

1. `pnpm build` clean.
2. Playwright suite (extend `/tmp/verify-theme-toggle.mjs`):
   - Cycle from each start state: icon/class/storage transitions
     light→dark→system→light correct.
   - System mode: `localStorage.theme` absent; live OS flips followed.
   - Explicit mode: OS flips ignored (regression of prior behavior).
   - Reload in each of the 3 states restores the same preference.
