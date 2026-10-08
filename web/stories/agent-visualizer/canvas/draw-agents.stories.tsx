import type { Meta, StoryObj } from '@storybook/react-vite'
import { CanvasRenderer } from '@/stories/utils/canvas-renderer'
import { drawAgents } from '@/components/agent-visualizer/canvas/draw-agents'
import {
  SINGLE_AGENT_MAP, MULTI_AGENT_MAP, AGENT_1_ID, AGENT_2_ID,
} from '@/stories/utils/mock-data'

const meta: Meta = { title: 'Canvas/DrawAgents' }
export default meta
type Story = StoryObj

export const SingleIdle: Story = {
  render: () => (
    <CanvasRenderer
      animate
      zoom={3}
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
      zoom={3}
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
      zoom={3}
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
      zoom={1.5}
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
      zoom={1.5}
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
        zoom={3}
        draw={(ctx, colors, t) => drawAgents(ctx, agents, null, null, false, t, colors)}
      />
    )
  },
}
