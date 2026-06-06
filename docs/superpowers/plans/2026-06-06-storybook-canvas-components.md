# Storybook for Canvas Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Storybook 9 to the `web` package covering all canvas draw functions and React overlay components, with dark/light theme toggling via a toolbar button.

**Architecture:** `@storybook/react-vite` in `web/`, with `viteFinal` adding the `@tailwindcss/vite` plugin and the `@` path alias. A global decorator (`preview.tsx`) provides `StoryColorsContext` (the correct `ColorPalette`) and toggles `document.documentElement.classList.dark` when the toolbar theme changes. Canvas draw function stories wrap calls in a shared `CanvasRenderer` component that owns the canvas lifecycle and rAF loop.

**Tech Stack:** Storybook 9, `@storybook/react-vite`, `@storybook/addon-essentials`, React 19, Vite, Tailwind CSS v4, TypeScript

---

## File Map

**New — config:**
- `web/.storybook/main.ts` — Storybook config: framework, story glob, `viteFinal` for alias + Tailwind
- `web/.storybook/preview.tsx` — `globalTypes` toolbar, global theme decorator, CSS import

**New — utilities:**
- `web/stories/utils/canvas-renderer.tsx` — `CanvasRenderer` component + `StoryColorsContext`
- `web/stories/utils/mock-data.ts` — factory functions + scenario `Map` constants

**New — canvas stories:**
- `web/stories/agent-visualizer/canvas/draw-agents.stories.tsx`
- `web/stories/agent-visualizer/canvas/draw-bubbles.stories.tsx`
- `web/stories/agent-visualizer/canvas/draw-edges.stories.tsx`
- `web/stories/agent-visualizer/canvas/draw-tool-calls.stories.tsx`
- `web/stories/agent-visualizer/canvas/draw-discoveries.stories.tsx`
- `web/stories/agent-visualizer/canvas/draw-effects.stories.tsx`
- `web/stories/agent-visualizer/canvas/draw-particles.stories.tsx`
- `web/stories/agent-visualizer/canvas/draw-cost.stories.tsx`

**New — React component stories:**
- `web/stories/agent-visualizer/glass-card.stories.tsx`
- `web/stories/agent-visualizer/agent-detail-card.stories.tsx`
- `web/stories/agent-visualizer/tool-detail-popup.stories.tsx`
- `web/stories/agent-visualizer/discovery-detail-popup.stories.tsx`
- `web/stories/agent-visualizer/glass-context-menu.stories.tsx`
- `web/stories/agent-visualizer/control-bar.stories.tsx`
- `web/stories/agent-visualizer/transcript-message.stories.tsx`
- `web/stories/agent-visualizer/session-tabs.stories.tsx`
- `web/stories/agent-visualizer/tool-content-renderer.stories.tsx`

**Modified:**
- `web/package.json` — `storybook` + `build-storybook` scripts; Storybook devDeps

---

## Task 1: Install Storybook

**Files:**
- Modify: `web/package.json`

- [ ] **Step 1: Install Storybook packages**

Run from the repo root (monorepo pnpm workspace):
```bash
pnpm --filter agent-flow-web add -D storybook @storybook/react-vite @storybook/addon-essentials
```
Expected: packages added to `web/node_modules`, `web/package.json` devDependencies updated.

- [ ] **Step 2: Add scripts to `web/package.json`**

In the `"scripts"` block, add:
```json
"storybook": "storybook dev -p 6006",
"build-storybook": "storybook build"
```

- [ ] **Step 3: Verify install**

```bash
cd /path/to/feature/light-theme/web && pnpm storybook --version
```
Expected: prints Storybook version (e.g. `8.x.x` or `9.x.x`).

- [ ] **Step 4: Commit**

```bash
git add web/package.json web/pnpm-lock.yaml
git commit -m "chore: install Storybook with react-vite framework"
```

---

## Task 2: Storybook configuration

**Files:**
- Create: `web/.storybook/main.ts`
- Create: `web/.storybook/preview.tsx`

- [ ] **Step 1: Create `web/.storybook/main.ts`**

```ts
import type { StorybookConfig } from '@storybook/react-vite'
import { mergeConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [tailwindcss()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '..'),
        },
      },
    })
  },
}

export default config
```

- [ ] **Step 2: Create `web/.storybook/preview.tsx`**

```tsx
import React, { createContext, useContext, useEffect } from 'react'
import type { Decorator } from '@storybook/react'
import { useGlobals } from '@storybook/preview-api'
import { DARK_COLORS, LIGHT_COLORS, type ColorPalette } from '@/lib/colors'
import '../app/globals.css'

export const StoryColorsContext = createContext<ColorPalette>(DARK_COLORS)

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Color theme',
    defaultValue: 'dark',
    toolbar: {
      icon: 'circlehollow',
      items: [
        { value: 'dark', title: 'Dark' },
        { value: 'light', title: 'Light' },
      ],
      showName: true,
    },
  },
}

const withTheme: Decorator = (Story, context) => {
  const [globals] = useGlobals()
  const isDark = (globals.theme ?? 'dark') !== 'light'
  const colors: ColorPalette = isDark ? DARK_COLORS : LIGHT_COLORS

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  return (
    <StoryColorsContext.Provider value={colors}>
      <div style={{ background: colors.void, minHeight: '100vh', padding: '16px' }}>
        <Story />
      </div>
    </StoryColorsContext.Provider>
  )
}

export const decorators = [withTheme]
```

- [ ] **Step 3: Start Storybook and verify it opens**

```bash
cd web && pnpm storybook
```
Expected: browser opens at `http://localhost:6006` with no errors in terminal. Dark/Light toggle appears in toolbar.

- [ ] **Step 4: Commit**

```bash
git add web/.storybook/
git commit -m "chore: add Storybook config with theme toolbar decorator"
```

---

## Task 3: `CanvasRenderer` utility

**Files:**
- Create: `web/stories/utils/canvas-renderer.tsx`

- [ ] **Step 1: Create `web/stories/utils/canvas-renderer.tsx`**

```tsx
import { useRef, useEffect, useContext } from 'react'
import { StoryColorsContext } from '@/stories/utils/story-colors-context'
import type { ColorPalette } from '@/lib/colors'

export interface CanvasRendererProps {
  width?: number
  height?: number
  /** Override background fill. Defaults to `colors.void`. */
  background?: string
  /** When true, runs a requestAnimationFrame loop and passes elapsed seconds as `time`. */
  animate?: boolean
  draw: (ctx: CanvasRenderingContext2D, colors: ColorPalette, time: number) => void
}

export function CanvasRenderer({
  width = 800,
  height = 600,
  background,
  animate = false,
  draw,
}: CanvasRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const colors = useContext(StoryColorsContext)
  const colorsRef = useRef(colors)
  colorsRef.current = colors
  const drawRef = useRef(draw)
  drawRef.current = draw
  const startRef = useRef(0)
  const rafRef = useRef(0)

  // Start/restart rAF loop (or single draw) when animate/dimensions change.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (animate) {
      startRef.current = performance.now()
      const loop = (now: number) => {
        const t = (now - startRef.current) / 1000
        const bg = background ?? colorsRef.current.void
        ctx.clearRect(0, 0, width, height)
        ctx.fillStyle = bg
        ctx.fillRect(0, 0, width, height)
        drawRef.current(ctx, colorsRef.current, t)
        rafRef.current = requestAnimationFrame(loop)
      }
      rafRef.current = requestAnimationFrame(loop)
      return () => cancelAnimationFrame(rafRef.current)
    }
  }, [animate, width, height, background])

  // Re-draw static (non-animated) stories on theme change.
  useEffect(() => {
    if (animate) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const bg = background ?? colors.void
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, width, height)
    drawRef.current(ctx, colors, 0)
  }, [colors, animate, width, height, background])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ display: 'block', borderRadius: 8 }}
    />
  )
}
```

**Note:** The import `@/stories/utils/story-colors-context` doesn't exist yet — move `StoryColorsContext` out of `preview.tsx` into its own file so both `preview.tsx` and `canvas-renderer.tsx` can import it without a circular reference.

- [ ] **Step 2: Create `web/stories/utils/story-colors-context.ts`**

```ts
import { createContext } from 'react'
import { DARK_COLORS, type ColorPalette } from '@/lib/colors'

export const StoryColorsContext = createContext<ColorPalette>(DARK_COLORS)
```

- [ ] **Step 3: Update `web/.storybook/preview.tsx` to import from the new file**

Replace the inline `createContext` and import with:
```tsx
import { StoryColorsContext } from '@/stories/utils/story-colors-context'
```

Remove the `createContext` call from `preview.tsx`. The rest of the file stays the same.

- [ ] **Step 4: Verify Storybook still starts**

```bash
cd web && pnpm storybook
```
Expected: opens without TypeScript errors.

- [ ] **Step 5: Commit**

```bash
git add web/stories/utils/
git commit -m "feat: add CanvasRenderer and StoryColorsContext utilities"
```

---

## Task 4: Mock data factory

**Files:**
- Create: `web/stories/utils/mock-data.ts`

- [ ] **Step 1: Create `web/stories/utils/mock-data.ts`**

```ts
import type {
  Agent, AgentState, Edge, Particle, ToolCallNode, Discovery,
  MessageBubble, TimelineEvent, VisualEffect,
} from '@/lib/agent-types'
import { emptyContextBreakdown } from '@/lib/agent-types'

let _id = 0
const uid = () => `mock-${++_id}`

export function mockAgent(overrides: Partial<Agent> = {}): Agent {
  return {
    id: uid(),
    name: 'claude-agent',
    state: 'idle',
    parentId: null,
    tokensUsed: 12000,
    tokensMax: 200000,
    contextBreakdown: {
      systemPrompt: 2000,
      userMessages: 1500,
      toolResults: 8000,
      reasoning: 500,
      subagentResults: 0,
    },
    toolCalls: 3,
    timeAlive: 45,
    x: 400,
    y: 300,
    vx: 0,
    vy: 0,
    pinned: false,
    isMain: false,
    runtime: 'claude',
    currentTool: undefined,
    task: 'Analyze codebase',
    spawnTime: 0,
    completeTime: undefined,
    opacity: 1,
    scale: 1,
    messageBubbles: [],
    ...overrides,
  }
}

export function mockBubble(overrides: Partial<MessageBubble> = {}): MessageBubble {
  return {
    text: 'Running analysis on the codebase…',
    time: 0,
    role: 'assistant',
    ...overrides,
  }
}

export function mockEdge(fromId: string, toId: string, overrides: Partial<Edge> = {}): Edge {
  return {
    id: `${fromId}->${toId}`,
    from: fromId,
    to: toId,
    type: 'parent-child',
    opacity: 1,
    ...overrides,
  }
}

export function mockParticle(fromId: string, toId: string): Particle {
  return {
    id: uid(),
    edgeId: `${fromId}->${toId}`,
    progress: 0.4,
    type: 'dispatch',
    color: '#cc88ff',
    size: 3,
    trailLength: 0.15,
    label: 'auth.ts 142 lines',
  }
}

export function mockToolCall(overrides: Partial<ToolCallNode> = {}): ToolCallNode {
  return {
    id: uid(),
    agentId: 'agent-1',
    toolName: 'Read',
    state: 'running',
    args: 'src/auth.ts',
    result: undefined,
    tokenCost: undefined,
    inputData: undefined,
    errorMessage: undefined,
    x: 550,
    y: 300,
    startTime: 0,
    completeTime: undefined,
    opacity: 1,
    ...overrides,
  }
}

export function mockDiscovery(overrides: Partial<Discovery> = {}): Discovery {
  return {
    id: uid(),
    agentId: 'agent-1',
    type: 'file',
    label: 'auth/middleware.ts',
    content: 'JWT token validation + session management',
    x: 600,
    y: 200,
    targetX: 600,
    targetY: 200,
    opacity: 1,
    timestamp: 0,
    ...overrides,
  }
}

export function mockVisualEffect(overrides: Partial<VisualEffect> = {}): VisualEffect {
  return {
    type: 'spawn',
    x: 400,
    y: 300,
    color: '#66ccff',
    age: 0,
    duration: 1,
    particles: Array.from({ length: 8 }, (_, i) => ({
      angle: (i / 8) * Math.PI * 2,
      speed: 60 + Math.random() * 40,
      size: 3,
    })),
    ...overrides,
  }
}

export function mockTimelineEvent(overrides: Partial<TimelineEvent> = {}): TimelineEvent {
  return {
    id: uid(),
    type: 'thinking',
    label: 'Analyzing dependencies',
    timestamp: 5,
    duration: 3,
    ...overrides,
  }
}

// ── Pre-built scenarios ──────────────────────────────────────────────────────

export const AGENT_1_ID = 'agent-1'
export const AGENT_2_ID = 'agent-2'
export const AGENT_3_ID = 'agent-3'

export const SINGLE_AGENT_MAP: Map<string, Agent> = new Map([
  [AGENT_1_ID, mockAgent({ id: AGENT_1_ID, isMain: true, x: 400, y: 300, state: 'thinking' })],
])

export const MULTI_AGENT_MAP: Map<string, Agent> = new Map([
  [AGENT_1_ID, mockAgent({ id: AGENT_1_ID, isMain: true, x: 400, y: 220, state: 'thinking', name: 'orchestrator' })],
  [AGENT_2_ID, mockAgent({ id: AGENT_2_ID, parentId: AGENT_1_ID, x: 250, y: 400, state: 'tool_calling', name: 'file-reader' })],
  [AGENT_3_ID, mockAgent({ id: AGENT_3_ID, parentId: AGENT_1_ID, x: 550, y: 400, state: 'complete', name: 'analyzer', tokensUsed: 50000 })],
])

export const MULTI_AGENT_EDGES: Edge[] = [
  mockEdge(AGENT_1_ID, AGENT_2_ID),
  mockEdge(AGENT_1_ID, AGENT_3_ID),
]

export const TOOL_CALL_MAP: Map<string, ToolCallNode> = new Map([
  ['tc-1', mockToolCall({ id: 'tc-1', toolName: 'Read', state: 'running', x: 450, y: 160 })],
  ['tc-2', mockToolCall({ id: 'tc-2', toolName: 'Bash', state: 'complete', args: 'git log --oneline -20', result: '20 commits listed', x: 600, y: 350, agentId: AGENT_2_ID })],
  ['tc-3', mockToolCall({ id: 'tc-3', toolName: 'Edit', state: 'error', args: 'src/auth.ts', errorMessage: 'File not found', x: 280, y: 200, agentId: AGENT_3_ID })],
])

export const DISCOVERY_LIST: Discovery[] = [
  mockDiscovery({ id: 'd-1', type: 'file', label: 'auth/middleware.ts', x: 160, y: 180, targetX: 160, targetY: 180 }),
  mockDiscovery({ id: 'd-2', type: 'pattern', label: 'JWT token reuse', content: 'Tokens reused across sessions without expiry', x: 640, y: 480, targetX: 640, targetY: 480 }),
]

export const PARTICLE_LIST: Particle[] = [
  mockParticle(AGENT_1_ID, AGENT_2_ID),
  { ...mockParticle(AGENT_2_ID, AGENT_1_ID), type: 'return', color: '#66ffaa', progress: 0.7 },
]

export const TIMELINE_EVENTS: TimelineEvent[] = [
  mockTimelineEvent({ id: 'ev-1', type: 'thinking', label: 'Planning', timestamp: 1, duration: 4 }),
  mockTimelineEvent({ id: 'ev-2', type: 'tool_call', label: 'Read file', timestamp: 5, duration: 1 }),
  mockTimelineEvent({ id: 'ev-3', type: 'tool_result', label: 'File contents', timestamp: 6, duration: 0.5 }),
  mockTimelineEvent({ id: 'ev-4', type: 'message', label: 'User message', timestamp: 8, duration: 0 }),
]
```

- [ ] **Step 2: Commit**

```bash
git add web/stories/utils/mock-data.ts
git commit -m "feat: add mock data factories for Storybook stories"
```

---

## Task 5: `draw-agents` stories

**Files:**
- Create: `web/stories/agent-visualizer/canvas/draw-agents.stories.tsx`

- [ ] **Step 1: Create `web/stories/agent-visualizer/canvas/draw-agents.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { CanvasRenderer } from '@/stories/utils/canvas-renderer'
import { drawAgents } from '@/components/agent-visualizer/canvas/draw-agents'
import {
  SINGLE_AGENT_MAP, MULTI_AGENT_MAP, AGENT_1_ID, AGENT_2_ID, mockAgent,
} from '@/stories/utils/mock-data'

const meta: Meta = { title: 'Canvas/DrawAgents' }
export default meta
type Story = StoryObj

export const SingleIdle: Story = {
  render: () => (
    <CanvasRenderer
      animate
      draw={(ctx, colors, t) =>
        drawAgents(ctx, new Map([[AGENT_1_ID, { ...SINGLE_AGENT_MAP.get(AGENT_1_ID)!, state: 'idle' }]]), null, null, false, t, colors)
      }
    />
  ),
}

export const SingleRunning: Story = {
  render: () => (
    <CanvasRenderer
      animate
      draw={(ctx, colors, t) =>
        drawAgents(ctx, SINGLE_AGENT_MAP, null, null, false, t, colors)
      }
    />
  ),
}

export const SingleWithStats: Story = {
  render: () => (
    <CanvasRenderer
      animate
      draw={(ctx, colors, t) =>
        drawAgents(ctx, SINGLE_AGENT_MAP, null, null, true, t, colors)
      }
    />
  ),
}

export const MultiAgent: Story = {
  render: () => (
    <CanvasRenderer
      animate
      draw={(ctx, colors, t) =>
        drawAgents(ctx, MULTI_AGENT_MAP, null, null, true, t, colors)
      }
    />
  ),
}

export const WithSelection: Story = {
  render: () => (
    <CanvasRenderer
      animate
      draw={(ctx, colors, t) =>
        drawAgents(ctx, MULTI_AGENT_MAP, AGENT_1_ID, AGENT_2_ID, true, t, colors)
      }
    />
  ),
}

export const WaitingPermission: Story = {
  render: () => {
    const agents = new Map([[AGENT_1_ID, { ...SINGLE_AGENT_MAP.get(AGENT_1_ID)!, state: 'waiting_permission' as const }]])
    return (
      <CanvasRenderer
        animate
        draw={(ctx, colors, t) => drawAgents(ctx, agents, null, null, false, t, colors)}
      />
    )
  },
}
```

- [ ] **Step 2: Verify in Storybook**

With `pnpm storybook` running, navigate to **Canvas → DrawAgents**. Confirm all 5 variants render agents on dark background. Switch toolbar to Light — agents should redraw with light palette.

- [ ] **Step 3: Commit**

```bash
git add web/stories/agent-visualizer/canvas/draw-agents.stories.tsx
git commit -m "feat: add draw-agents Storybook stories"
```

---

## Task 6: `draw-bubbles` and `draw-edges` stories

**Files:**
- Create: `web/stories/agent-visualizer/canvas/draw-bubbles.stories.tsx`
- Create: `web/stories/agent-visualizer/canvas/draw-edges.stories.tsx`

- [ ] **Step 1: Create `web/stories/agent-visualizer/canvas/draw-bubbles.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { CanvasRenderer } from '@/stories/utils/canvas-renderer'
import { drawAgents } from '@/components/agent-visualizer/canvas/draw-agents'
import { drawMessageBubblesWorld } from '@/components/agent-visualizer/canvas/draw-bubbles'
import { AGENT_1_ID, mockAgent, mockBubble } from '@/stories/utils/mock-data'

const meta: Meta = { title: 'Canvas/DrawBubbles' }
export default meta
type Story = StoryObj

function makeAgentWithBubbles(bubbles: ReturnType<typeof mockBubble>[]) {
  return new Map([
    [AGENT_1_ID, mockAgent({
      id: AGENT_1_ID, isMain: true, x: 280, y: 300,
      state: 'thinking', messageBubbles: bubbles,
    })],
  ])
}

export const SingleAssistantBubble: Story = {
  render: () => {
    const agents = makeAgentWithBubbles([
      mockBubble({ text: 'Analyzing the authentication middleware…', role: 'assistant' }),
    ])
    return (
      <CanvasRenderer
        animate
        draw={(ctx, colors, t) => {
          drawAgents(ctx, agents, null, null, false, t, colors)
          drawMessageBubblesWorld(ctx, agents, t, colors)
        }}
      />
    )
  },
}

export const MultipleBubbles: Story = {
  render: () => {
    const agents = makeAgentWithBubbles([
      mockBubble({ text: 'Reading auth.ts…', role: 'assistant', time: 0 }),
      mockBubble({ text: 'Found 3 issues with token expiry.', role: 'assistant', time: 2 }),
      mockBubble({ text: 'Should I fix them now?', role: 'assistant', time: 4 }),
    ])
    return (
      <CanvasRenderer
        animate
        draw={(ctx, colors, t) => {
          drawAgents(ctx, agents, null, null, false, t, colors)
          drawMessageBubblesWorld(ctx, agents, t, colors)
        }}
      />
    )
  },
}

export const ThinkingBubble: Story = {
  render: () => {
    const agents = makeAgentWithBubbles([
      mockBubble({ text: 'The tokens are reused across sessions without proper expiry checks…', role: 'thinking' }),
    ])
    return (
      <CanvasRenderer
        animate
        draw={(ctx, colors, t) => {
          drawAgents(ctx, agents, null, null, false, t, colors)
          drawMessageBubblesWorld(ctx, agents, t, colors)
        }}
      />
    )
  },
}
```

- [ ] **Step 2: Create `web/stories/agent-visualizer/canvas/draw-edges.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { CanvasRenderer } from '@/stories/utils/canvas-renderer'
import { drawAgents } from '@/components/agent-visualizer/canvas/draw-agents'
import { drawEdges, getActiveEdgeIds } from '@/components/agent-visualizer/canvas/draw-edges'
import {
  MULTI_AGENT_MAP, MULTI_AGENT_EDGES, TOOL_CALL_MAP, mockEdge,
  AGENT_1_ID, AGENT_2_ID,
} from '@/stories/utils/mock-data'

const meta: Meta = { title: 'Canvas/DrawEdges' }
export default meta
type Story = StoryObj

const EMPTY_TOOLS: Map<string, import('@/lib/agent-types').ToolCallNode> = new Map()

export const SingleEdge: Story = {
  render: () => {
    const agents = MULTI_AGENT_MAP
    const edges = [mockEdge(AGENT_1_ID, AGENT_2_ID)]
    return (
      <CanvasRenderer
        animate
        draw={(ctx, colors, t) => {
          drawAgents(ctx, agents, null, null, false, t, colors)
          drawEdges(ctx, edges, agents, EMPTY_TOOLS, new Set(), t, colors)
        }}
      />
    )
  },
}

export const MultiEdge: Story = {
  render: () => (
    <CanvasRenderer
      animate
      draw={(ctx, colors, t) => {
        drawAgents(ctx, MULTI_AGENT_MAP, null, null, false, t, colors)
        drawEdges(ctx, MULTI_AGENT_EDGES, MULTI_AGENT_MAP, EMPTY_TOOLS, new Set(), t, colors)
      }}
    />
  ),
}

export const ToolEdge: Story = {
  render: () => {
    const edges = [mockEdge(AGENT_2_ID, 'tc-1', { type: 'tool' })]
    return (
      <CanvasRenderer
        animate
        draw={(ctx, colors, t) => {
          drawAgents(ctx, MULTI_AGENT_MAP, null, null, false, t, colors)
          drawEdges(ctx, edges, MULTI_AGENT_MAP, TOOL_CALL_MAP, new Set(['tc-1']), t, colors)
        }}
      />
    )
  },
}
```

- [ ] **Step 3: Verify in Storybook**

Navigate to **Canvas → DrawBubbles** and **Canvas → DrawEdges**. Confirm renders. Toggle theme.

- [ ] **Step 4: Commit**

```bash
git add web/stories/agent-visualizer/canvas/draw-bubbles.stories.tsx web/stories/agent-visualizer/canvas/draw-edges.stories.tsx
git commit -m "feat: add draw-bubbles and draw-edges Storybook stories"
```

---

## Task 7: `draw-tool-calls` and `draw-discoveries` stories

**Files:**
- Create: `web/stories/agent-visualizer/canvas/draw-tool-calls.stories.tsx`
- Create: `web/stories/agent-visualizer/canvas/draw-discoveries.stories.tsx`

- [ ] **Step 1: Create `web/stories/agent-visualizer/canvas/draw-tool-calls.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { CanvasRenderer } from '@/stories/utils/canvas-renderer'
import { drawToolCalls } from '@/components/agent-visualizer/canvas/draw-tool-calls'
import { TOOL_CALL_MAP, mockToolCall } from '@/stories/utils/mock-data'

const meta: Meta = { title: 'Canvas/DrawToolCalls' }
export default meta
type Story = StoryObj

export const Running: Story = {
  render: () => {
    const tools = new Map([['tc-1', mockToolCall({ id: 'tc-1', state: 'running', toolName: 'Read', args: 'src/auth.ts', x: 400, y: 300 })]])
    return (
      <CanvasRenderer
        animate
        draw={(ctx, colors, t) => drawToolCalls(ctx, tools, t, null, colors)}
      />
    )
  },
}

export const Complete: Story = {
  render: () => {
    const tools = new Map([['tc-1', mockToolCall({ id: 'tc-1', state: 'complete', toolName: 'Bash', args: 'git log', result: '20 commits', tokenCost: 1200, x: 400, y: 300 })]])
    return (
      <CanvasRenderer
        animate
        draw={(ctx, colors, t) => drawToolCalls(ctx, tools, t, null, colors)}
      />
    )
  },
}

export const Error: Story = {
  render: () => {
    const tools = new Map([['tc-1', mockToolCall({ id: 'tc-1', state: 'error', toolName: 'Edit', args: 'missing.ts', errorMessage: 'File not found', x: 400, y: 300 })]])
    return (
      <CanvasRenderer
        animate
        draw={(ctx, colors, t) => drawToolCalls(ctx, tools, t, null, colors)}
      />
    )
  },
}

export const Mixed: Story = {
  render: () => (
    <CanvasRenderer
      animate
      draw={(ctx, colors, t) => drawToolCalls(ctx, TOOL_CALL_MAP, t, 'tc-1', colors)}
    />
  ),
}
```

- [ ] **Step 2: Create `web/stories/agent-visualizer/canvas/draw-discoveries.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { CanvasRenderer } from '@/stories/utils/canvas-renderer'
import { drawAgents } from '@/components/agent-visualizer/canvas/draw-agents'
import { drawDiscoveries, drawDiscoveryConnections } from '@/components/agent-visualizer/canvas/draw-discoveries'
import { SINGLE_AGENT_MAP, DISCOVERY_LIST } from '@/stories/utils/mock-data'

const meta: Meta = { title: 'Canvas/DrawDiscoveries' }
export default meta
type Story = StoryObj

export const SingleDiscovery: Story = {
  render: () => (
    <CanvasRenderer
      animate
      draw={(ctx, colors, t) => {
        drawAgents(ctx, SINGLE_AGENT_MAP, null, null, false, t, colors)
        drawDiscoveries(ctx, [DISCOVERY_LIST[0]], SINGLE_AGENT_MAP, null, colors)
      }}
    />
  ),
}

export const MultipleDiscoveries: Story = {
  render: () => (
    <CanvasRenderer
      animate
      draw={(ctx, colors, t) => {
        drawAgents(ctx, SINGLE_AGENT_MAP, null, null, false, t, colors)
        drawDiscoveries(ctx, DISCOVERY_LIST, SINGLE_AGENT_MAP, null, colors)
        drawDiscoveryConnections(ctx, DISCOVERY_LIST, SINGLE_AGENT_MAP, colors)
      }}
    />
  ),
}

export const SelectedDiscovery: Story = {
  render: () => (
    <CanvasRenderer
      animate
      draw={(ctx, colors, t) => {
        drawAgents(ctx, SINGLE_AGENT_MAP, null, null, false, t, colors)
        drawDiscoveries(ctx, DISCOVERY_LIST, SINGLE_AGENT_MAP, 'd-1', colors)
      }}
    />
  ),
}
```

- [ ] **Step 3: Verify in Storybook**

Navigate to **Canvas → DrawToolCalls** and **Canvas → DrawDiscoveries**. Confirm renders. Toggle theme.

- [ ] **Step 4: Commit**

```bash
git add web/stories/agent-visualizer/canvas/draw-tool-calls.stories.tsx web/stories/agent-visualizer/canvas/draw-discoveries.stories.tsx
git commit -m "feat: add draw-tool-calls and draw-discoveries Storybook stories"
```

---

## Task 8: `draw-effects`, `draw-particles`, `draw-cost` stories

**Files:**
- Create: `web/stories/agent-visualizer/canvas/draw-effects.stories.tsx`
- Create: `web/stories/agent-visualizer/canvas/draw-particles.stories.tsx`
- Create: `web/stories/agent-visualizer/canvas/draw-cost.stories.tsx`

- [ ] **Step 1: Create `web/stories/agent-visualizer/canvas/draw-effects.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { CanvasRenderer } from '@/stories/utils/canvas-renderer'
import { drawEffects } from '@/components/agent-visualizer/canvas/draw-effects'
import { drawTetherLine } from '@/components/agent-visualizer/canvas/draw-misc'
import { mockVisualEffect, SINGLE_AGENT_MAP, AGENT_1_ID } from '@/stories/utils/mock-data'

const meta: Meta = { title: 'Canvas/DrawEffects' }
export default meta
type Story = StoryObj

export const SpawnEffect: Story = {
  render: () => {
    const effect = mockVisualEffect({ type: 'spawn', age: 0, duration: 1 })
    return (
      <CanvasRenderer
        animate
        draw={(ctx, colors, t) => {
          const aged = { ...effect, age: (t % 1) }
          drawEffects(ctx, [aged], colors)
        }}
      />
    )
  },
}

export const CompleteEffect: Story = {
  render: () => {
    const effect = mockVisualEffect({ type: 'complete', color: '#66ffaa', age: 0, duration: 1 })
    return (
      <CanvasRenderer
        animate
        draw={(ctx, colors, t) => {
          const aged = { ...effect, age: (t % 1) }
          drawEffects(ctx, [aged], colors)
        }}
      />
    )
  },
}

export const TetherLine: Story = {
  render: () => {
    const agent = SINGLE_AGENT_MAP.get(AGENT_1_ID)!
    return (
      <CanvasRenderer
        animate
        draw={(ctx, colors) => {
          drawTetherLine(ctx, agent, { x: 0, y: 0, scale: 1 }, 600, colors)
        }}
      />
    )
  },
}
```

- [ ] **Step 2: Create `web/stories/agent-visualizer/canvas/draw-particles.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { CanvasRenderer } from '@/stories/utils/canvas-renderer'
import { drawAgents } from '@/components/agent-visualizer/canvas/draw-agents'
import { drawEdges } from '@/components/agent-visualizer/canvas/draw-edges'
import { drawParticles, buildEdgeMap } from '@/components/agent-visualizer/canvas/draw-particles'
import {
  MULTI_AGENT_MAP, MULTI_AGENT_EDGES, PARTICLE_LIST, TOOL_CALL_MAP,
} from '@/stories/utils/mock-data'

const meta: Meta = { title: 'Canvas/DrawParticles' }
export default meta
type Story = StoryObj

export const ActiveParticles: Story = {
  render: () => {
    const edgeMap = buildEdgeMap(MULTI_AGENT_EDGES)
    return (
      <CanvasRenderer
        animate
        draw={(ctx, colors, t) => {
          drawAgents(ctx, MULTI_AGENT_MAP, null, null, false, t, colors)
          drawEdges(ctx, MULTI_AGENT_EDGES, MULTI_AGENT_MAP, TOOL_CALL_MAP, new Set(), t, colors)
          const animated = PARTICLE_LIST.map(p => ({ ...p, progress: (p.progress + t * 0.2) % 1 }))
          drawParticles(ctx, animated, edgeMap, MULTI_AGENT_MAP, TOOL_CALL_MAP, t, colors)
        }}
      />
    )
  },
}
```

- [ ] **Step 3: Create `web/stories/agent-visualizer/canvas/draw-cost.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { CanvasRenderer } from '@/stories/utils/canvas-renderer'
import { drawAgents } from '@/components/agent-visualizer/canvas/draw-agents'
import { drawCostLabels, drawCostSummaryPanel } from '@/components/agent-visualizer/canvas/draw-cost'
import { MULTI_AGENT_MAP, TOOL_CALL_MAP } from '@/stories/utils/mock-data'

const meta: Meta = { title: 'Canvas/DrawCost' }
export default meta
type Story = StoryObj

export const CostLabels: Story = {
  render: () => (
    <CanvasRenderer
      animate
      draw={(ctx, colors, t) => {
        drawAgents(ctx, MULTI_AGENT_MAP, null, null, false, t, colors)
        drawCostLabels(ctx, MULTI_AGENT_MAP, TOOL_CALL_MAP, colors)
      }}
    />
  ),
}

export const CostSummaryPanel: Story = {
  render: () => (
    <CanvasRenderer
      draw={(ctx, colors) => drawCostSummaryPanel(ctx, MULTI_AGENT_MAP, TOOL_CALL_MAP, colors)}
    />
  ),
}
```

- [ ] **Step 4: Verify in Storybook**

Navigate to **Canvas → DrawEffects**, **Canvas → DrawParticles**, **Canvas → DrawCost**. Confirm all render without errors.

- [ ] **Step 5: Commit**

```bash
git add web/stories/agent-visualizer/canvas/draw-effects.stories.tsx web/stories/agent-visualizer/canvas/draw-particles.stories.tsx web/stories/agent-visualizer/canvas/draw-cost.stories.tsx
git commit -m "feat: add draw-effects, draw-particles, draw-cost Storybook stories"
```

---

## Task 9: `GlassCard` and shared-ui component stories

**Files:**
- Create: `web/stories/agent-visualizer/glass-card.stories.tsx`

- [ ] **Step 1: Create `web/stories/agent-visualizer/glass-card.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { GlassCard } from '@/components/agent-visualizer/glass-card'
import { CloseButton, PanelHeader, ProgressBar, SlidingPanel } from '@/components/agent-visualizer/shared-ui'

// ── GlassCard ────────────────────────────────────────────────────────────────

const glassMeta: Meta<typeof GlassCard> = {
  title: 'Components/GlassCard',
  component: GlassCard,
}
export default glassMeta
type GlassStory = StoryObj<typeof GlassCard>

export const Visible: GlassStory = {
  args: {
    visible: true,
    children: <p className="text-sm text-white/80">Glass card content here.</p>,
  },
}

export const Hidden: GlassStory = {
  args: {
    visible: false,
    children: <p className="text-sm text-white/80">You should not see this.</p>,
  },
}
```

- [ ] **Step 2: Create `web/stories/agent-visualizer/shared-ui.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { CloseButton, PanelHeader, ProgressBar } from '@/components/agent-visualizer/shared-ui'

// ── CloseButton ──────────────────────────────────────────────────────────────
const closeMeta: Meta<typeof CloseButton> = {
  title: 'Components/SharedUI/CloseButton',
  component: CloseButton,
}
export default closeMeta
type CloseStory = StoryObj<typeof CloseButton>

export const Default: CloseStory = {
  args: { onClick: () => {} },
}

// ── ProgressBar ───────────────────────────────────────────────────────────────
export const ProgressEmpty: StoryObj<typeof ProgressBar> = {
  render: () => <ProgressBar percent={0} color="#66ccff" trackColor="rgba(102,204,255,0.1)" />,
}

export const ProgressHalf: StoryObj<typeof ProgressBar> = {
  render: () => <ProgressBar percent={50} color="#66ccff" trackColor="rgba(102,204,255,0.1)" />,
}

export const ProgressFull: StoryObj<typeof ProgressBar> = {
  render: () => <ProgressBar percent={100} color="#ff5566" trackColor="rgba(255,85,102,0.1)" />,
}
```

- [ ] **Step 3: Verify in Storybook**

Navigate to **Components → GlassCard** and **Components → SharedUI**. Toggle theme.

- [ ] **Step 4: Commit**

```bash
git add web/stories/agent-visualizer/glass-card.stories.tsx web/stories/agent-visualizer/shared-ui.stories.tsx
git commit -m "feat: add GlassCard and shared-ui Storybook stories"
```

---

## Task 10: Popup component stories

**Files:**
- Create: `web/stories/agent-visualizer/agent-detail-card.stories.tsx`
- Create: `web/stories/agent-visualizer/tool-detail-popup.stories.tsx`
- Create: `web/stories/agent-visualizer/discovery-detail-popup.stories.tsx`

- [ ] **Step 1: Create `web/stories/agent-visualizer/agent-detail-card.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { AgentDetailCard } from '@/components/agent-visualizer/agent-detail-card'

const meta: Meta<typeof AgentDetailCard> = {
  title: 'Components/AgentDetailCard',
  component: AgentDetailCard,
}
export default meta
type Story = StoryObj<typeof AgentDetailCard>

const baseAgent = {
  id: 'agent-1',
  name: 'orchestrator',
  state: 'thinking' as const,
  tokensUsed: 42000,
  tokensMax: 200000,
  toolCalls: 7,
  timeAlive: 120,
  currentTool: 'Read',
}

export const Thinking: Story = {
  args: { agent: baseAgent, onClose: () => {} },
}

export const Complete: Story = {
  args: { agent: { ...baseAgent, state: 'complete', currentTool: undefined, tokensUsed: 180000 }, onClose: () => {} },
}

export const Error: Story = {
  args: { agent: { ...baseAgent, state: 'error', currentTool: undefined }, onClose: () => {} },
}
```

- [ ] **Step 2: Create `web/stories/agent-visualizer/tool-detail-popup.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { ToolDetailPopup } from '@/components/agent-visualizer/tool-detail-popup'

const meta: Meta<typeof ToolDetailPopup> = {
  title: 'Components/ToolDetailPopup',
  component: ToolDetailPopup,
}
export default meta
type Story = StoryObj<typeof ToolDetailPopup>

export const Running: Story = {
  args: {
    tool: { id: 'tc-1', toolName: 'Read', state: 'running', args: 'src/auth.ts' },
    position: { x: 200, y: 200 },
    onClose: () => {},
  },
}

export const Complete: Story = {
  args: {
    tool: { id: 'tc-2', toolName: 'Bash', state: 'complete', args: 'git log --oneline -20', result: '20 commits listed', tokenCost: 1200 },
    position: { x: 200, y: 200 },
    onClose: () => {},
  },
}

export const Error: Story = {
  args: {
    tool: { id: 'tc-3', toolName: 'Edit', state: 'error', args: 'missing.ts', errorMessage: 'File not found' },
    position: { x: 200, y: 200 },
    onClose: () => {},
  },
}
```

- [ ] **Step 3: Create `web/stories/agent-visualizer/discovery-detail-popup.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { DiscoveryDetailPopup } from '@/components/agent-visualizer/discovery-detail-popup'

const meta: Meta<typeof DiscoveryDetailPopup> = {
  title: 'Components/DiscoveryDetailPopup',
  component: DiscoveryDetailPopup,
}
export default meta
type Story = StoryObj<typeof DiscoveryDetailPopup>

export const FileDiscovery: Story = {
  args: {
    discovery: { id: 'd-1', type: 'file', label: 'auth/middleware.ts', content: 'JWT token validation + session management', agentId: 'agent-1' },
    position: { x: 200, y: 150 },
    onClose: () => {},
  },
}

export const PatternDiscovery: Story = {
  args: {
    discovery: { id: 'd-2', type: 'pattern', label: 'JWT token reuse', content: 'Tokens reused across sessions without proper expiry', agentId: 'agent-1' },
    position: { x: 200, y: 150 },
    onClose: () => {},
  },
}
```

- [ ] **Step 4: Verify in Storybook**

Navigate to **Components → AgentDetailCard**, **Components → ToolDetailPopup**, **Components → DiscoveryDetailPopup**. Toggle theme.

- [ ] **Step 5: Commit**

```bash
git add web/stories/agent-visualizer/agent-detail-card.stories.tsx web/stories/agent-visualizer/tool-detail-popup.stories.tsx web/stories/agent-visualizer/discovery-detail-popup.stories.tsx
git commit -m "feat: add popup component Storybook stories"
```

---

## Task 11: `GlassContextMenu` and `ControlBar` stories

**Files:**
- Create: `web/stories/agent-visualizer/glass-context-menu.stories.tsx`
- Create: `web/stories/agent-visualizer/control-bar.stories.tsx`

- [ ] **Step 1: Create `web/stories/agent-visualizer/glass-context-menu.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { GlassContextMenu } from '@/components/agent-visualizer/glass-context-menu'

const meta: Meta<typeof GlassContextMenu> = {
  title: 'Components/GlassContextMenu',
  component: GlassContextMenu,
}
export default meta
type Story = StoryObj<typeof GlassContextMenu>

export const AgentMenu: Story = {
  args: {
    position: { x: 200, y: 200 },
    items: [
      { label: 'View Details', onClick: () => {} },
      { label: 'Pin Agent', onClick: () => {} },
      { label: 'Disconnect', onClick: () => {}, danger: true },
    ],
    onClose: () => {},
  },
}
```

- [ ] **Step 2: Check GlassContextMenu items interface before writing**

Run:
```bash
grep -n "interface\|items\|danger" web/components/agent-visualizer/glass-context-menu.tsx | head -20
```
Adjust the `items` shape above to match the actual interface if it differs.

- [ ] **Step 3: Create `web/stories/agent-visualizer/control-bar.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { ControlBar } from '@/components/agent-visualizer/control-bar'
import { TIMELINE_EVENTS } from '@/stories/utils/mock-data'

const meta: Meta<typeof ControlBar> = {
  title: 'Components/ControlBar',
  component: ControlBar,
}
export default meta
type Story = StoryObj<typeof ControlBar>

const baseProps = {
  isPlaying: false,
  speed: 1,
  currentTime: 5,
  totalDuration: 30,
  onPlayPause: () => {},
  onRestart: () => {},
  onSpeedChange: () => {},
  onSeek: () => {},
  timelineEvents: TIMELINE_EVENTS,
}

export const Paused: Story = {
  args: { ...baseProps },
}

export const Playing: Story = {
  args: { ...baseProps, isPlaying: true },
}

export const Reviewing: Story = {
  args: { ...baseProps, isReviewing: true, onResumeLive: () => {} },
}
```

- [ ] **Step 4: Verify in Storybook**

Navigate to **Components → GlassContextMenu** and **Components → ControlBar**. Toggle theme.

- [ ] **Step 5: Commit**

```bash
git add web/stories/agent-visualizer/glass-context-menu.stories.tsx web/stories/agent-visualizer/control-bar.stories.tsx
git commit -m "feat: add GlassContextMenu and ControlBar Storybook stories"
```

---

## Task 12: Remaining React component stories

**Files:**
- Create: `web/stories/agent-visualizer/transcript-message.stories.tsx`
- Create: `web/stories/agent-visualizer/session-tabs.stories.tsx`
- Create: `web/stories/agent-visualizer/tool-content-renderer.stories.tsx`

- [ ] **Step 1: Create `web/stories/agent-visualizer/transcript-message.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { TranscriptMessage } from '@/components/agent-visualizer/transcript-message'
import type { ConversationMessage } from '@/hooks/simulation/types'

const meta: Meta<typeof TranscriptMessage> = {
  title: 'Components/TranscriptMessage',
  component: TranscriptMessage,
}
export default meta
type Story = StoryObj<typeof TranscriptMessage>

const baseMsg = (overrides: Partial<ConversationMessage>): ConversationMessage => ({
  id: 'msg-1',
  type: 'assistant',
  content: 'Analyzing the authentication middleware for security issues.',
  timestamp: Date.now(),
  ...overrides,
})

export const AssistantMessage: Story = {
  args: { message: baseMsg({ type: 'assistant' }) },
}

export const UserMessage: Story = {
  args: { message: baseMsg({ type: 'user', content: 'Fix the token expiry bug.' }) },
}

export const ThinkingMessage: Story = {
  args: { message: baseMsg({ type: 'thinking', content: 'The tokens lack proper expiry validation. I should check the middleware…' }) },
}

export const ToolCallMessage: Story = {
  args: { message: baseMsg({ type: 'tool_call', toolName: 'Read', content: 'Reading src/auth.ts' }) },
}

export const Compact: Story = {
  args: { message: baseMsg({ type: 'assistant' }), compact: true },
}
```

- [ ] **Step 2: Create `web/stories/agent-visualizer/session-tabs.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { SessionTabs } from '@/components/agent-visualizer/session-tabs'
import type { SessionInfo } from '@/lib/bridge-types'

const meta: Meta<typeof SessionTabs> = {
  title: 'Components/SessionTabs',
  component: SessionTabs,
}
export default meta
type Story = StoryObj<typeof SessionTabs>

const sessions: SessionInfo[] = [
  { id: 's-1', label: 'fix: auth bug', status: 'active', startTime: Date.now() - 120000, lastActivityTime: Date.now() },
  { id: 's-2', label: 'feat: dark theme', status: 'completed', startTime: Date.now() - 600000, lastActivityTime: Date.now() - 60000 },
]

export const SingleTab: Story = {
  args: { sessions: [sessions[0]], selectedSessionId: 's-1', sessionsWithActivity: new Set(['s-1']), onSelectSession: () => {}, onCloseSession: () => {} },
}

export const MultipleTabs: Story = {
  args: { sessions, selectedSessionId: 's-1', sessionsWithActivity: new Set(['s-1']), onSelectSession: () => {}, onCloseSession: () => {} },
}
```

- [ ] **Step 3: Create `web/stories/agent-visualizer/tool-content-renderer.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { ToolContentRenderer, OpenFileProvider } from '@/components/agent-visualizer/tool-content-renderer'

const meta: Meta<typeof ToolContentRenderer> = {
  title: 'Components/ToolContentRenderer',
  component: ToolContentRenderer,
  decorators: [
    (Story) => (
      <OpenFileProvider value={() => {}}>
        <div className="p-4 text-sm">
          <Story />
        </div>
      </OpenFileProvider>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof ToolContentRenderer>

export const ReadTool: Story = {
  args: { toolName: 'Read', args: 'src/auth.ts', inputData: { file_path: 'src/auth.ts' } },
}

export const BashTool: Story = {
  args: { toolName: 'Bash', args: 'git log --oneline -20', inputData: { command: 'git log --oneline -20' } },
}

export const EditTool: Story = {
  args: {
    toolName: 'Edit',
    args: 'src/auth.ts',
    inputData: {
      file_path: 'src/auth.ts',
      old_string: 'token.expiry < Date.now()',
      new_string: 'token.expiry <= Date.now()',
    },
  },
}

export const UnknownTool: Story = {
  args: { toolName: 'CustomTool', args: 'some-arg' },
}
```

- [ ] **Step 4: Verify in Storybook**

Navigate to **Components → TranscriptMessage**, **Components → SessionTabs**, **Components → ToolContentRenderer**. Toggle theme.

- [ ] **Step 5: Commit**

```bash
git add web/stories/agent-visualizer/transcript-message.stories.tsx web/stories/agent-visualizer/session-tabs.stories.tsx web/stories/agent-visualizer/tool-content-renderer.stories.tsx
git commit -m "feat: add TranscriptMessage, SessionTabs, ToolContentRenderer Storybook stories"
```

---

## Self-Review Notes

**Spec coverage check:**
- ✅ Storybook 9 + `@storybook/react-vite` — Task 1–2
- ✅ `CanvasRenderer` with rAF + theme context — Task 3
- ✅ Mock data factories + scenario constants — Task 4
- ✅ All 8 canvas draw function story files — Tasks 5–8
- ✅ React overlay components (GlassCard, popups, ControlBar, etc.) — Tasks 9–12
- ✅ Dark/Light theme toolbar — Task 2 (global decorator)
- ✅ Story files under `web/stories/` mirroring component structure — all tasks
- ✅ `@/` alias + Tailwind in Storybook Vite config — Task 2

**Type consistency:**
- `StoryColorsContext` defined in `web/stories/utils/story-colors-context.ts`, imported by both `preview.tsx` and `canvas-renderer.tsx`
- `mockAgent` returns `Agent` (from `@/lib/agent-types`), used as `Map<string, Agent>` in all canvas draw stories
- `buildEdgeMap` imported from `draw-particles` in draw-particles story — matches its export location
- `OpenFileProvider` imported from `tool-content-renderer` — matches its export

**Potential adjustment:** Task 11 Step 2 instructs verifying the `GlassContextMenu` `items` shape before writing — the `danger` prop may not exist. Check and adjust before writing the story.
