import type { Meta, StoryObj } from '@storybook/react-vite'
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
