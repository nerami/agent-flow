import { createRoot } from 'react-dom/client'
import { AgentVisualizer } from './components/agent-visualizer'
import { ThemeColorEditor } from './components/agent-visualizer/theme-color-editor'
import './app/globals.css'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element #root not found')
const root = createRoot(rootElement)
root.render(
  <>
    <AgentVisualizer />
    {process.env.NODE_ENV === 'development' && <ThemeColorEditor />}
  </>
)
