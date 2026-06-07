import type { Meta, StoryObj } from '@storybook/react-vite'
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
