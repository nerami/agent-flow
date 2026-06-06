# Storybook for Canvas Components

**Date:** 2026-06-06  
**Branch:** feature/light-theme  
**Scope:** Storybook 9 setup covering all canvas draw functions and React overlay components

---

## Goal

Isolate and visually inspect every canvas draw function and React overlay component in the agent-visualizer, with light/dark theme toggling.

---

## Architecture

### Storybook setup

- **Package:** `@storybook/react-vite` (Storybook 9) installed in `web/`
- **Builder:** Vite — reuses existing `vite.config.shared.ts` (path alias `@/`, Tailwind PostCSS)
- **Config dir:** `web/.storybook/`
  - `main.ts` — framework, story glob (`stories/**/*.stories.{ts,tsx}`)
  - `preview.tsx` — global theme decorator, Tailwind CSS import
  - `preview-head.html` — inline dark-class init script (mirrors `layout.tsx` pre-paint script)

### Theme decorator

Global decorator added in `preview.tsx`:
- Adds a Storybook toolbar toggle: **Dark / Light**
- On toggle: sets `document.documentElement.classList.toggle('dark', isDark)`
- Provides `ColorPalette` via React context (`StoryColorsContext`) — `DARK_COLORS` or `LIGHT_COLORS`
- `CanvasRenderer` consumes this context to get the correct palette per frame

---

## `CanvasRenderer` utility

**Path:** `web/stories/utils/canvas-renderer.tsx`

```tsx
interface CanvasRendererProps {
  width?: number         // default: 800
  height?: number        // default: 600
  background?: string    // default: colors.voidL1 (theme-aware)
  animate?: boolean      // rAF loop (default: false — draw once)
  draw: (ctx: CanvasRenderingContext2D, colors: ColorPalette, time: number) => void
}
```

Behavior:
- On mount: creates canvas element, calls `draw(ctx, colors, 0)`
- If `animate={true}`: runs `requestAnimationFrame` loop, passes elapsed seconds as `time`
- Re-draws when theme changes (dark ↔ light)
- Clears canvas before each draw call

---

## Mock data

**Path:** `web/stories/utils/mock-data.ts`

Factory functions with sensible defaults and optional overrides:

```ts
mockAgent(overrides?: Partial<Agent>): Agent
mockEdge(fromId: string, toId: string, overrides?: Partial<Edge>): Edge
mockToolCall(overrides?: Partial<ToolCallNode>): ToolCallNode
mockDiscovery(overrides?: Partial<Discovery>): Discovery
mockParticle(fromId: string, toId: string): Particle
mockBubble(agentId: string, overrides?: Partial<MessageBubble>): MessageBubble
```

Pre-built scenario sets (exported as constants):
- `SINGLE_AGENT_MAP` — one running agent centered at (400, 300)
- `MULTI_AGENT_MAP` — five agents in different states with edges
- `TOOL_CALL_SCENARIO` — two agents + active tool calls
- `DISCOVERY_SCENARIO` — agents + discovery nodes

---

## Story file structure

```
web/
  .storybook/
    main.ts
    preview.tsx
    preview-head.html
  stories/
    utils/
      canvas-renderer.tsx
      mock-data.ts
    agent-visualizer/
      canvas/
        draw-agents.stories.tsx       # SingleIdle, SingleRunning, MultiAgent, WithSelection
        draw-bubbles.stories.tsx      # NoBubbles, SingleBubble, MultiBubble
        draw-edges.stories.tsx        # SingleEdge, ActiveEdge, MultiEdge
        draw-tool-calls.stories.tsx   # NoToolCalls, SingleToolCall, MultiToolCall
        draw-discoveries.stories.tsx  # SingleDiscovery, MultiDiscovery, WithConnections
        draw-effects.stories.tsx      # BloomEffect, TetherLine
        draw-particles.stories.tsx    # ActiveParticles, IdleParticles
        draw-cost.stories.tsx         # CostLabels, CostSummaryPanel
      glass-card.stories.tsx
      agent-detail-card.stories.tsx
      tool-detail-popup.stories.tsx
      discovery-detail-popup.stories.tsx
      glass-context-menu.stories.tsx
      control-bar.stories.tsx
      transcript-message.stories.tsx
      timeline-panel.stories.tsx
      session-tabs.stories.tsx
      tool-content-renderer.stories.tsx
```

---

## Example story (canvas draw function)

```tsx
// web/stories/agent-visualizer/canvas/draw-agents.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { CanvasRenderer } from '../../utils/canvas-renderer'
import { drawAgents } from '@/components/agent-visualizer/canvas/draw-agents'
import { SINGLE_AGENT_MAP, MULTI_AGENT_MAP } from '../../utils/mock-data'

const meta: Meta = { title: 'Canvas/DrawAgents' }
export default meta
type Story = StoryObj

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

export const MultiAgent: Story = {
  render: () => (
    <CanvasRenderer
      animate
      draw={(ctx, colors, t) =>
        drawAgents(ctx, MULTI_AGENT_MAP, 'agent-1', null, true, t, colors)
      }
    />
  ),
}
```

---

## Example story (React component)

```tsx
// web/stories/agent-visualizer/glass-card.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { GlassCard } from '@/components/agent-visualizer/glass-card'

const meta: Meta<typeof GlassCard> = {
  title: 'Components/GlassCard',
  component: GlassCard,
}
export default meta
type Story = StoryObj<typeof GlassCard>

export const Default: Story = {
  args: { visible: true, children: 'Card content' },
}

export const Hidden: Story = {
  args: { visible: false, children: 'Card content' },
}
```

---

## Dependencies to install

```
@storybook/react-vite
@storybook/addon-essentials
@storybook/addon-themes
storybook
```

---

## What is NOT in scope

- Snapshot / visual regression testing (Chromatic, Percy)
- Stories for `AgentVisualizer` (full composite — too many deps)
- Stories for `canvas.tsx` (the full canvas loop — covered by individual draw stories)
- `ThemeColorEditor` (dev-only tool, not a stable component)
