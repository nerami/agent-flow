# Theme Cycle (Light/Dark/System) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the 2-state theme toggle to a 3-state cycle button: light → dark → system, where system follows the OS preference live.

**Architecture:** The `useTheme` store gains a `preference` value (`'light' | 'dark' | 'system'`); system is represented by the **absence** of `localStorage.theme`, the semantics the pre-paint script and system listener already implement. `cycleTheme()` replaces `toggleTheme()` (TopBar is the only call site). The TopBar button shows sun/moon/monitor by preference. `layout.tsx` is untouched.

**Tech Stack:** Next.js 16 (App Router), React 19 (`useSyncExternalStore`). No new dependencies.

**Spec:** `docs/superpowers/specs/2026-06-05-theme-cycle-system-design.md`

**Note on testing:** No test runner in the web app (unchanged). Verification per task is `pnpm build`; Task 3 runs a Playwright suite against the dev server.

All paths relative to the worktree root `/Users/zrmn/Documents/playground/agent-flow/feature/light-theme/`.

---

### Task 1: `useTheme` gains `preference` and `cycleTheme`

**Files:**
- Modify: `web/hooks/use-theme.ts` (full rewrite, currently ~71 lines)

- [ ] **Step 1: Replace file contents**

Replace the entire contents of `web/hooks/use-theme.ts` with:

```tsx
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
```

Note: the system listener now gates on in-memory `preferenceState` instead of
re-reading localStorage — same behavior (preference is initialized from and
kept in sync with storage), one source of truth, and it keeps working when
storage is blocked mid-session.

- [ ] **Step 2: Verify build fails (toggleTheme consumer)**

Run: `cd web && pnpm build`
Expected: FAILS — `top-bar.tsx` destructures `toggleTheme`, which no longer exists. This confirms the only consumer; Task 2 fixes it. (If the build passes, search for stale `toggleTheme` references: `grep -rn toggleTheme web/ --include='*.ts*'`.)

- [ ] **Step 3: Commit (hook only — branch builds again after Task 2)**

Do NOT commit yet. Proceed to Task 2 and commit both files together so every commit builds.

---

### Task 2: TopBar cycle button with monitor icon

**Files:**
- Modify: `web/components/agent-visualizer/top-bar.tsx`

- [ ] **Step 1: Add MonitorIcon**

Directly below the existing `MoonIcon` function, add:

```tsx
function MonitorIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  )
}
```

- [ ] **Step 2: Rewire the theme button**

In the `TopBar` component body, change:

```tsx
  const { isDark, toggleTheme } = useTheme()
```

to:

```tsx
  const { isDark, preference, cycleTheme } = useTheme()
```

(`isDark` is still used for `COLORS = getColors(isDark)` — keep it.)

Then replace the theme ToggleButton:

```tsx
        <ToggleButton active={!isDark} onClick={toggleTheme} style={{ border: `1px solid ${COLORS.toggleBorder}` }}>
          {isDark ? <MoonIcon /> : <SunIcon />}
        </ToggleButton>
```

with:

```tsx
        <ToggleButton active={preference !== 'system'} onClick={cycleTheme} style={{ border: `1px solid ${COLORS.toggleBorder}` }}>
          <span title={`Theme: ${preference}`}>
            {preference === 'light' ? <SunIcon /> : preference === 'dark' ? <MoonIcon /> : <MonitorIcon />}
          </span>
        </ToggleButton>
```

(`ToggleButton` does not accept a `title` prop — the `span` carries the tooltip without touching the shared component. `active` lit = manual override engaged; system mode renders unlit.)

- [ ] **Step 3: Verify build passes**

Run: `cd web && pnpm build`
Expected: compiles clean, no remaining `toggleTheme` references.

- [ ] **Step 4: Commit both files**

```bash
git add web/hooks/use-theme.ts web/components/agent-visualizer/top-bar.tsx
git commit -m "feat(theme): 3-state cycle button — light, dark, system"
```

---

### Task 3: Runtime verification (Playwright)

**Files:**
- Create: `/tmp/verify-theme-cycle.mjs` (throwaway, not committed)

Prereqs: dev server running in the worktree (check `lsof -nP -iTCP:3000 -sTCP:LISTEN`; if absent, `cd web && pnpm dev` in background). Playwright installed at `/tmp/pw-verify` from the previous feature's verification (`cd /tmp/pw-verify && npm ls playwright` to confirm; reinstall with `npm install playwright@1.60.0 && npx playwright install chromium` if missing).

- [ ] **Step 1: Write the verification script**

Create `/tmp/verify-theme-cycle.mjs`:

```js
import { chromium } from 'playwright'

const URL = 'http://localhost:3000'
const browser = await chromium.launch()
let failures = 0
const check = (name, ok, detail) => {
  console.log(`${ok ? '✅' : '❌'} ${name}${detail ? ' — ' + detail : ''}`)
  if (!ok) failures++
}

const state = async (page) => page.evaluate(() => ({
  dark: document.documentElement.classList.contains('dark'),
  stored: (() => { try { return localStorage.getItem('theme') } catch { return 'ERR' } })(),
}))

// Theme button: contains sun circle, moon path, or monitor rect.
const themeBtn = (page) => page.locator(
  'button:has(svg circle[r="4"]), button:has(svg path[d^="M21 12.79"]), button:has(svg rect[x="2"][y="3"])'
).first()
const btnTitle = (page) => page.locator('span[title^="Theme:"]').getAttribute('title')

// ── 1. Full cycle from system start (dark OS) ──
{
  const c = await browser.newContext({ colorScheme: 'dark' })
  const page = await c.newPage()
  await page.goto(URL, { waitUntil: 'networkidle' })
  let s = await state(page)
  check('1a. dark OS, no key → system mode, dark', s.dark && s.stored === null,
    JSON.stringify(s) + ' title=' + await btnTitle(page))
  check('1b. title shows system', (await btnTitle(page)) === 'Theme: system')

  await themeBtn(page).click(); await page.waitForTimeout(200)
  s = await state(page)
  check('1c. click → light, stored=light', !s.dark && s.stored === 'light',
    JSON.stringify(s) + ' title=' + await btnTitle(page))
  check('1d. title shows light', (await btnTitle(page)) === 'Theme: light')

  await themeBtn(page).click(); await page.waitForTimeout(200)
  s = await state(page)
  check('1e. click → dark, stored=dark', s.dark && s.stored === 'dark')
  check('1f. title shows dark', (await btnTitle(page)) === 'Theme: dark')

  await themeBtn(page).click(); await page.waitForTimeout(200)
  s = await state(page)
  check('1g. click → system: key removed, follows dark OS', s.dark && s.stored === null)
  check('1h. title shows system', (await btnTitle(page)) === 'Theme: system')

  // live OS flip in system mode → followed
  await page.emulateMedia({ colorScheme: 'light' }); await page.waitForTimeout(300)
  s = await state(page)
  check('1i. system mode follows live OS flip to light', !s.dark && s.stored === null)
  await c.close()
}

// ── 2. Reload restores each state ──
for (const [seed, wantDark, wantStored, label] of [
  ['light', false, 'light', 'light'],
  ['dark', true, 'dark', 'dark'],
  [null, true, null, 'system (dark OS)'],
]) {
  const c = await browser.newContext({ colorScheme: 'dark' })
  const page = await c.newPage()
  if (seed) await page.addInitScript((t) => localStorage.setItem('theme', t), seed)
  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.reload({ waitUntil: 'networkidle' })
  const s = await state(page)
  check(`2. reload restores ${label}`, s.dark === wantDark && s.stored === wantStored, JSON.stringify(s))
  await c.close()
}

// ── 3. Probes ──
{
  // explicit choice: OS flip ignored (regression check)
  const c = await browser.newContext({ colorScheme: 'dark' })
  const page = await c.newPage()
  await page.addInitScript(() => localStorage.setItem('theme', 'light'))
  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.emulateMedia({ colorScheme: 'light' }); await page.waitForTimeout(200)
  await page.emulateMedia({ colorScheme: 'dark' }); await page.waitForTimeout(300)
  const s = await state(page)
  check('3a. 🔍 explicit light: OS flips ignored', !s.dark && s.stored === 'light', JSON.stringify(s))
  await c.close()
}
{
  // rapid: 6 clicks from system → back to system, key absent
  const c = await browser.newContext({ colorScheme: 'dark' })
  const page = await c.newPage()
  await page.goto(URL, { waitUntil: 'networkidle' })
  for (let i = 0; i < 6; i++) await themeBtn(page).click()
  await page.waitForTimeout(400)
  const s = await state(page)
  check('3b. 🔍 6 rapid clicks → system again, key absent, dark OS honored',
    s.dark && s.stored === null, JSON.stringify(s) + ' title=' + await btnTitle(page))
  await c.close()
}

await browser.close()
console.log(failures === 0 ? '\nALL CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`)
process.exit(failures === 0 ? 0 : 1)
```

- [ ] **Step 2: Run it**

```bash
cd /tmp/pw-verify && cp /tmp/verify-theme-cycle.mjs . && node verify-theme-cycle.mjs
```

Expected: `ALL CHECKS PASSED` (13 checks). Any ❌ → superpowers:systematic-debugging before touching code.

- [ ] **Step 3: Re-run previous feature's suite (regression)**

```bash
cd /tmp/pw-verify && node verify-theme-toggle.mjs
```

Expected: prior suite's persistence/system-fallback checks still pass. KNOWN DIVERGENCE: that suite assumes 2-state toggling. With the cycle, click sequences land on different states (e.g. its check 2b clicks once from light-OS system mode expecting dark; the cycle yields light). If only such assertions fail in ways consistent with the new cycle order, note it in the report rather than treating it as a bug — the new suite supersedes them.
