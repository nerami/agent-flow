/**
 * Holographic color palette and role color definitions.
 *
 * Extracted from agent-types.ts to keep that file focused on type definitions.
 * All colors are re-exported from agent-types.ts for backward compatibility.
 */

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

  // Canvas drawing — bubble base colors (partial rgba, alpha appended at draw time)
  bubbleThinkingBase: 'rgba(140, 100, 200,',
  bubbleUserBase: 'rgba(200, 160, 80,',
  bubbleAssistantBase: 'rgba(80, 160, 220,',

  // Canvas drawing — tool card backgrounds (partial rgba, alpha appended at draw time)
  toolCardErrorBase: 'rgba(40, 10, 15,',
  toolCardSelectedBase: 'rgba(100, 200, 255,',
  toolCardBase: 'rgba(10, 15, 30,',

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

export const LIGHT_COLORS = {
  // Background
  void: '#f0f4ff',
  hexGrid: '#e4eaf8',

  // Primary Hologram
  holoBase: '#0088bb',
  holoBright: '#005588',
  holoHot: '#002244',

  // Agent States
  idle: '#0088bb',
  thinking: '#0088bb',
  tool_calling: '#cc7700',
  complete: '#007744',
  error: '#cc2233',
  paused: '#6677aa',
  waiting_permission: '#cc6600',

  // Edge/Particle Colors
  dispatch: '#7733cc',
  return: '#007744',
  tool: '#cc7700',
  message: '#0088bb',

  // Context breakdown colors
  contextSystem: '#8899bb',
  contextUser: '#0088bb',
  contextToolResults: '#cc7700',
  contextReasoning: '#7733cc',
  contextSubagent: '#007744',

  // UI Chrome
  nodeInterior: 'rgba(240, 244, 255, 0.6)',
  textPrimary: '#002244',
  textDim: '#0088bb90',
  textMuted: '#0088bb50',

  // Glass card
  glassBg: 'rgba(240, 244, 255, 0.85)',
  glassBorder: 'rgba(0, 136, 187, 0.22)',
  glassHighlight: 'rgba(0, 136, 187, 0.1)',

  // Holo background/border opacities
  holoBg03: 'rgba(0, 136, 187, 0.03)',
  holoBg05: 'rgba(0, 136, 187, 0.05)',
  holoBg10: 'rgba(0, 136, 187, 0.1)',
  holoBorder06: 'rgba(0, 136, 187, 0.1)',
  holoBorder08: 'rgba(0, 136, 187, 0.13)',
  holoBorder10: 'rgba(0, 136, 187, 0.17)',
  holoBorder12: 'rgba(0, 136, 187, 0.2)',

  // Panel chrome
  panelBg: 'rgba(235, 240, 255, 0.92)',
  panelSeparator: 'rgba(0, 136, 187, 0.06)',

  // Toggle button states
  toggleActive: 'rgba(0, 136, 187, 0.15)',
  toggleInactive: 'rgba(0, 136, 187, 0.05)',
  toggleBorder: 'rgba(0, 136, 187, 0.15)',

  // Live indicator
  liveDot: '#cc2233',
  liveText: '#cc2233',
  liveResumeBg: 'rgba(204, 34, 51, 0.1)',
  liveResumeBorder: 'rgba(204, 34, 51, 0.3)',

  // Discovery type colors
  discoveryFile: '#0088bb',
  discoveryPattern: '#7733cc',
  discoveryFinding: '#007744',
  discoveryCode: '#cc7700',

  // Session tab states
  tabSelectedBg: 'rgba(0, 136, 187, 0.15)',
  tabInactiveBg: 'rgba(0, 136, 187, 0.04)',
  tabSelectedBorder: 'rgba(0, 136, 187, 0.35)',
  tabInactiveBorder: 'rgba(0, 136, 187, 0.12)',
  tabClose: '#cc2233',

  // Role colors (message bubbles)
  roleAssistantBg: 'rgba(0, 100, 180, 0.08)',
  roleAssistantBgSelected: 'rgba(0, 100, 180, 0.16)',
  roleAssistantText: '#004488',
  roleThinkingBg: 'rgba(100, 50, 180, 0.08)',
  roleThinkingBgSelected: 'rgba(100, 50, 180, 0.16)',
  roleThinkingText: '#5522aa',
  roleUserBg: 'rgba(160, 100, 0, 0.08)',
  roleUserBgSelected: 'rgba(160, 100, 0, 0.16)',
  roleUserText: '#775500',

  // Result/success
  resultBg: 'rgba(0, 119, 68, 0.05)',
  resultBorder: 'rgba(0, 119, 68, 0.15)',

  // Unread indicator
  unreadDot: '#cc2233',

  // Play button
  playBtnBg: 'rgba(0, 136, 187, 0.1)',
  playBtnActiveBg: 'rgba(0, 136, 187, 0.18)',
  playBtnBorder: 'rgba(0, 136, 187, 0.4)',
  playBtnGlow: '0 0 12px rgba(0, 136, 187, 0.15)',

  // Scrubber
  scrubberFill: 'linear-gradient(90deg, rgba(0,136,187,0.3), rgba(0,136,187,0.6))',
  scrubberHeadGlow: '0 0 10px rgba(0, 136, 187, 0.5), 0 0 20px rgba(0, 136, 187, 0.2)',
  reviewBtnBorder: 'rgba(0, 136, 187, 0.25)',

  // Cost overlay
  costActiveBg: 'rgba(0, 119, 68, 0.12)',

  // Canvas drawing — bubble base colors (partial rgba, alpha appended at draw time)
  bubbleThinkingBase: 'rgba(100, 50, 180,',
  bubbleUserBase: 'rgba(160, 100, 0,',
  bubbleAssistantBase: 'rgba(0, 100, 180,',

  // Canvas drawing — tool card backgrounds (partial rgba, alpha appended at draw time)
  toolCardErrorBase: 'rgba(204, 34, 51,',
  toolCardSelectedBase: 'rgba(0, 136, 187,',
  toolCardBase: 'rgba(230, 236, 255,',

  // Canvas drawing — agent/tool card backgrounds
  cardBgDark: 'rgba(230, 236, 255, 0.9)',
  cardBg: 'rgba(240, 244, 255, 0.7)',
  cardBgSelected: 'rgba(240, 244, 255, 0.9)',
  cardBgError: 'rgba(255, 235, 236, 0.9)',
  cardBgSelectedHolo: 'rgba(0, 136, 187, 0.12)',
  cardBgFaintOverlay: 'rgba(255, 255, 255, 0.01)',

  // Active tool indicator (detail card)
  toolIndicatorBg: 'rgba(204, 119, 0, 0.1)',
  toolIndicatorBorder: 'rgba(204, 119, 0, 0.2)',
  toolIndicatorText: '#cc7700',

  // Canvas drawing — cost labels
  costText: '#007744',
  costTextDim: '#00774480',
  costPillBg: 'rgba(240, 244, 255, 0.85)',
  costPillStroke: 'rgba(0, 119, 68, 0.3)',

  // Canvas drawing — cost panel bar fills
  barFillMain: 'rgba(0, 136, 187, 0.2)',
  barFillSub: 'rgba(119, 51, 204, 0.2)',

  // ─── Transcript / message feed colors ───────────────────────────────────────

  // User messages
  userMsgBg: 'rgba(160, 100, 0, 0.06)',
  userMsgBorder: 'rgba(160, 100, 0, 0.12)',
  userLabel: '#cc770090',
  userText: '#775500',

  // Assistant messages
  assistantLabel: '#0088bb80',
  assistantText: '#004488',

  // Thinking messages
  thinkingBgExpanded: 'rgba(100, 50, 180, 0.06)',
  thinkingBgCollapsed: 'rgba(100, 50, 180, 0.03)',
  thinkingBorder: 'rgba(100, 50, 180, 0.1)',
  thinkingLabel: '#7733cc70',
  thinkingArrow: '#7733cc55',
  thinkingPreview: '#5522aa',
  thinkingTextExpanded: '#7733cc80',
  thinkingBorderLeft: 'rgba(100, 50, 180, 0.18)',

  // Tool call messages
  toolCallBg: 'rgba(204, 119, 0, 0.05)',
  toolCallBorder: 'rgba(204, 119, 0, 0.12)',

  // Tool result messages
  bashResultBg: 'rgba(230, 236, 255, 0.5)',
  toolResultBg: 'rgba(0, 119, 68, 0.04)',
  bashResultBorder: 'rgba(204, 119, 0, 0.12)',
  toolResultBorder: 'rgba(0, 119, 68, 0.1)',
  bashResultText: '#00448880',
  toolResultText: '#00774480',
  textFaint: '#00448860',

  // Search highlight
  searchHighlightBg: 'rgba(204,119,0,0.25)',

  // ─── Diff / code block colors ───────────────────────────────────────────────

  codeBlockBg: 'rgba(230, 236, 255, 0.6)',
  diffRemoved: '#cc2233',
  diffRemovedBg: 'rgba(204,34,51,0.08)',
  diffAdded: '#007744',
  diffAddedBg: 'rgba(0,119,68,0.08)',

  // ─── Tool content colors ────────────────────────────────────────────────────

  filePathActive: '#0088bb',
  filePathInactive: '#0088bb90',
  todoCompleted: '#007744',
  todoCompletedText: '#00774490',
  todoPending: '#0088bb60',
  contentDim: '#00448890',
  searchIcon: '#0088bb60',

  // ─── Panel header / chrome text ─────────────────────────────────────────────

  panelLabel: '#0088bb90',
  panelLabelDim: '#0088bb65',
  scrollBtnText: '#0088bb',
  scrollbarThumb: 'rgba(0,136,187,0.2)',
} as const

/** Backward-compat alias — existing code importing COLORS gets dark palette. */
export const COLORS = DARK_COLORS

/** Returns the correct palette for the current theme. */
export function getColors(isDark: boolean) {
  return isDark ? DARK_COLORS : LIGHT_COLORS
}

// ─── Role Colors (message feed & bubbles) ───────────────────────────────────

export const ROLE_COLORS: Record<string, { bg: string; bgSelected: string; text: string; label: string }> = {
  assistant: { bg: COLORS.roleAssistantBg, bgSelected: COLORS.roleAssistantBgSelected, text: COLORS.roleAssistantText, label: 'CLAUDE' },
  thinking:  { bg: COLORS.roleThinkingBg,  bgSelected: COLORS.roleThinkingBgSelected,  text: COLORS.roleThinkingText,  label: 'THINKING' },
  user:      { bg: COLORS.roleUserBg,       bgSelected: COLORS.roleUserBgSelected,       text: COLORS.roleUserText,       label: 'USER' },
} as const

// ─── Color Helper Functions ──────────────────────────────────────────────────

export function getStateColor(state: AgentState): string {
  switch (state) {
    case 'idle': return COLORS.idle
    case 'thinking': return COLORS.thinking
    case 'tool_calling': return COLORS.tool_calling
    case 'complete': return COLORS.complete
    case 'error': return COLORS.error
    case 'paused': return COLORS.paused
    case 'waiting_permission': return COLORS.waiting_permission
  }
}

export function getDiscoveryTypeColor(type: string): string {
  switch (type) {
    case 'file': return COLORS.discoveryFile
    case 'pattern': return COLORS.discoveryPattern
    case 'finding': return COLORS.discoveryFinding
    default: return COLORS.discoveryCode
  }
}

/** Safely combine a partial rgba base (e.g. 'rgba(10, 15, 30,') with an alpha value */
export function withAlpha(rgbaBase: string, alpha: number): string {
  return `${rgbaBase} ${alpha})`
}

/** Build the context-breakdown color segments for a given breakdown. */
export function contextSegments(bd: ContextBreakdown) {
  return [
    { value: bd.systemPrompt, color: COLORS.contextSystem },
    { value: bd.userMessages, color: COLORS.contextUser },
    { value: bd.toolResults, color: COLORS.contextToolResults },
    { value: bd.reasoning, color: COLORS.contextReasoning },
    { value: bd.subagentResults, color: COLORS.contextSubagent },
  ]
}
