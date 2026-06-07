import type { Meta, StoryObj } from '@storybook/react-vite'
import { GlassContextMenu } from '@/components/agent-visualizer/glass-context-menu'

const meta: Meta<typeof GlassContextMenu> = {
  title: 'Components/GlassContextMenu',
  component: GlassContextMenu,
}
export default meta
type Story = StoryObj<typeof GlassContextMenu>

export const AgentMenu: Story = {
  args: {
    position: { x: 200, y: 200 },
    items: [
      { label: 'View details', onClick: () => {} },
      { label: 'Pin agent', onClick: () => {} },
      { separator: true, label: '', onClick: () => {} },
      { label: 'Remove agent', onClick: () => {}, danger: true },
    ],
    onClose: () => {},
  },
}

export const SimpleMenu: Story = {
  args: {
    position: { x: 200, y: 200 },
    items: [
      { label: 'Copy ID', onClick: () => {} },
      { label: 'Inspect', onClick: () => {} },
    ],
    onClose: () => {},
  },
}
