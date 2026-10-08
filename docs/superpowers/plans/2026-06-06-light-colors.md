# Light Color Palettes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current no-op `LIGHT_COLORS` (dark values reformatted as rgb strings) with three properly designed light palettes exported as `LIGHT_COLORS_1`, `LIGHT_COLORS_2`, `LIGHT_COLORS_3`, with `LIGHT_COLORS` pointing to `LIGHT_COLORS_1` by default.

**Architecture:** Single file edit to `web/lib/colors.ts`. Replace the existing `LIGHT_COLORS` object (lines 243–450) with three named palette exports using raw hex/rgba values. `LIGHT_COLORS` becomes a const alias pointing to one of the three. No other files change — `ColorPalette`, `getColors()`, and all consumers remain unchanged.

**Tech Stack:** TypeScript, colord (already imported, still used by `withAlpha` and `transformColor`)

---

### Task 1: Replace LIGHT_COLORS with three named palettes

**Files:**
- Modify: `web/lib/colors.ts:243-464`

No testable logic — pure data. Verify with TypeScript type check.

- [ ] **Step 1: Delete current LIGHT_COLORS definition (lines 243–464) and replace with three palettes**

Replace everything from `// ─── Light palette ───` comment (line 222) through the closing `} as const` of `LIGHT_COLORS` and the dev-override block (line 464) with the following:

```typescript
// ─── Light palette ────────────────────────────────────────────────────────────

export const LIGHT_COLORS_1 = {
  // Background
  void: '#ffffff',
  hexGrid: '#f0f4fa',

  // Primary Hologram
  holoBase: '#0088cc',
  holoBright: '#0066aa',
  holoHot: '#003388',

  // Agent States
  idle: '#0088cc',
  thinking: '#0088cc',
  tool_calling: '#cc7700',
  complete: '#008844',
  error: '#cc2233',
  paused: '#556677',
  waiting_permission: '#aa6600',

  // Edge/Particle Colors
  dispatch: '#8833cc',
  return: '#008844',
  tool: '#cc7700',
  message: '#0088cc',

  // Context breakdown colors
  contextSystem: '#889aaa',
  contextUser: '#0088cc',
  contextToolResults: '#cc7700',
  contextReasoning: '#8833cc',
  contextSubagent: '#008844',

  // UI Chrome
  nodeInterior: 'rgba(220, 235, 255, 0.7)',
  textPrimary: '#112244',
  textDim: 'rgba(17, 34, 68, 0.6)',
  textMuted: 'rgba(17, 34, 68, 0.4)',

  // Glass card
  glassBg: 'rgba(240, 248, 255, 0.8)',
  glassBorder: 'rgba(0, 136, 204, 0.2)',
  glassHighlight: 'rgba(0, 136, 204, 0.1)',

  // Holo background/border opacities
  holoBg03: 'rgba(0, 136, 204, 0.03)',
  holoBg05: 'rgba(0, 136, 204, 0.05)',
  holoBg10: 'rgba(0, 136, 204, 0.1)',
  holoBorder06: 'rgba(0, 136, 204, 0.06)',
  holoBorder08: 'rgba(0, 136, 204, 0.08)',
  holoBorder10: 'rgba(0, 136, 204, 0.1)',
  holoBorder12: 'rgba(0, 136, 204, 0.12)',

  // Panel chrome
  panelBg: 'rgba(245, 248, 255, 0.9)',
  panelSeparator: 'rgba(0, 136, 204, 0.06)',

  // Toggle button states
  toggleActive: 'rgba(0, 136, 204, 0.15)',
  toggleInactive: 'rgba(0, 136, 204, 0.05)',
  toggleBorder: 'rgba(0, 136, 204, 0.12)',

  // Live indicator
  liveDot: '#cc2233',
  liveText: '#cc2233',
  liveResumeBg: 'rgba(204, 34, 51, 0.12)',
  liveResumeBorder: 'rgba(204, 34, 51, 0.3)',

  // Discovery type colors
  discoveryFile: '#0088cc',
  discoveryPattern: '#8833cc',
  discoveryFinding: '#008844',
  discoveryCode: '#cc7700',

  // Session tab states
  tabSelectedBg: 'rgba(0, 136, 204, 0.12)',
  tabInactiveBg: 'rgba(0, 136, 204, 0.03)',
  tabSelectedBorder: 'rgba(0, 136, 204, 0.3)',
  tabInactiveBorder: 'rgba(0, 136, 204, 0.1)',
  tabClose: '#cc2244',

  // Role colors (message bubbles)
  roleAssistantBg: 'rgba(0, 120, 200, 0.08)',
  roleAssistantBgSelected: 'rgba(0, 120, 200, 0.15)',
  roleAssistantText: '#005588',
  roleThinkingBg: 'rgba(100, 50, 180, 0.08)',
  roleThinkingBgSelected: 'rgba(100, 50, 180, 0.15)',
  roleThinkingText: '#5522aa',
  roleUserBg: 'rgba(180, 120, 0, 0.08)',
  roleUserBgSelected: 'rgba(180, 120, 0, 0.15)',
  roleUserText: '#885500',

  // Result/success
  resultBg: 'rgba(0, 140, 80, 0.06)',
  resultBorder: 'rgba(0, 140, 80, 0.12)',

  // Unread indicator
  unreadDot: '#cc2233',

  // Play button
  playBtnBg: 'rgba(0, 136, 204, 0.1)',
  playBtnActiveBg: 'rgba(0, 136, 204, 0.18)',
  playBtnBorder: 'rgba(0, 136, 204, 0.35)',
  playBtnGlow: '0 0 12px rgba(0, 136, 204, 0.15)',

  // Scrubber
  scrubberFill: 'linear-gradient(90deg, rgba(0, 136, 204, 0.3), rgba(0, 136, 204, 0.6))',
  scrubberHeadGlow: '0 0 10px rgba(0, 136, 204, 0.5), 0 0 20px rgba(0, 136, 204, 0.2)',
  reviewBtnBorder: 'rgba(0, 136, 204, 0.25)',

  // Cost overlay
  costActiveBg: 'rgba(0, 140, 80, 0.12)',

  // Canvas drawing — bubble base colors
  bubbleThinking: 'rgb(120, 70, 200)',
  bubbleUser: 'rgb(180, 130, 0)',
  bubbleAssistant: 'rgb(0, 120, 200)',

  // Canvas drawing — tool card backgrounds
  toolCardError: 'rgb(255, 230, 230)',
  toolCardSelected: 'rgb(0, 136, 204)',
  toolCard: 'rgb(240, 245, 255)',

  // Canvas drawing — agent/tool card backgrounds
  cardBgDark: 'rgba(220, 230, 255, 0.9)',
  cardBg: 'rgba(240, 246, 255, 0.7)',
  cardBgSelected: 'rgba(235, 244, 255, 0.9)',
  cardBgError: 'rgba(255, 220, 220, 0.8)',
  cardBgSelectedHolo: 'rgba(0, 136, 204, 0.12)',
  cardBgFaintOverlay: 'rgba(0, 0, 0, 0.01)',

  // Active tool indicator (detail card)
  toolIndicatorBg: 'rgba(200, 140, 0, 0.1)',
  toolIndicatorBorder: 'rgba(200, 140, 0, 0.2)',
  toolIndicatorText: '#cc7700',

  // Canvas drawing — cost labels
  costText: '#008844',
  costTextDim: 'rgba(0, 136, 68, 0.5)',
  costPillBg: 'rgba(240, 248, 255, 0.9)',
  costPillStroke: 'rgba(0, 136, 68, 0.3)',

  // Canvas drawing — cost panel bar fills
  barFillMain: 'rgba(0, 136, 204, 0.15)',
  barFillSub: 'rgba(120, 70, 200, 0.15)',

  // User messages
  userMsgBg: 'rgba(200, 140, 0, 0.06)',
  userMsgBorder: 'rgba(200, 140, 0, 0.12)',
  userLabel: 'rgba(180, 120, 0, 0.6)',
  userText: '#885500',

  // Assistant messages
  assistantLabel: 'rgba(0, 120, 200, 0.5)',
  assistantText: '#003366',

  // Thinking messages
  thinkingBgExpanded: 'rgba(120, 70, 200, 0.06)',
  thinkingBgCollapsed: 'rgba(120, 70, 200, 0.03)',
  thinkingBorder: 'rgba(120, 70, 200, 0.08)',
  thinkingLabel: 'rgba(100, 40, 180, 0.5)',
  thinkingArrow: 'rgba(100, 40, 180, 0.4)',
  thinkingPreview: '#6622cc',
  thinkingTextExpanded: 'rgba(100, 40, 180, 0.55)',
  thinkingBorderLeft: 'rgba(120, 70, 200, 0.15)',

  // Tool call messages
  toolCallBg: 'rgba(200, 140, 0, 0.05)',
  toolCallBorder: 'rgba(200, 140, 0, 0.1)',

  // Tool result messages
  bashResultBg: 'rgba(0, 0, 0, 0.05)',
  toolResultBg: 'rgba(0, 140, 80, 0.04)',
  bashResultBorder: 'rgba(200, 140, 0, 0.1)',
  toolResultBorder: 'rgba(0, 140, 80, 0.08)',
  bashResultText: 'rgba(0, 40, 80, 0.5)',
  toolResultText: 'rgba(0, 120, 60, 0.5)',
  textFaint: 'rgba(0, 40, 80, 0.35)',

  // Search highlight
  searchHighlightBg: 'rgba(200, 140, 0, 0.25)',

  // Diff / code block colors
  codeBlockBg: 'rgba(0, 0, 0, 0.04)',
  diffRemoved: '#cc2233',
  diffRemovedBg: 'rgba(200, 40, 50, 0.07)',
  diffAdded: '#008844',
  diffAddedBg: 'rgba(40, 180, 80, 0.07)',

  // Tool content colors
  filePathActive: '#0088cc',
  filePathInactive: 'rgba(0, 136, 204, 0.6)',
  todoCompleted: '#008844',
  todoCompletedText: 'rgba(0, 136, 68, 0.6)',
  todoPending: 'rgba(0, 136, 204, 0.45)',
  contentDim: 'rgba(0, 40, 80, 0.6)',
  searchIcon: 'rgba(0, 136, 204, 0.45)',

  // Panel header / chrome text
  panelLabel: 'rgba(0, 136, 204, 0.6)',
  panelLabelDim: 'rgba(0, 136, 204, 0.45)',
  scrollBtnText: '#0088cc',
  scrollbarThumb: 'rgba(0, 136, 204, 0.2)',
} as const

export const LIGHT_COLORS_2 = {
  // Background
  void: '#ffffff',
  hexGrid: '#f6f8fa',

  // Primary Hologram
  holoBase: '#0969da',
  holoBright: '#0550ae',
  holoHot: '#033d8b',

  // Agent States
  idle: '#0969da',
  thinking: '#0969da',
  tool_calling: '#9a6700',
  complete: '#1a7f37',
  error: '#cf222e',
  paused: '#57606a',
  waiting_permission: '#9a6700',

  // Edge/Particle Colors
  dispatch: '#8250df',
  return: '#1a7f37',
  tool: '#9a6700',
  message: '#0969da',

  // Context breakdown colors
  contextSystem: '#8c959f',
  contextUser: '#0969da',
  contextToolResults: '#9a6700',
  contextReasoning: '#8250df',
  contextSubagent: '#1a7f37',

  // UI Chrome
  nodeInterior: 'rgba(230, 235, 240, 0.7)',
  textPrimary: '#24292f',
  textDim: 'rgba(36, 41, 47, 0.65)',
  textMuted: 'rgba(36, 41, 47, 0.4)',

  // Glass card
  glassBg: 'rgba(248, 249, 250, 0.85)',
  glassBorder: 'rgba(9, 105, 218, 0.2)',
  glassHighlight: 'rgba(9, 105, 218, 0.08)',

  // Holo background/border opacities
  holoBg03: 'rgba(9, 105, 218, 0.03)',
  holoBg05: 'rgba(9, 105, 218, 0.05)',
  holoBg10: 'rgba(9, 105, 218, 0.1)',
  holoBorder06: 'rgba(9, 105, 218, 0.08)',
  holoBorder08: 'rgba(9, 105, 218, 0.1)',
  holoBorder10: 'rgba(9, 105, 218, 0.12)',
  holoBorder12: 'rgba(9, 105, 218, 0.15)',

  // Panel chrome
  panelBg: 'rgba(246, 248, 250, 0.92)',
  panelSeparator: 'rgba(9, 105, 218, 0.06)',

  // Toggle button states
  toggleActive: 'rgba(9, 105, 218, 0.12)',
  toggleInactive: 'rgba(9, 105, 218, 0.04)',
  toggleBorder: 'rgba(9, 105, 218, 0.12)',

  // Live indicator
  liveDot: '#cf222e',
  liveText: '#cf222e',
  liveResumeBg: 'rgba(207, 34, 46, 0.1)',
  liveResumeBorder: 'rgba(207, 34, 46, 0.3)',

  // Discovery type colors
  discoveryFile: '#0969da',
  discoveryPattern: '#8250df',
  discoveryFinding: '#1a7f37',
  discoveryCode: '#9a6700',

  // Session tab states
  tabSelectedBg: 'rgba(9, 105, 218, 0.1)',
  tabInactiveBg: 'rgba(9, 105, 218, 0.03)',
  tabSelectedBorder: 'rgba(9, 105, 218, 0.25)',
  tabInactiveBorder: 'rgba(9, 105, 218, 0.08)',
  tabClose: '#cf222e',

  // Role colors (message bubbles)
  roleAssistantBg: 'rgba(9, 105, 218, 0.07)',
  roleAssistantBgSelected: 'rgba(9, 105, 218, 0.13)',
  roleAssistantText: '#0550ae',
  roleThinkingBg: 'rgba(130, 80, 223, 0.07)',
  roleThinkingBgSelected: 'rgba(130, 80, 223, 0.13)',
  roleThinkingText: '#6e40c9',
  roleUserBg: 'rgba(154, 103, 0, 0.07)',
  roleUserBgSelected: 'rgba(154, 103, 0, 0.13)',
  roleUserText: '#7d4e00',

  // Result/success
  resultBg: 'rgba(26, 127, 55, 0.06)',
  resultBorder: 'rgba(26, 127, 55, 0.12)',

  // Unread indicator
  unreadDot: '#cf222e',

  // Play button
  playBtnBg: 'rgba(9, 105, 218, 0.08)',
  playBtnActiveBg: 'rgba(9, 105, 218, 0.15)',
  playBtnBorder: 'rgba(9, 105, 218, 0.3)',
  playBtnGlow: '0 0 12px rgba(9, 105, 218, 0.12)',

  // Scrubber
  scrubberFill: 'linear-gradient(90deg, rgba(9, 105, 218, 0.3), rgba(9, 105, 218, 0.6))',
  scrubberHeadGlow: '0 0 10px rgba(9, 105, 218, 0.5), 0 0 20px rgba(9, 105, 218, 0.2)',
  reviewBtnBorder: 'rgba(9, 105, 218, 0.2)',

  // Cost overlay
  costActiveBg: 'rgba(26, 127, 55, 0.1)',

  // Canvas drawing — bubble base colors
  bubbleThinking: 'rgb(130, 80, 223)',
  bubbleUser: 'rgb(154, 103, 0)',
  bubbleAssistant: 'rgb(9, 105, 218)',

  // Canvas drawing — tool card backgrounds
  toolCardError: 'rgb(255, 230, 230)',
  toolCardSelected: 'rgb(9, 105, 218)',
  toolCard: 'rgb(246, 248, 250)',

  // Canvas drawing — agent/tool card backgrounds
  cardBgDark: 'rgba(225, 228, 232, 0.9)',
  cardBg: 'rgba(246, 248, 250, 0.75)',
  cardBgSelected: 'rgba(240, 245, 251, 0.9)',
  cardBgError: 'rgba(255, 220, 220, 0.85)',
  cardBgSelectedHolo: 'rgba(9, 105, 218, 0.1)',
  cardBgFaintOverlay: 'rgba(0, 0, 0, 0.01)',

  // Active tool indicator (detail card)
  toolIndicatorBg: 'rgba(154, 103, 0, 0.08)',
  toolIndicatorBorder: 'rgba(154, 103, 0, 0.16)',
  toolIndicatorText: '#7d4e00',

  // Canvas drawing — cost labels
  costText: '#1a7f37',
  costTextDim: 'rgba(26, 127, 55, 0.55)',
  costPillBg: 'rgba(246, 248, 250, 0.92)',
  costPillStroke: 'rgba(26, 127, 55, 0.25)',

  // Canvas drawing — cost panel bar fills
  barFillMain: 'rgba(9, 105, 218, 0.15)',
  barFillSub: 'rgba(130, 80, 223, 0.15)',

  // User messages
  userMsgBg: 'rgba(154, 103, 0, 0.05)',
  userMsgBorder: 'rgba(154, 103, 0, 0.1)',
  userLabel: 'rgba(126, 78, 0, 0.55)',
  userText: '#7d4e00',

  // Assistant messages
  assistantLabel: 'rgba(9, 105, 218, 0.5)',
  assistantText: '#0550ae',

  // Thinking messages
  thinkingBgExpanded: 'rgba(130, 80, 223, 0.05)',
  thinkingBgCollapsed: 'rgba(130, 80, 223, 0.03)',
  thinkingBorder: 'rgba(130, 80, 223, 0.08)',
  thinkingLabel: 'rgba(110, 64, 201, 0.5)',
  thinkingArrow: 'rgba(110, 64, 201, 0.4)',
  thinkingPreview: '#6e40c9',
  thinkingTextExpanded: 'rgba(110, 64, 201, 0.5)',
  thinkingBorderLeft: 'rgba(130, 80, 223, 0.15)',

  // Tool call messages
  toolCallBg: 'rgba(154, 103, 0, 0.04)',
  toolCallBorder: 'rgba(154, 103, 0, 0.08)',

  // Tool result messages
  bashResultBg: 'rgba(0, 0, 0, 0.04)',
  toolResultBg: 'rgba(26, 127, 55, 0.04)',
  bashResultBorder: 'rgba(154, 103, 0, 0.08)',
  toolResultBorder: 'rgba(26, 127, 55, 0.08)',
  bashResultText: 'rgba(36, 41, 47, 0.55)',
  toolResultText: 'rgba(26, 127, 55, 0.55)',
  textFaint: 'rgba(36, 41, 47, 0.38)',

  // Search highlight
  searchHighlightBg: 'rgba(154, 103, 0, 0.2)',

  // Diff / code block colors
  codeBlockBg: 'rgba(0, 0, 0, 0.03)',
  diffRemoved: '#cf222e',
  diffRemovedBg: 'rgba(207, 34, 46, 0.06)',
  diffAdded: '#1a7f37',
  diffAddedBg: 'rgba(40, 167, 69, 0.06)',

  // Tool content colors
  filePathActive: '#0969da',
  filePathInactive: 'rgba(9, 105, 218, 0.6)',
  todoCompleted: '#1a7f37',
  todoCompletedText: 'rgba(26, 127, 55, 0.65)',
  todoPending: 'rgba(9, 105, 218, 0.45)',
  contentDim: 'rgba(36, 41, 47, 0.6)',
  searchIcon: 'rgba(9, 105, 218, 0.45)',

  // Panel header / chrome text
  panelLabel: 'rgba(9, 105, 218, 0.55)',
  panelLabelDim: 'rgba(9, 105, 218, 0.4)',
  scrollBtnText: '#0969da',
  scrollbarThumb: 'rgba(9, 105, 218, 0.18)',
} as const

export const LIGHT_COLORS_3 = {
  // Background
  void: '#f8faff',
  hexGrid: '#eef2fa',

  // Primary Hologram
  holoBase: '#5599dd',
  holoBright: '#3377bb',
  holoHot: '#1155aa',

  // Agent States
  idle: '#5599dd',
  thinking: '#5599dd',
  tool_calling: '#bb8822',
  complete: '#339966',
  error: '#dd4455',
  paused: '#778899',
  waiting_permission: '#bb7722',

  // Edge/Particle Colors
  dispatch: '#9966cc',
  return: '#339966',
  tool: '#bb8822',
  message: '#5599dd',

  // Context breakdown colors
  contextSystem: '#8899aa',
  contextUser: '#5599dd',
  contextToolResults: '#bb8822',
  contextReasoning: '#9966cc',
  contextSubagent: '#339966',

  // UI Chrome
  nodeInterior: 'rgba(200, 215, 240, 0.6)',
  textPrimary: '#2d3a5c',
  textDim: 'rgba(45, 58, 92, 0.6)',
  textMuted: 'rgba(45, 58, 92, 0.4)',

  // Glass card
  glassBg: 'rgba(240, 246, 255, 0.75)',
  glassBorder: 'rgba(85, 153, 221, 0.2)',
  glassHighlight: 'rgba(85, 153, 221, 0.1)',

  // Holo background/border opacities
  holoBg03: 'rgba(85, 153, 221, 0.03)',
  holoBg05: 'rgba(85, 153, 221, 0.05)',
  holoBg10: 'rgba(85, 153, 221, 0.1)',
  holoBorder06: 'rgba(85, 153, 221, 0.07)',
  holoBorder08: 'rgba(85, 153, 221, 0.1)',
  holoBorder10: 'rgba(85, 153, 221, 0.12)',
  holoBorder12: 'rgba(85, 153, 221, 0.14)',

  // Panel chrome
  panelBg: 'rgba(242, 247, 255, 0.88)',
  panelSeparator: 'rgba(85, 153, 221, 0.05)',

  // Toggle button states
  toggleActive: 'rgba(85, 153, 221, 0.14)',
  toggleInactive: 'rgba(85, 153, 221, 0.05)',
  toggleBorder: 'rgba(85, 153, 221, 0.12)',

  // Live indicator
  liveDot: '#dd4455',
  liveText: '#dd4455',
  liveResumeBg: 'rgba(221, 68, 85, 0.12)',
  liveResumeBorder: 'rgba(221, 68, 85, 0.3)',

  // Discovery type colors
  discoveryFile: '#5599dd',
  discoveryPattern: '#9966cc',
  discoveryFinding: '#339966',
  discoveryCode: '#bb8822',

  // Session tab states
  tabSelectedBg: 'rgba(85, 153, 221, 0.12)',
  tabInactiveBg: 'rgba(85, 153, 221, 0.03)',
  tabSelectedBorder: 'rgba(85, 153, 221, 0.28)',
  tabInactiveBorder: 'rgba(85, 153, 221, 0.08)',
  tabClose: '#dd4466',

  // Role colors (message bubbles)
  roleAssistantBg: 'rgba(60, 120, 210, 0.08)',
  roleAssistantBgSelected: 'rgba(60, 120, 210, 0.16)',
  roleAssistantText: '#2255aa',
  roleThinkingBg: 'rgba(110, 70, 190, 0.08)',
  roleThinkingBgSelected: 'rgba(110, 70, 190, 0.16)',
  roleThinkingText: '#6644aa',
  roleUserBg: 'rgba(190, 130, 30, 0.08)',
  roleUserBgSelected: 'rgba(190, 130, 30, 0.16)',
  roleUserText: '#775522',

  // Result/success
  resultBg: 'rgba(50, 160, 100, 0.06)',
  resultBorder: 'rgba(50, 160, 100, 0.12)',

  // Unread indicator
  unreadDot: '#dd4455',

  // Play button
  playBtnBg: 'rgba(85, 153, 221, 0.1)',
  playBtnActiveBg: 'rgba(85, 153, 221, 0.18)',
  playBtnBorder: 'rgba(85, 153, 221, 0.35)',
  playBtnGlow: '0 0 12px rgba(85, 153, 221, 0.15)',

  // Scrubber
  scrubberFill: 'linear-gradient(90deg, rgba(85, 153, 221, 0.3), rgba(85, 153, 221, 0.6))',
  scrubberHeadGlow: '0 0 10px rgba(85, 153, 221, 0.5), 0 0 20px rgba(85, 153, 221, 0.2)',
  reviewBtnBorder: 'rgba(85, 153, 221, 0.25)',

  // Cost overlay
  costActiveBg: 'rgba(50, 160, 100, 0.12)',

  // Canvas drawing — bubble base colors
  bubbleThinking: 'rgb(110, 70, 190)',
  bubbleUser: 'rgb(190, 130, 30)',
  bubbleAssistant: 'rgb(60, 120, 210)',

  // Canvas drawing — tool card backgrounds
  toolCardError: 'rgb(255, 235, 235)',
  toolCardSelected: 'rgb(85, 153, 221)',
  toolCard: 'rgb(240, 246, 255)',

  // Canvas drawing — agent/tool card backgrounds
  cardBgDark: 'rgba(210, 224, 248, 0.85)',
  cardBg: 'rgba(240, 246, 255, 0.7)',
  cardBgSelected: 'rgba(232, 242, 255, 0.88)',
  cardBgError: 'rgba(255, 225, 225, 0.82)',
  cardBgSelectedHolo: 'rgba(85, 153, 221, 0.12)',
  cardBgFaintOverlay: 'rgba(0, 0, 0, 0.01)',

  // Active tool indicator (detail card)
  toolIndicatorBg: 'rgba(187, 136, 34, 0.1)',
  toolIndicatorBorder: 'rgba(187, 136, 34, 0.2)',
  toolIndicatorText: '#aa7700',

  // Canvas drawing — cost labels
  costText: '#339966',
  costTextDim: 'rgba(51, 153, 102, 0.5)',
  costPillBg: 'rgba(240, 246, 255, 0.88)',
  costPillStroke: 'rgba(51, 153, 102, 0.28)',

  // Canvas drawing — cost panel bar fills
  barFillMain: 'rgba(85, 153, 221, 0.15)',
  barFillSub: 'rgba(153, 102, 204, 0.15)',

  // User messages
  userMsgBg: 'rgba(187, 136, 34, 0.05)',
  userMsgBorder: 'rgba(187, 136, 34, 0.1)',
  userLabel: 'rgba(170, 119, 0, 0.55)',
  userText: '#775522',

  // Assistant messages
  assistantLabel: 'rgba(85, 153, 221, 0.5)',
  assistantText: '#2255aa',

  // Thinking messages
  thinkingBgExpanded: 'rgba(153, 102, 204, 0.06)',
  thinkingBgCollapsed: 'rgba(153, 102, 204, 0.03)',
  thinkingBorder: 'rgba(153, 102, 204, 0.08)',
  thinkingLabel: 'rgba(120, 80, 180, 0.5)',
  thinkingArrow: 'rgba(120, 80, 180, 0.4)',
  thinkingPreview: '#6644aa',
  thinkingTextExpanded: 'rgba(120, 80, 180, 0.5)',
  thinkingBorderLeft: 'rgba(153, 102, 204, 0.15)',

  // Tool call messages
  toolCallBg: 'rgba(187, 136, 34, 0.04)',
  toolCallBorder: 'rgba(187, 136, 34, 0.08)',

  // Tool result messages
  bashResultBg: 'rgba(0, 0, 0, 0.04)',
  toolResultBg: 'rgba(50, 160, 100, 0.04)',
  bashResultBorder: 'rgba(187, 136, 34, 0.08)',
  toolResultBorder: 'rgba(50, 160, 100, 0.08)',
  bashResultText: 'rgba(45, 58, 92, 0.5)',
  toolResultText: 'rgba(51, 153, 102, 0.55)',
  textFaint: 'rgba(45, 58, 92, 0.36)',

  // Search highlight
  searchHighlightBg: 'rgba(187, 136, 34, 0.22)',

  // Diff / code block colors
  codeBlockBg: 'rgba(0, 0, 0, 0.03)',
  diffRemoved: '#cc3344',
  diffRemovedBg: 'rgba(200, 50, 70, 0.06)',
  diffAdded: '#339966',
  diffAddedBg: 'rgba(60, 180, 100, 0.06)',

  // Tool content colors
  filePathActive: '#5599dd',
  filePathInactive: 'rgba(85, 153, 221, 0.6)',
  todoCompleted: '#339966',
  todoCompletedText: 'rgba(51, 153, 102, 0.65)',
  todoPending: 'rgba(85, 153, 221, 0.45)',
  contentDim: 'rgba(45, 58, 92, 0.6)',
  searchIcon: 'rgba(85, 153, 221, 0.45)',

  // Panel header / chrome text
  panelLabel: 'rgba(85, 153, 221, 0.55)',
  panelLabelDim: 'rgba(85, 153, 221, 0.4)',
  scrollBtnText: '#5599dd',
  scrollbarThumb: 'rgba(85, 153, 221, 0.18)',
} as const

/** Active light palette — change this line to test a different variant */
export const LIGHT_COLORS = LIGHT_COLORS_1

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
```

- [ ] **Step 2: Run TypeScript check**

```bash
cd /Users/zrmn/Documents/playground/agent-flow/feature/light-theme
npx tsc --noEmit 2>&1 | head -40
```

Expected: no errors. If errors, common causes:
- Missing key — check `DARK_COLORS` for any key not present in the new palettes
- `ColorPalette` type mismatch — should be fine since all palettes share the same shape

- [ ] **Step 3: Commit**

```bash
cd /Users/zrmn/Documents/playground/agent-flow/feature/light-theme
git add web/lib/colors.ts
git commit -m "feat: add LIGHT_COLORS_1/2/3 proper light palettes"
```
