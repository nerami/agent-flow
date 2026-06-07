import type { Meta, StoryObj } from '@storybook/react-vite'
import { CanvasRenderer } from '@/stories/utils/canvas-renderer'
import { drawAgents } from '@/components/agent-visualizer/canvas/draw-agents'
import { drawEdges } from '@/components/agent-visualizer/canvas/draw-edges'
import {
  MULTI_AGENT_MAP, MULTI_AGENT_EDGES, TOOL_CALL_MAP, mockEdge,
  AGENT_1_ID, AGENT_2_ID,
} from '@/stories/utils/mock-data'
import type { ToolCallNode } from '@/lib/agent-types'

const meta: Meta = { title: 'Canvas/DrawEdges' }
export default meta
type Story = StoryObj

const EMPTY_TOOLS: Map<string, ToolCallNode> = new Map()

export const SingleEdge: Story = {
  render: () => {
    const edges = [mockEdge(AGENT_1_ID, AGENT_2_ID)]
    return (
      <CanvasRenderer
        animate
        draw={(ctx, colors, t) => {
          drawAgents(ctx, MULTI_AGENT_MAP, null, null, false, t, colors)
          drawEdges(ctx, edges, MULTI_AGENT_MAP, EMPTY_TOOLS, new Set(), t, colors)
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
