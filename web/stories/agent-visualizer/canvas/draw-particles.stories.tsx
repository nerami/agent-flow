import type { Meta, StoryObj } from '@storybook/react-vite'
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
