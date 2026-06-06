import type {
  Agent, Edge, Particle, ToolCallNode, Discovery,
  MessageBubble, TimelineEvent,
} from '@/lib/agent-types'
import type { VisualEffect } from '@/components/agent-visualizer/canvas/draw-effects'

let _id = 0
const uid = () => `mock-${++_id}`

export function mockAgent(overrides: Partial<Agent> = {}): Agent {
  return {
    id: uid(),
    name: 'claude-agent',
    state: 'idle',
    parentId: null,
    tokensUsed: 12000,
    tokensMax: 200000,
    contextBreakdown: {
      systemPrompt: 2000,
      userMessages: 1500,
      toolResults: 8000,
      reasoning: 500,
      subagentResults: 0,
    },
    toolCalls: 3,
    timeAlive: 45,
    x: 400,
    y: 300,
    vx: 0,
    vy: 0,
    pinned: false,
    isMain: false,
    runtime: 'claude',
    currentTool: undefined,
    task: 'Analyze codebase',
    spawnTime: 0,
    completeTime: undefined,
    opacity: 1,
    scale: 1,
    messageBubbles: [],
    ...overrides,
  }
}

export function mockBubble(overrides: Partial<MessageBubble> = {}): MessageBubble {
  return {
    text: 'Running analysis on the codebase…',
    time: 0,
    role: 'assistant',
    ...overrides,
  }
}

export function mockEdge(fromId: string, toId: string, overrides: Partial<Edge> = {}): Edge {
  return {
    id: `${fromId}->${toId}`,
    from: fromId,
    to: toId,
    type: 'parent-child',
    opacity: 1,
    ...overrides,
  }
}

export function mockParticle(fromId: string, toId: string): Particle {
  return {
    id: uid(),
    edgeId: `${fromId}->${toId}`,
    progress: 0.4,
    type: 'dispatch',
    color: '#cc88ff',
    size: 3,
    trailLength: 0.15,
    label: 'auth.ts 142 lines',
  }
}

export function mockToolCall(overrides: Partial<ToolCallNode> = {}): ToolCallNode {
  return {
    id: uid(),
    agentId: 'agent-1',
    toolName: 'Read',
    state: 'running',
    args: 'src/auth.ts',
    result: undefined,
    tokenCost: undefined,
    inputData: undefined,
    errorMessage: undefined,
    x: 550,
    y: 300,
    startTime: 0,
    completeTime: undefined,
    opacity: 1,
    ...overrides,
  }
}

export function mockDiscovery(overrides: Partial<Discovery> = {}): Discovery {
  return {
    id: uid(),
    agentId: 'agent-1',
    type: 'file',
    label: 'auth/middleware.ts',
    content: 'JWT token validation + session management',
    x: 600,
    y: 200,
    targetX: 600,
    targetY: 200,
    opacity: 1,
    timestamp: 0,
    ...overrides,
  }
}

export function mockVisualEffect(overrides: Partial<VisualEffect> = {}): VisualEffect {
  return {
    type: 'spawn',
    x: 400,
    y: 300,
    color: '#66ccff',
    age: 0,
    duration: 1,
    particles: Array.from({ length: 8 }, (_, i) => ({
      angle: (i / 8) * Math.PI * 2,
      speed: 80,
      size: 3,
    })),
    ...overrides,
  }
}

export function mockTimelineEvent(overrides: Partial<TimelineEvent> = {}): TimelineEvent {
  return {
    id: uid(),
    type: 'thinking',
    label: 'Analyzing dependencies',
    timestamp: 5,
    duration: 3,
    ...overrides,
  }
}

// ── Pre-built scenarios ──────────────────────────────────────────────────────

export const AGENT_1_ID = 'agent-1'
export const AGENT_2_ID = 'agent-2'
export const AGENT_3_ID = 'agent-3'

export const SINGLE_AGENT_MAP: Map<string, Agent> = new Map([
  [AGENT_1_ID, mockAgent({ id: AGENT_1_ID, isMain: true, x: 400, y: 300, state: 'thinking' })],
])

export const MULTI_AGENT_MAP: Map<string, Agent> = new Map([
  [AGENT_1_ID, mockAgent({ id: AGENT_1_ID, isMain: true, x: 400, y: 220, state: 'thinking', name: 'orchestrator' })],
  [AGENT_2_ID, mockAgent({ id: AGENT_2_ID, parentId: AGENT_1_ID, x: 250, y: 400, state: 'tool_calling', name: 'file-reader' })],
  [AGENT_3_ID, mockAgent({ id: AGENT_3_ID, parentId: AGENT_1_ID, x: 550, y: 400, state: 'complete', name: 'analyzer', tokensUsed: 50000 })],
])

export const MULTI_AGENT_EDGES: Edge[] = [
  mockEdge(AGENT_1_ID, AGENT_2_ID),
  mockEdge(AGENT_1_ID, AGENT_3_ID),
]

export const TOOL_CALL_MAP: Map<string, ToolCallNode> = new Map([
  ['tc-1', mockToolCall({ id: 'tc-1', toolName: 'Read', state: 'running', x: 450, y: 160 })],
  ['tc-2', mockToolCall({ id: 'tc-2', toolName: 'Bash', state: 'complete', args: 'git log --oneline -20', result: '20 commits listed', x: 600, y: 350, agentId: AGENT_2_ID })],
  ['tc-3', mockToolCall({ id: 'tc-3', toolName: 'Edit', state: 'error', args: 'src/auth.ts', errorMessage: 'File not found', x: 280, y: 200, agentId: AGENT_3_ID })],
])

export const DISCOVERY_LIST: Discovery[] = [
  mockDiscovery({ id: 'd-1', type: 'file', label: 'auth/middleware.ts', x: 160, y: 180, targetX: 160, targetY: 180 }),
  mockDiscovery({ id: 'd-2', type: 'pattern', label: 'JWT token reuse', content: 'Tokens reused across sessions without expiry', x: 640, y: 480, targetX: 640, targetY: 480 }),
]

export const PARTICLE_LIST: Particle[] = [
  mockParticle(AGENT_1_ID, AGENT_2_ID),
  { ...mockParticle(AGENT_2_ID, AGENT_1_ID), type: 'return' as const, color: '#66ffaa', progress: 0.7 },
]

export const TIMELINE_EVENTS: TimelineEvent[] = [
  mockTimelineEvent({ id: 'ev-1', type: 'thinking', label: 'Planning', timestamp: 1, duration: 4 }),
  mockTimelineEvent({ id: 'ev-2', type: 'tool_call', label: 'Read file', timestamp: 5, duration: 1 }),
  mockTimelineEvent({ id: 'ev-3', type: 'tool_result', label: 'File contents', timestamp: 6, duration: 0.5 }),
  mockTimelineEvent({ id: 'ev-4', type: 'message', label: 'User message', timestamp: 8, duration: 0 }),
]
