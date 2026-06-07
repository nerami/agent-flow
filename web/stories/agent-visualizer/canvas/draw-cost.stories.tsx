import type { Meta, StoryObj } from '@storybook/react-vite'
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
