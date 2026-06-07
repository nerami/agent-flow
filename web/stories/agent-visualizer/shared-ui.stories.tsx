import type { Meta, StoryObj } from '@storybook/react-vite'
import { CloseButton, ProgressBar } from '@/components/agent-visualizer/shared-ui'

const meta: Meta<typeof CloseButton> = {
  title: 'Components/SharedUI/CloseButton',
  component: CloseButton,
}
export default meta
type Story = StoryObj<typeof CloseButton>

export const Default: Story = {
  args: { onClick: () => {} },
}

export const ProgressEmpty: StoryObj<typeof ProgressBar> = {
  render: () => <ProgressBar percent={0} color="#66ccff" trackColor="rgba(102,204,255,0.1)" />,
}

export const ProgressHalf: StoryObj<typeof ProgressBar> = {
  render: () => <ProgressBar percent={50} color="#66ccff" trackColor="rgba(102,204,255,0.1)" />,
}

export const ProgressFull: StoryObj<typeof ProgressBar> = {
  render: () => <ProgressBar percent={100} color="#ff5566" trackColor="rgba(255,85,102,0.1)" />,
}
