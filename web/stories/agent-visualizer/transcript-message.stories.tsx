import type { Meta, StoryObj } from '@storybook/react-vite'
import { TranscriptMessage } from '@/components/agent-visualizer/transcript-message'
import type { ConversationMessage } from '@/hooks/simulation/types'

const meta: Meta<typeof TranscriptMessage> = {
  title: 'Components/TranscriptMessage',
  component: TranscriptMessage,
}
export default meta
type Story = StoryObj<typeof TranscriptMessage>

const baseMsg = (overrides: Partial<ConversationMessage>): ConversationMessage => ({
  id: 'msg-1',
  type: 'assistant',
  content: 'Analyzing the authentication middleware for security issues.',
  timestamp: 1000000,
  ...overrides,
})

export const AssistantMessage: Story = {
  args: { message: baseMsg({ type: 'assistant' }) },
}

export const UserMessage: Story = {
  args: { message: baseMsg({ type: 'user', content: 'Fix the token expiry bug.' }) },
}

export const ThinkingMessage: Story = {
  args: { message: baseMsg({ type: 'thinking', content: 'The tokens lack proper expiry validation. I should check the middleware…' }) },
}

export const ToolCallMessage: Story = {
  args: { message: baseMsg({ type: 'tool_call', toolName: 'Read', content: 'Reading src/auth.ts' }) },
}

export const Compact: Story = {
  args: { message: baseMsg({ type: 'assistant' }), compact: true },
}
