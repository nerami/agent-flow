import type { Meta, StoryObj } from '@storybook/react-vite'
import { ControlBar } from '@/components/agent-visualizer/control-bar'
import { TIMELINE_EVENTS } from '@/stories/utils/mock-data'

const meta: Meta<typeof ControlBar> = {
  title: 'Components/ControlBar',
  component: ControlBar,
}
export default meta
type Story = StoryObj<typeof ControlBar>

const baseProps = {
  isPlaying: false,
  speed: 1,
  currentTime: 5,
  totalDuration: 30,
  onPlayPause: () => {},
  onRestart: () => {},
  onSpeedChange: () => {},
  onSeek: () => {},
  timelineEvents: TIMELINE_EVENTS,
}

export const Paused: Story = {
  args: { ...baseProps },
}

export const Playing: Story = {
  args: { ...baseProps, isPlaying: true },
}

export const Reviewing: Story = {
  args: { ...baseProps, isReviewing: true, onResumeLive: () => {} },
}
