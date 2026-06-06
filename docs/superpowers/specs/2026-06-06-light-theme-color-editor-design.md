# Light Theme Color Editor — Design Spec

**Date:** 2026-06-06
**Branch:** `feature/light-theme`

## Overview

A floating developer tool for customizing `LIGHT_COLORS` at runtime. Visible only in development. Changes persist to `localStorage` and apply on next page reload. No component refactor required — override injection happens at module-init time in `colors.ts`.

## Decisions

| Question | Decision |
|---|---|
| Layout | Single panel, picker inline below list |
| Complex values | Read-only (lock icon), no picker |
| Live update | Save + reload (no reactive LIGHT_COLORS needed) |
| Reset | Per-color ↺ on modified rows + "Reset all" button |
| Visibility | Dev-only (`process.env.NODE_ENV === 'development'`) |
| Override strategy | `localStorage` read at module init, merged into `LIGHT_COLORS` |

## Architecture

### 1. `web/lib/colors.ts` — override injection (module init)

After the `LIGHT_COLORS` definition, add a block that reads `localStorage('lightColorOverrides')` and mutates the exported object:

```ts
// Dev override: read from localStorage and merge into LIGHT_COLORS
// This runs once at module init; page reload applies new overrides.
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  try {
    const raw = localStorage.getItem('lightColorOverrides')
    if (raw) {
      const overrides: Partial<Record<keyof typeof LIGHT_COLORS, string>> = JSON.parse(raw)
      Object.assign(LIGHT_COLORS, overrides)
    }
  } catch {
    // ignore parse errors
  }
}
```

`LIGHT_COLORS` is declared `as const` — cast it to `Record<string, string>` before `Object.assign`:

```ts
Object.assign(LIGHT_COLORS as Record<string, string>, overrides)
```

This is safe: overrides are only applied in dev, values are strings, and reload is always required before use.

### 2. `web/components/agent-visualizer/theme-color-editor.tsx` — new file

Self-contained React component. No external state management. Props: none.

**State:**
- `position: {x, y}` — popover position, initialized to bottom-right corner
- `minimized: boolean`
- `selectedKey: string | null` — currently selected color key
- `pendingOverrides: Record<string, string>` — unsaved changes (initialized from `localStorage` on mount)
- `pickerColor: string` — current hex value in picker

**Color group structure:**

Extract groups from `LIGHT_COLORS` by parsing the comment structure statically. Define a `COLOR_GROUPS` constant in the component file:

```ts
const COLOR_GROUPS: Array<{ label: string; keys: Array<keyof typeof LIGHT_COLORS> }> = [
  { label: 'Background', keys: ['void', 'hexGrid'] },
  { label: 'Primary Hologram', keys: ['holoBase', 'holoBright', 'holoHot'] },
  { label: 'Agent States', keys: ['idle', 'thinking', 'tool_calling', 'complete', 'error', 'paused', 'waiting_permission'] },
  // ... all groups
]
```

This is a static constant — no runtime parsing of comment strings.

**Complex value detection:**

A color value is "complex" (read-only) if it does not parse as a valid color via `colord`. Specifically: gradient strings, box-shadow strings, and partial `rgba(` bases (trailing comma) will fail `colord(value).isValid()`. Use that as the gate.

**Dragging:**

`onMouseDown` on the header captures initial pointer position and panel position. `onMouseMove` on `window` updates `position` state. `onMouseUp` removes the listener. Uses `useRef` to avoid stale closure issues.

**Picker:**

`@uiw/react-color-wheel` controlled by `pickerColor`. On color change, update `pickerColor` and `pendingOverrides[selectedKey]`. Hex text input syncs bidirectionally.

**Save + Reload:**

```ts
localStorage.setItem('lightColorOverrides', JSON.stringify(pendingOverrides))
window.location.reload()
```

**Reset all:**

```ts
localStorage.removeItem('lightColorOverrides')
window.location.reload()
```

**Per-color reset:**

Remove key from `pendingOverrides`. "Save + Reload" always writes the full `pendingOverrides` map. Rows with a key absent from `pendingOverrides` display the default `LIGHT_COLORS` value.

### 3. Mount point — `web/app-entry.tsx` and `web/webview-entry.tsx`

```tsx
{process.env.NODE_ENV === 'development' && <ThemeColorEditor />}
```

Mounted inside the root render, outside `<AgentVisualizer />` but in the same root. Positioned fixed, so it overlays everything.

## UI Behavior

### Normal state

```
┌─────────────────────────────────┐
│ ⠿  LIGHT THEME COLORS    ─  ✕  │  ← drag handle
├─────────────────────────────────┤
│  BACKGROUND                     │  ← group label
│  ██ void              #e8f0ff ↺ │  ← modified (amber highlight)
│  ██ hexGrid           #e0e8f5   │
│  AGENT STATES                   │
│  ██ idle              #1a8fcf   │
│  ██ tool_calling      #cc6600   │
│  UI CHROME                      │
│  ░░ scrubberFill      🔒        │  ← read-only
│           · · ·                 │
├─────────────────────────────────┤
│  Editing: void                  │
│        [color wheel]            │
│  ██  #e8f0ff                    │  ← hex input
├─────────────────────────────────┤
│  [Reset all]      [Save+Reload] │
└─────────────────────────────────┘
```

### Minimized state

```
┌─────────────────────┐
│ ⬡ Colors  2 modified ▲│
└─────────────────────┘
```

Click to expand. Badge shows count of pending overrides.

### "Modified" row

Row with amber background + border. `↺` button visible. Value shown is the pending override, not the default.

## Files Changed

| File | Change |
|---|---|
| `web/lib/colors.ts` | Add override injection block after `LIGHT_COLORS` |
| `web/components/agent-visualizer/theme-color-editor.tsx` | New file |
| `web/app-entry.tsx` | Mount `<ThemeColorEditor />` in dev |
| `web/webview-entry.tsx` | Mount `<ThemeColorEditor />` in dev |
| `package.json` (light-theme worktree) | Add `@uiw/react-color-wheel` dependency |

## Out of Scope

- Dark theme editing
- Live preview without reload
- Exporting overrides to source code automatically
- Editing complex values (gradients, shadows)
