import type { Meta, StoryObj } from '@storybook/react-vite'
import { DiscoveryDetailPopup } from '@/components/agent-visualizer/discovery-detail-popup'

const meta: Meta<typeof DiscoveryDetailPopup> = {
  title: 'Components/DiscoveryDetailPopup',
  component: DiscoveryDetailPopup,
}
export default meta
type Story = StoryObj<typeof DiscoveryDetailPopup>

export const FileDiscovery: Story = {
  args: {
    discovery: { id: 'd-1', type: 'file', label: 'auth/middleware.ts', content: 'JWT token validation + session management', agentId: 'agent-1' },
    position: { x: 200, y: 150 },
    onClose: () => {},
  },
}

export const PatternDiscovery: Story = {
  args: {
    discovery: { id: 'd-2', type: 'pattern', label: 'JWT token reuse', content: 'Tokens reused across sessions without proper expiry', agentId: 'agent-1' },
    position: { x: 200, y: 150 },
    onClose: () => {},
  },
}
