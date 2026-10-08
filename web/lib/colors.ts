/**
 * Holographic color palette and role color definitions.
 *
 * Extracted from agent-types.ts to keep that file focused on type definitions.
 * All colors re-exported from here for backward compatibility.
 */

import { colord } from 'colord'
import type { AgentState, ContextBreakdown } from './agent-types'

// ─── Dark palette (original) ─────────────────────────────────────────────────

export const DARK_COLORS = {
  // Background
  void: '#050510',
  hexGrid: '#0d0d1f',

  // Primary Hologram
  holoBase: '#66ccff',
  holoBright: '#aaeeff',
  holoHot: '#ffffff',

  // Agent States
  idle: '#66ccff',
  thinking: '#66ccff',
  tool_calling: '#ffbb44',
  complete: '#66ffaa',
  error: '#ff5566',
  paused: '#888899',
  waiting_permission: '#ffaa33',

  // Edge/Particle Colors
  dispatch: '#cc88ff',
  return: '#66ffaa',
  tool: '#ffbb44',
  message: '#66ccff',

  // Context breakdown colors
  contextSystem: '#555577',
  contextUser: '#66ccff',
  contextToolResults: '#ffbb44',
  contextReasoning: '#cc88ff',
  contextSubagent: '#66ffaa',

  // UI Chrome
  nodeInterior: 'rgba(10, 15, 40, 0.5)',
  textPrimary: '#aaeeff',
  textDim: '#66ccff90',
  textMuted: '#66ccff50',

  // Glass card
  glassBg: 'rgba(10, 15, 30, 0.7)',
  glassBorder: 'rgba(100, 200, 255, 0.15)',
  glassHighlight: 'rgba(100, 200, 255, 0.08)',

  // Holo background/border opacities (avoids scattered rgba literals)
  holoBg03: 'rgba(100, 200, 255, 0.03)',
  holoBg05: 'rgba(100, 200, 255, 0.05)',
  holoBg10: 'rgba(100, 200, 255, 0.1)',
  holoBorder06: 'rgba(100, 200, 255, 0.06)',
  holoBorder08: 'rgba(100, 200, 255, 0.08)',
  holoBorder10: 'rgba(100, 200, 255, 0.1)',
  holoBorder12: 'rgba(100, 200, 255, 0.12)',

  // Panel chrome
  panelBg: 'rgba(8, 12, 24, 0.85)',
  panelSeparator: 'rgba(100, 200, 255, 0.04)',

  // Toggle button states
  toggleActive: 'rgba(100, 200, 255, 0.15)',
  toggleInactive: 'rgba(100, 200, 255, 0.05)',
  toggleBorder: 'rgba(100, 200, 255, 0.1)',

  // Live indicator
  liveDot: '#ff4444',
  liveText: '#ff6666',
  liveResumeBg: 'rgba(255, 68, 68, 0.15)',
  liveResumeBorder: 'rgba(255, 68, 68, 0.35)',

  // Discovery type colors
  discoveryFile: '#66ccff',
  discoveryPattern: '#cc88ff',
  discoveryFinding: '#66ffaa',
  discoveryCode: '#ffbb44',

  // Session tab states
  tabSelectedBg: 'rgba(100, 200, 255, 0.15)',
  tabInactiveBg: 'rgba(100, 200, 255, 0.03)',
  tabSelectedBorder: 'rgba(100, 200, 255, 0.3)',
  tabInactiveBorder: 'rgba(100, 200, 255, 0.08)',
  tabClose: '#ff6688',

  // Role colors (message bubbles)
  roleAssistantBg: 'rgba(80, 160, 220, 0.12)',
  roleAssistantBgSelected: 'rgba(80, 160, 220, 0.2)',
  roleAssistantText: '#a0d4f0',
  roleThinkingBg: 'rgba(140, 100, 200, 0.12)',
  roleThinkingBgSelected: 'rgba(140, 100, 200, 0.2)',
  roleThinkingText: '#c0a0e0',
  roleUserBg: 'rgba(200, 160, 80, 0.12)',
  roleUserBgSelected: 'rgba(200, 160, 80, 0.2)',
  roleUserText: '#e0c888',

  // Result/success
  resultBg: 'rgba(102, 255, 170, 0.05)',
  resultBorder: 'rgba(102, 255, 170, 0.1)',

  // Unread indicator
  unreadDot: '#ff6666',

  // Play button
  playBtnBg: 'rgba(102, 204, 255, 0.12)',
  playBtnActiveBg: 'rgba(102, 204, 255, 0.2)',
  playBtnBorder: 'rgba(102, 204, 255, 0.4)',
  playBtnGlow: '0 0 12px rgba(102, 204, 255, 0.15)',

  // Scrubber
  scrubberFill: 'linear-gradient(90deg, rgba(102,204,255,0.3), rgba(102,204,255,0.6))',
  scrubberHeadGlow: '0 0 10px rgba(102, 204, 255, 0.6), 0 0 20px rgba(102, 204, 255, 0.2)',
  reviewBtnBorder: 'rgba(102, 204, 255, 0.25)',

  // Cost overlay
  costActiveBg: 'rgba(102, 255, 170, 0.15)',

  // Canvas drawing — bubble base colors
  bubbleThinking: 'rgb(140, 100, 200)',
  bubbleUser: 'rgb(200, 160, 80)',
  bubbleAssistant: 'rgb(80, 160, 220)',

  // Canvas drawing — tool card backgrounds
  toolCardError: 'rgb(40, 10, 15)',
  toolCardSelected: 'rgb(100, 200, 255)',
  toolCard: 'rgb(10, 15, 30)',

  // Canvas drawing — agent/tool card backgrounds
  cardBgDark: 'rgba(5, 5, 16, 0.8)',
  cardBg: 'rgba(10, 15, 30, 0.6)',
  cardBgSelected: 'rgba(10, 15, 30, 0.8)',
  cardBgError: 'rgba(40, 10, 15, 0.8)',
  cardBgSelectedHolo: 'rgba(100, 200, 255, 0.15)',
  cardBgFaintOverlay: 'rgba(0, 0, 0, 0.01)',

  // Active tool indicator (detail card)
  toolIndicatorBg: 'rgba(255, 187, 68, 0.1)',
  toolIndicatorBorder: 'rgba(255, 187, 68, 0.2)',
  toolIndicatorText: '#ffbb44',

  // Canvas drawing — cost labels
  costText: '#66ffaa',
  costTextDim: '#66ffaa80',
  costPillBg: 'rgba(10, 20, 40, 0.75)',
  costPillStroke: 'rgba(102, 255, 170, 0.3)',

  // Canvas drawing — cost panel bar fills
  barFillMain: 'rgba(102, 204, 255, 0.15)',
  barFillSub: 'rgba(204, 136, 255, 0.15)',

  // ─── Transcript / message feed colors ───────────────────────────────────────

  // User messages
  userMsgBg: 'rgba(255, 187, 68, 0.06)',
  userMsgBorder: 'rgba(255, 187, 68, 0.12)',
  userLabel: '#ffbb4490',
  userText: '#ffcc66',

  // Assistant messages
  assistantLabel: '#66ccff80',
  assistantText: '#aaeeff',

  // Thinking messages
  thinkingBgExpanded: 'rgba(180, 140, 255, 0.06)',
  thinkingBgCollapsed: 'rgba(180, 140, 255, 0.03)',
  thinkingBorder: 'rgba(180, 140, 255, 0.08)',
  thinkingLabel: '#bb99ff70',
  thinkingArrow: '#bb99ff55',
  thinkingPreview: '#bb99ff',
  thinkingTextExpanded: '#bb99ff80',
  thinkingBorderLeft: 'rgba(180, 140, 255, 0.15)',

  // Tool call messages
  toolCallBg: 'rgba(255, 187, 68, 0.05)',
  toolCallBorder: 'rgba(255, 187, 68, 0.1)',

  // Tool result messages
  bashResultBg: 'rgba(0,0,0,0.25)',
  toolResultBg: 'rgba(102, 255, 170, 0.04)',
  bashResultBorder: 'rgba(255, 187, 68, 0.1)',
  toolResultBorder: 'rgba(102, 255, 170, 0.08)',
  bashResultText: '#aaeeff80',
  toolResultText: '#66ffaa80',
  textFaint: '#aaeeff60',

  // Search highlight
  searchHighlightBg: 'rgba(255,187,68,0.3)',

  // ─── Diff / code block colors ───────────────────────────────────────────────

  codeBlockBg: 'rgba(0,0,0,0.3)',
  diffRemoved: '#ff6666',
  diffRemovedBg: 'rgba(255,80,80,0.08)',
  diffAdded: '#66ff88',
  diffAddedBg: 'rgba(80,255,120,0.08)',

  // ─── Tool content colors ────────────────────────────────────────────────────

  filePathActive: '#66ccff',
  filePathInactive: '#66ccff90',
  todoCompleted: '#66ffaa',
  todoCompletedText: '#66ffaa90',
  todoPending: '#66ccff60',
  contentDim: '#aaeeff90',
  searchIcon: '#66ccff60',

  // ─── Panel header / chrome text ─────────────────────────────────────────────

  panelLabel: '#66ccff90',
  panelLabelDim: '#66ccff65',
  scrollBtnText: '#66ccff',
  scrollbarThumb: 'rgba(100,200,255,0.15)',
} as const

// ─── Light palette ────────────────────────────────────────────────────────────

const COLOR_RE = /#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)/g

export interface TransformColorOptions {
  opacity?: number
  invert?: boolean
}

export function transformColor(color: string, options?: TransformColorOptions): string {
  let c = colord(color)
  if (c.isValid()) {
    if (options?.opacity !== undefined) c = c.alpha(options.opacity)
    if (options?.invert) c = c.invert()
    return c.toRgbString()
  }
  
  return color.replace(COLOR_RE, (match) => {
    const m = colord(match)
    return m.isValid() ? m.toRgbString() : match
  })
}

export const LIGHT_COLORS = {
  // Background
  void: colord('#050510').lighten(0.94).toHex(),
  hexGrid: colord('#0d0d1f').lighten(0.74).toHex(),

  // Primary Hologram
  holoBase: transformColor('#66ccff'),
  holoBright: transformColor('#aaeeff'),
  holoHot: transformColor('#ffffff'),

  // Agent States
  idle: transformColor('#66ccff'),
  thinking: transformColor('#66ccff'),
  tool_calling: transformColor('#ffbb44'),
  complete: transformColor('#66ffaa'),
  error: transformColor('#ff5566'),
  paused: transformColor('#888899'),
  waiting_permission: transformColor('#ffaa33'),

  // Edge/Particle Colors
  dispatch: transformColor('#cc88ff'),
  return: transformColor('#66ffaa'),
  tool: transformColor('#ffbb44'),
  message: transformColor('#66ccff'),

  // Context breakdown colors
  contextSystem: transformColor('#555577'),
  contextUser: transformColor('#66ccff'),
  contextToolResults: transformColor('#ffbb44'),
  contextReasoning: transformColor('#cc88ff'),
  contextSubagent: transformColor('#66ffaa'),

  // UI Chrome
  nodeInterior: colord('rgb(10, 15, 40)').lighten(0.75).alpha(0.5).toRgbString(),
  textPrimary: transformColor('#aaeeff'),
  textDim: colord('#66ccff').darken(0.4).alpha(0.56).toRgbString(),
  textMuted: colord('#66ccff').darken(0.4).alpha(0.31).toRgbString(),

  // Glass card
  glassBg: transformColor('rgb(10, 15, 30)', { opacity: 0.7 }),
  glassBorder: transformColor('rgb(100, 200, 255)', { opacity: 0.15 }),
  glassHighlight: transformColor('rgb(100, 200, 255)', { opacity: 0.08 }),

  // Holo background/border opacities (avoids scattered rgba literals)
  holoBg03: transformColor('rgb(100, 200, 255)', { opacity: 0.03 }),
  holoBg05: transformColor('rgb(100, 200, 255)', { opacity: 0.05 }),
  holoBg10: transformColor('rgb(100, 200, 255)', { opacity: 0.1 }),
  holoBorder06: transformColor('rgb(100, 200, 255)', { opacity: 0.06 }),
  holoBorder08: transformColor('rgb(100, 200, 255)', { opacity: 0.08 }),
  holoBorder10: transformColor('rgb(100, 200, 255)', { opacity: 0.1 }),
  holoBorder12: transformColor('rgb(100, 200, 255)', { opacity: 0.12 }),

  // Panel chrome
  panelBg: transformColor('rgb(8, 12, 24)', { opacity: 0.85 }),
  panelSeparator: transformColor('rgb(100, 200, 255)', { opacity: 0.04 }),

  // Toggle button states
  toggleActive: transformColor('rgb(100, 200, 255)', { opacity: 0.15 }),
  toggleInactive: transformColor('rgb(100, 200, 255)', { opacity: 0.05 }),
  toggleBorder: transformColor('rgb(100, 200, 255)', { opacity: 0.1 }),

  // Live indicator
  liveDot: transformColor('#ff4444'),
  liveText: transformColor('#ff6666'),
  liveResumeBg: transformColor('rgb(255, 68, 68)', { opacity: 0.15 }),
  liveResumeBorder: transformColor('rgb(255, 68, 68)', { opacity: 0.35 }),

  // Discovery type colors
  discoveryFile: transformColor('#66ccff'),
  discoveryPattern: transformColor('#cc88ff'),
  discoveryFinding: transformColor('#66ffaa'),
  discoveryCode: transformColor('#ffbb44'),

  // Session tab states
  tabSelectedBg: transformColor('rgb(100, 200, 255)', { opacity: 0.15 }),
  tabInactiveBg: transformColor('rgb(100, 200, 255)', { opacity: 0.03 }),
  tabSelectedBorder: transformColor('rgb(100, 200, 255)', { opacity: 0.3 }),
  tabInactiveBorder: transformColor('rgb(100, 200, 255)', { opacity: 0.08 }),
  tabClose: transformColor('#ff6688'),

  // Role colors (message bubbles)
  roleAssistantBg: transformColor('rgb(80, 160, 220)', { opacity: 0.12 }),
  roleAssistantBgSelected: transformColor('rgb(80, 160, 220)', { opacity: 0.2 }),
  roleAssistantText: transformColor('#a0d4f0'),
  roleThinkingBg: transformColor('rgb(140, 100, 200)', { opacity: 0.12 }),
  roleThinkingBgSelected: transformColor('rgb(140, 100, 200)', { opacity: 0.2 }),
  roleThinkingText: transformColor('#c0a0e0'),
  roleUserBg: transformColor('rgb(200, 160, 80)', { opacity: 0.12 }),
  roleUserBgSelected: transformColor('rgb(200, 160, 80)', { opacity: 0.2 }),
  roleUserText: transformColor('#e0c888'),

  // Result/success
  resultBg: transformColor('rgb(102, 255, 170)', { opacity: 0.05 }),
  resultBorder: transformColor('rgb(102, 255, 170)', { opacity: 0.1 }),

  // Unread indicator
  unreadDot: transformColor('#ff6666'),

  // Play button
  playBtnBg: transformColor('rgb(102, 204, 255)', { opacity: 0.12 }),
  playBtnActiveBg: transformColor('rgb(102, 204, 255)', { opacity: 0.2 }),
  playBtnBorder: transformColor('rgb(102, 204, 255)', { opacity: 0.4 }),
  playBtnGlow: `0 0 12px ${transformColor('rgb(102, 204, 255)', { opacity: 0.15 })}`,

  // Scrubber
  scrubberFill: `linear-gradient(90deg, ${transformColor('rgb(102, 204, 255)', { opacity: 0.3 })}, ${transformColor('rgb(102, 204, 255)', { opacity: 0.6 })})`,
  scrubberHeadGlow: `0 0 10px ${transformColor('rgb(102, 204, 255)', { opacity: 0.6 })}, 0 0 20px ${transformColor('rgb(102, 204, 255)', { opacity: 0.2 })}`,
  reviewBtnBorder: transformColor('rgb(102, 204, 255)', { opacity: 0.25 }),

  // Cost overlay
  costActiveBg: transformColor('rgb(102, 255, 170)', { opacity: 0.15 }),

  // Canvas drawing — bubble base colors
  bubbleThinking: transformColor('rgb(140, 100, 200)'),
  bubbleUser: transformColor('rgb(200, 160, 80)'),
  bubbleAssistant: transformColor('rgb(80, 160, 220)'),

  // Canvas drawing — tool card backgrounds
  toolCardError: transformColor('rgb(40, 10, 15)'),
  toolCardSelected: transformColor('rgb(100, 200, 255)'),
  toolCard: transformColor('rgb(10, 15, 30)'),

  // Canvas drawing — agent/tool card backgrounds
  cardBgDark: colord('rgb(5, 5, 16)').lighten(0.9).alpha(0.8).toRgbString(),
  cardBg: transformColor('rgb(10, 15, 30)', { opacity: 0.6 }),
  cardBgSelected: transformColor('rgb(10, 15, 30)', { opacity: 0.8 }),
  cardBgError: transformColor('rgb(40, 10, 15)', { opacity: 0.8 }),
  cardBgSelectedHolo: transformColor('rgb(100, 200, 255)', { opacity: 0.15 }),
  cardBgFaintOverlay: colord('rgb(0, 0, 0)').alpha(0.01).toRgbString(),

  // Active tool indicator (detail card)
  toolIndicatorBg: transformColor('rgb(255, 187, 68)', { opacity: 0.1 }),
  toolIndicatorBorder: transformColor('rgb(255, 187, 68)', { opacity: 0.2 }),
  toolIndicatorText: transformColor('#ffbb44'),

  // Canvas drawing — cost labels
  costText: transformColor('#66ffaa'),
  costTextDim: transformColor('#66ffaa', { opacity: 0.5 }),
  costPillBg: transformColor('rgb(10, 20, 40)', { opacity: 0.75 }),
  costPillStroke: transformColor('rgb(102, 255, 170)', { opacity: 0.3 }),

  // Canvas drawing — cost panel bar fills
  barFillMain: transformColor('rgb(102, 204, 255)', { opacity: 0.15 }),
  barFillSub: transformColor('rgb(204, 136, 255)', { opacity: 0.15 }),

  // ─── Transcript / message feed colors ───────────────────────────────────────

  // User messages
  userMsgBg: transformColor('rgb(255, 187, 68)', { opacity: 0.06 }),
  userMsgBorder: transformColor('rgb(255, 187, 68)', { opacity: 0.12 }),
  userLabel: transformColor('#ffbb44', { opacity: 0.56 }),
  userText: transformColor('#ffcc66'),

  // Assistant messages
  assistantLabel: transformColor('#66ccff', { opacity: 0.5 }),
  assistantText: transformColor('#aaeeff'),

  // Thinking messages
  thinkingBgExpanded: transformColor('rgb(180, 140, 255)', { opacity: 0.06 }),
  thinkingBgCollapsed: transformColor('rgb(180, 140, 255)', { opacity: 0.03 }),
  thinkingBorder: transformColor('rgb(180, 140, 255)', { opacity: 0.08 }),
  thinkingLabel: transformColor('#bb99ff', { opacity: 0.44 }),
  thinkingArrow: transformColor('#bb99ff', { opacity: 0.33 }),
  thinkingPreview: transformColor('#bb99ff'),
  thinkingTextExpanded: transformColor('#bb99ff', { opacity: 0.5 }),
  thinkingBorderLeft: transformColor('rgb(180, 140, 255)', { opacity: 0.15 }),

  // Tool call messages
  toolCallBg: transformColor('rgb(255, 187, 68)', { opacity: 0.05 }),
  toolCallBorder: transformColor('rgb(255, 187, 68)', { opacity: 0.1 }),

  // Tool result messages
  bashResultBg: transformColor('rgb(0, 0, 0)', { opacity: 0.25 }),
  toolResultBg: transformColor('rgb(102, 255, 170)', { opacity: 0.04 }),
  bashResultBorder: transformColor('rgb(255, 187, 68)', { opacity: 0.1 }),
  toolResultBorder: transformColor('rgb(102, 255, 170)', { opacity: 0.08 }),
  bashResultText: transformColor('#aaeeff', { opacity: 0.5 }),
  toolResultText: transformColor('#66ffaa', { opacity: 0.5 }),
  textFaint: transformColor('#aaeeff', { opacity: 0.38 }),

  // Search highlight
  searchHighlightBg: transformColor('rgb(255, 187, 68)', { opacity: 0.3 }),

  // ─── Diff / code block colors ───────────────────────────────────────────────

  codeBlockBg: transformColor('rgb(0, 0, 0)', { opacity: 0.3 }),
  diffRemoved: transformColor('#ff6666'),
  diffRemovedBg: transformColor('rgb(255, 80, 80)', { opacity: 0.08 }),
  diffAdded: transformColor('#66ff88'),
  diffAddedBg: transformColor('rgb(80, 255, 120)', { opacity: 0.08 }),

  // ─── Tool content colors ────────────────────────────────────────────────────

  filePathActive: transformColor('#66ccff'),
  filePathInactive: transformColor('#66ccff', { opacity: 0.56 }),
  todoCompleted: transformColor('#66ffaa'),
  todoCompletedText: transformColor('#66ffaa', { opacity: 0.56 }),
  todoPending: transformColor('#66ccff', { opacity: 0.38 }),
  contentDim: transformColor('#aaeeff', { opacity: 0.56 }),
  searchIcon: transformColor('#66ccff', { opacity: 0.38 }),

  // ─── Panel header / chrome text ─────────────────────────────────────────────

  panelLabel: transformColor('#66ccff', { opacity: 0.56 }),
  panelLabelDim: transformColor('#66ccff', { opacity: 0.4 }),
  scrollBtnText: transformColor('#66ccff'),
  scrollbarThumb: transformColor('rgb(100, 200, 255)', { opacity: 0.15 }),
} as const

// Dev override: read from localStorage and merge into LIGHT_COLORS at module init.
// Page reload is required for overrides to take effect.
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  try {
    const raw = localStorage.getItem('lightColorOverrides')
    if (raw) {
      const overrides = JSON.parse(raw) as Partial<Record<keyof typeof LIGHT_COLORS, string>>
      Object.assign(LIGHT_COLORS as Record<string, string>, overrides)
    }
  } catch {
    // Ignore malformed JSON or unavailable localStorage
  }
}

/** Backward-compat alias — existing code importing COLORS gets dark palette. */
export const COLORS = DARK_COLORS

/** Union of both palettes — use as the param type for theme-aware draw functions. */
export type ColorPalette = typeof DARK_COLORS | typeof LIGHT_COLORS

/** Returns the correct palette for the current theme. */
export function getColors(isDark: boolean): ColorPalette {
  return isDark ? DARK_COLORS : LIGHT_COLORS
}

// ─── Role Colors (message feed & bubbles) ───────────────────────────────────

export const ROLE_COLORS: Record<string, { bg: string; bgSelected: string; text: string; label: string }> = {
  assistant: { bg: COLORS.roleAssistantBg, bgSelected: COLORS.roleAssistantBgSelected, text: COLORS.roleAssistantText, label: 'CLAUDE' },
  thinking:  { bg: COLORS.roleThinkingBg,  bgSelected: COLORS.roleThinkingBgSelected,  text: COLORS.roleThinkingText,  label: 'THINKING' },
  user:      { bg: COLORS.roleUserBg,       bgSelected: COLORS.roleUserBgSelected,       text: COLORS.roleUserText,       label: 'USER' },
} as const

// ─── Color Helper Functions ──────────────────────────────────────────────────

export function getStateColor(state: AgentState, colors: ColorPalette = DARK_COLORS): string {
  switch (state) {
    case 'idle': return colors.idle
    case 'thinking': return colors.thinking
    case 'tool_calling': return colors.tool_calling
    case 'complete': return colors.complete
    case 'error': return colors.error
    case 'paused': return colors.paused
    case 'waiting_permission': return colors.waiting_permission
  }
}

export function getDiscoveryTypeColor(type: string, colors: ColorPalette = DARK_COLORS): string {
  switch (type) {
    case 'file': return colors.discoveryFile
    case 'pattern': return colors.discoveryPattern
    case 'finding': return colors.discoveryFinding
    default: return colors.discoveryCode
  }
}

/** Apply alpha to a complete color string using colord */
export function withAlpha(color: string, alpha: number): string {
  return colord(color).alpha(alpha).toRgbString()
}

/** Build the context-breakdown color segments for a given breakdown. */
export function contextSegments(bd: ContextBreakdown, colors: ColorPalette = DARK_COLORS) {
  return [
    { value: bd.systemPrompt, color: colors.contextSystem },
    { value: bd.userMessages, color: colors.contextUser },
    { value: bd.toolResults, color: colors.contextToolResults },
    { value: bd.reasoning, color: colors.contextReasoning },
    { value: bd.subagentResults, color: colors.contextSubagent },
  ]
}
