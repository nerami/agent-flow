import { AgentVisualizer } from "@/components/agent-visualizer"
import { ThemeColorEditor } from "@/components/agent-visualizer/theme-color-editor"

export default function Page() {
  return (
    <>
      <AgentVisualizer />
      {process.env.NODE_ENV === 'development' && <ThemeColorEditor />}
    </>
  )
}
