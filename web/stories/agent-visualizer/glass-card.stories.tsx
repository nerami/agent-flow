import type { Meta, StoryObj } from '@storybook/react-vite'
import { GlassCard } from '@/components/agent-visualizer/glass-card'

const meta: Meta<typeof GlassCard> = {
  title: 'Components/GlassCard',
  component: GlassCard,
}
export default meta
type Story = StoryObj<typeof GlassCard>

export const Visible: Story = {
  args: {
    visible: true,
    children: 'Glass card content here.',
  },
}

export const Hidden: Story = {
  args: {
    visible: false,
    children: 'You should not see this.',
  },
}
