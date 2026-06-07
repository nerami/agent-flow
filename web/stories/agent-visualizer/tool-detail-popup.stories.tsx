import type { Meta, StoryObj } from '@storybook/react-vite'
import { ToolDetailPopup } from '@/components/agent-visualizer/tool-detail-popup'

const meta: Meta<typeof ToolDetailPopup> = {
  title: 'Components/ToolDetailPopup',
  component: ToolDetailPopup,
}
export default meta
type Story = StoryObj<typeof ToolDetailPopup>

export const Running: Story = {
  args: {
    tool: { id: 'tc-1', toolName: 'Read', state: 'running', args: 'src/auth.ts' },
    position: { x: 200, y: 200 },
    onClose: () => {},
  },
}

export const Complete: Story = {
  args: {
    tool: { id: 'tc-2', toolName: 'Bash', state: 'complete', args: 'git log --oneline -20', result: '20 commits listed', tokenCost: 1200 },
    position: { x: 200, y: 200 },
    onClose: () => {},
  },
}

export const ErrorState: Story = {
  args: {
    tool: { id: 'tc-3', toolName: 'Edit', state: 'error', args: 'missing.ts' },
    position: { x: 200, y: 200 },
    onClose: () => {},
  },
}
