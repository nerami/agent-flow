import type { Meta, StoryObj } from '@storybook/react-vite'
import { ToolContentRenderer, OpenFileProvider } from '@/components/agent-visualizer/tool-content-renderer'

const meta: Meta<typeof ToolContentRenderer> = {
  title: 'Components/ToolContentRenderer',
  component: ToolContentRenderer,
  decorators: [
    (Story) => (
      <OpenFileProvider value={() => {}}>
        <div className="p-4 text-sm">
          <Story />
        </div>
      </OpenFileProvider>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof ToolContentRenderer>

export const ReadTool: Story = {
  args: { toolName: 'Read', args: 'src/auth.ts', inputData: { file_path: 'src/auth.ts' } },
}

export const BashTool: Story = {
  args: { toolName: 'Bash', args: 'git log --oneline -20', inputData: { command: 'git log --oneline -20' } },
}

export const EditTool: Story = {
  args: {
    toolName: 'Edit',
    args: 'src/auth.ts',
    inputData: {
      file_path: 'src/auth.ts',
      old_string: 'token.expiry < Date.now()',
      new_string: 'token.expiry <= Date.now()',
    },
  },
}

export const UnknownTool: Story = {
  args: { toolName: 'CustomTool', args: 'some-arg' },
}
