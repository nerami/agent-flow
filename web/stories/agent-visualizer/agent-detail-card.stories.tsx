import type { Meta, StoryObj } from '@storybook/react-vite'
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
  args: { agent: { ...baseAgent, state: 'complete' as const, currentTool: undefined, tokensUsed: 180000 }, onClose: () => {} },
}

export const Error: Story = {
  args: { agent: { ...baseAgent, state: 'error' as const, currentTool: undefined }, onClose: () => {} },
}
