import type { Meta, StoryObj } from '@storybook/react-vite'
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
