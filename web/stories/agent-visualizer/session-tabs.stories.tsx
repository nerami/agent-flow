import type { Meta, StoryObj } from '@storybook/react-vite'
import { SessionTabs } from '@/components/agent-visualizer/session-tabs'
import type { SessionInfo } from '@/lib/bridge-types'

const meta: Meta<typeof SessionTabs> = {
  title: 'Components/SessionTabs',
  component: SessionTabs,
}
export default meta
type Story = StoryObj<typeof SessionTabs>

const sessions: SessionInfo[] = [
  { id: 's-1', label: 'fix: auth bug', status: 'active', startTime: 1000000, lastActivityTime: 1120000 },
  { id: 's-2', label: 'feat: dark theme', status: 'completed', startTime: 900000, lastActivityTime: 1060000 },
]

export const SingleTab: Story = {
  args: { sessions: [sessions[0]], selectedSessionId: 's-1', sessionsWithActivity: new Set(['s-1']), onSelectSession: () => {}, onCloseSession: () => {} },
}

export const MultipleTabs: Story = {
  args: { sessions, selectedSessionId: 's-1', sessionsWithActivity: new Set(['s-1']), onSelectSession: () => {}, onCloseSession: () => {} },
}
