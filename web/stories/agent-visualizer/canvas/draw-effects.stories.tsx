import type { Meta, StoryObj } from '@storybook/react-vite'
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
          const aged = { ...effect, age: t % 1 }
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
          const aged = { ...effect, age: t % 1 }
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
