'use client'

import { useEffect, useRef, useState } from 'react'
import Wheel from '@uiw/react-color-wheel'
import { colord } from 'colord'
import { LIGHT_COLORS } from '../../lib/colors'

const LS_KEY = 'lightColorOverrides'

// All groups from LIGHT_COLORS, mirroring the comment structure in colors.ts
const COLOR_GROUPS: Array<{ label: string; keys: Array<keyof typeof LIGHT_COLORS> }> = [
  { label: 'Background', keys: ['void', 'hexGrid'] },
  { label: 'Primary Hologram', keys: ['holoBase', 'holoBright', 'holoHot'] },
  {
    label: 'Agent States',
    keys: ['idle', 'thinking', 'tool_calling', 'complete', 'error', 'paused', 'waiting_permission'],
  },
  { label: 'Edge / Particle', keys: ['dispatch', 'return', 'tool', 'message'] },
  {
    label: 'Context Breakdown',
    keys: ['contextSystem', 'contextUser', 'contextToolResults', 'contextReasoning', 'contextSubagent'],
  },
  { label: 'UI Chrome', keys: ['nodeInterior', 'textPrimary', 'textDim', 'textMuted'] },
  { label: 'Glass Card', keys: ['glassBg', 'glassBorder', 'glassHighlight'] },
  {
    label: 'Holo BG / Border',
    keys: ['holoBg03', 'holoBg05', 'holoBg10', 'holoBorder06', 'holoBorder08', 'holoBorder10', 'holoBorder12'],
  },
  { label: 'Panel Chrome', keys: ['panelBg', 'panelSeparator'] },
  { label: 'Toggle States', keys: ['toggleActive', 'toggleInactive', 'toggleBorder'] },
  { label: 'Live Indicator', keys: ['liveDot', 'liveText', 'liveResumeBg', 'liveResumeBorder'] },
  { label: 'Discovery', keys: ['discoveryFile', 'discoveryPattern', 'discoveryFinding', 'discoveryCode'] },
  {
    label: 'Session Tabs',
    keys: ['tabSelectedBg', 'tabInactiveBg', 'tabSelectedBorder', 'tabInactiveBorder', 'tabClose'],
  },
  {
    label: 'Role Colors',
    keys: [
      'roleAssistantBg', 'roleAssistantBgSelected', 'roleAssistantText',
      'roleThinkingBg', 'roleThinkingBgSelected', 'roleThinkingText',
      'roleUserBg', 'roleUserBgSelected', 'roleUserText',
    ],
  },
  { label: 'Result', keys: ['resultBg', 'resultBorder'] },
  { label: 'Unread', keys: ['unreadDot'] },
  {
    label: 'Play Button',
    keys: ['playBtnBg', 'playBtnActiveBg', 'playBtnBorder', 'playBtnGlow'],
  },
  { label: 'Scrubber', keys: ['scrubberFill', 'scrubberHeadGlow', 'reviewBtnBorder'] },
  { label: 'Cost Overlay', keys: ['costActiveBg'] },
  { label: 'Bubble Base', keys: ['bubbleThinking', 'bubbleUser', 'bubbleAssistant'] },
  { label: 'Tool Cards', keys: ['toolCardError', 'toolCardSelected', 'toolCard'] },
  {
    label: 'Card BG',
    keys: ['cardBgDark', 'cardBg', 'cardBgSelected', 'cardBgError', 'cardBgSelectedHolo', 'cardBgFaintOverlay'],
  },
  { label: 'Tool Indicator', keys: ['toolIndicatorBg', 'toolIndicatorBorder', 'toolIndicatorText'] },
  { label: 'Cost Labels', keys: ['costText', 'costTextDim', 'costPillBg', 'costPillStroke'] },
  { label: 'Cost Bar Fills', keys: ['barFillMain', 'barFillSub'] },
  { label: 'User Messages', keys: ['userMsgBg', 'userMsgBorder', 'userLabel', 'userText'] },
  { label: 'Assistant Messages', keys: ['assistantLabel', 'assistantText'] },
  {
    label: 'Thinking Messages',
    keys: [
      'thinkingBgExpanded', 'thinkingBgCollapsed', 'thinkingBorder',
      'thinkingLabel', 'thinkingArrow', 'thinkingPreview', 'thinkingTextExpanded', 'thinkingBorderLeft',
    ],
  },
  { label: 'Tool Call Messages', keys: ['toolCallBg', 'toolCallBorder'] },
  {
    label: 'Tool Result Messages',
    keys: ['bashResultBg', 'toolResultBg', 'bashResultBorder', 'toolResultBorder', 'bashResultText', 'toolResultText', 'textFaint'],
  },
  { label: 'Search Highlight', keys: ['searchHighlightBg'] },
  { label: 'Diff / Code Block', keys: ['codeBlockBg', 'diffRemoved', 'diffRemovedBg', 'diffAdded', 'diffAddedBg'] },
  {
    label: 'Tool Content',
    keys: ['filePathActive', 'filePathInactive', 'todoCompleted', 'todoCompletedText', 'todoPending', 'contentDim', 'searchIcon'],
  },
  { label: 'Panel Header', keys: ['panelLabel', 'panelLabelDim', 'scrollBtnText', 'scrollbarThumb'] },
]

function isComplex(value: string): boolean {
  return !colord(value).isValid()
}

function loadOverrides(): Record<string, string> {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? (JSON.parse(raw) as Record<string, string>) : {}
  } catch {
    return {}
  }
}

function toHex(value: string): string {
  const c = colord(value)
  return c.isValid() ? c.toHex() : '#000000'
}

export function ThemeColorEditor() {
  const [minimized, setMinimized] = useState(false)
  const [position, setPosition] = useState({ x: window.innerWidth - 290, y: 20 })
  const [selectedKey, setSelectedKey] = useState<keyof typeof LIGHT_COLORS | null>(null)
  const [pendingOverrides, setPendingOverrides] = useState<Record<string, string>>(loadOverrides)
  const [pickerHex, setPickerHex] = useState('#000000')
  const [hexInput, setHexInput] = useState('')
  const dragRef = useRef<{ startX: number; startY: number; panelX: number; panelY: number } | null>(null)

  // Sync picker when selected key changes
  useEffect(() => {
    if (!selectedKey) return
    const current = pendingOverrides[selectedKey as string] ?? LIGHT_COLORS[selectedKey]
    const hex = toHex(current)
    setPickerHex(hex)
    setHexInput(hex)
  }, [selectedKey])

  function handleMouseDown(e: React.MouseEvent) {
    dragRef.current = { startX: e.clientX, startY: e.clientY, panelX: position.x, panelY: position.y }
    function onMove(ev: MouseEvent) {
      if (!dragRef.current) return
      setPosition({
        x: dragRef.current.panelX + ev.clientX - dragRef.current.startX,
        y: dragRef.current.panelY + ev.clientY - dragRef.current.startY,
      })
    }
    function onUp() {
      dragRef.current = null
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  function handleWheelChange(color: { hex: string }) {
    const hex = color.hex
    setPickerHex(hex)
    setHexInput(hex)
    if (selectedKey) {
      setPendingOverrides(prev => ({ ...prev, [selectedKey]: hex }))
    }
  }

  function handleHexInput(value: string) {
    setHexInput(value)
    if (colord(value).isValid()) {
      const hex = colord(value).toHex()
      setPickerHex(hex)
      if (selectedKey) {
        setPendingOverrides(prev => ({ ...prev, [selectedKey]: hex }))
      }
    }
  }

  function handleResetKey(key: string, e: React.MouseEvent) {
    e.stopPropagation()
    setPendingOverrides(prev => {
      const next = { ...prev }
      delete next[key]
      return next
    })
    if (selectedKey === key) {
      const hex = toHex(LIGHT_COLORS[key as keyof typeof LIGHT_COLORS])
      setPickerHex(hex)
      setHexInput(hex)
    }
  }

  function handleSave() {
    localStorage.setItem(LS_KEY, JSON.stringify(pendingOverrides))
    window.location.reload()
  }

  function handleResetAll() {
    localStorage.removeItem(LS_KEY)
    window.location.reload()
  }

  const modifiedCount = Object.keys(pendingOverrides).length

  if (minimized) {
    return (
      <div
        onClick={() => setMinimized(false)}
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          zIndex: 9999,
          background: '#0d0d1f',
          border: '1px solid rgba(100,200,255,0.15)',
          borderRadius: 6,
          padding: '6px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          cursor: 'pointer',
          fontFamily: 'monospace',
          fontSize: 11,
          color: '#aaeeff',
          boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
          userSelect: 'none',
        }}
      >
        <span style={{ color: '#66ccff' }}>⬡</span>
        <span>Colors</span>
        {modifiedCount > 0 && (
          <span style={{ background: 'rgba(255,187,68,0.15)', color: '#ffbb44', padding: '1px 6px', borderRadius: 3, fontSize: 9 }}>
            {modifiedCount} modified
          </span>
        )}
        <span style={{ color: '#66ccff60', fontSize: 10 }}>▲</span>
      </div>
    )
  }

  return (
    <div
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        zIndex: 9999,
        width: 264,
        background: '#1a1a2e',
        border: '1px solid rgba(100,200,255,0.12)',
        borderRadius: 8,
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        fontFamily: 'monospace',
        fontSize: 11,
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '90vh',
      }}
    >
      {/* Header / drag handle */}
      <div
        onMouseDown={handleMouseDown}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          background: '#0d0d1f',
          borderRadius: '8px 8px 0 0',
          borderBottom: '1px solid rgba(100,200,255,0.08)',
          cursor: 'move',
          userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: '#66ccff', fontSize: 12 }}>⠿</span>
          <span style={{ color: '#aaeeff', fontWeight: 'bold', fontSize: 10, letterSpacing: '0.5px' }}>
            LIGHT THEME COLORS
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onMouseDown={e => e.stopPropagation()}
            onClick={() => setMinimized(true)}
            style={{ background: 'none', border: 'none', color: '#66ccff90', fontSize: 14, cursor: 'pointer', padding: 0, lineHeight: 1 }}
          >─</button>
        </div>
      </div>

      {/* Color list */}
      <div style={{ overflowY: 'auto', flex: 1, padding: '6px 8px' }}>
        {COLOR_GROUPS.map(group => (
          <div key={group.label}>
            <div style={{
              color: '#66ccff50',
              fontSize: 8,
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              padding: '6px 4px 4px',
              borderBottom: '1px solid rgba(100,200,255,0.06)',
              marginBottom: 3,
            }}>
              {group.label}
            </div>
            {group.keys.map(key => {
              const defaultValue = LIGHT_COLORS[key]
              const overrideValue = pendingOverrides[key as string]
              const displayValue = overrideValue ?? defaultValue
              const complex = isComplex(defaultValue)
              const modified = key in pendingOverrides
              const selected = selectedKey === key

              return (
                <div
                  key={key as string}
                  onClick={() => !complex && setSelectedKey(key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    padding: '3px 6px',
                    borderRadius: 4,
                    marginBottom: 2,
                    cursor: complex ? 'default' : 'pointer',
                    opacity: complex ? 0.45 : 1,
                    background: selected
                      ? 'rgba(100,200,255,0.1)'
                      : modified
                      ? 'rgba(255,187,68,0.08)'
                      : 'transparent',
                    border: selected
                      ? '1px solid rgba(100,200,255,0.2)'
                      : modified
                      ? '1px solid rgba(255,187,68,0.15)'
                      : '1px solid transparent',
                  }}
                >
                  <div style={{
                    width: 15,
                    height: 15,
                    borderRadius: 3,
                    background: complex ? 'transparent' : displayValue,
                    border: '1px solid rgba(255,255,255,0.2)',
                    flexShrink: 0,
                  }} />
                  <span style={{ color: '#aaeeff', flex: 1, fontSize: 10 }}>{key as string}</span>
                  {complex && <span style={{ fontSize: 9 }}>🔒</span>}
                  {modified && !complex && (
                    <>
                      <span style={{ color: '#ffbb4480', fontSize: 8 }}>mod</span>
                      <button
                        onClick={e => handleResetKey(key as string, e)}
                        style={{ background: 'none', border: 'none', color: '#ffbb4460', fontSize: 12, cursor: 'pointer', padding: 0, lineHeight: 1 }}
                        title="Reset to default"
                      >↺</button>
                    </>
                  )}
                  {!complex && !modified && (
                    <span style={{ color: '#66ccff30', fontSize: 9 }}>
                      {colord(displayValue).toHex()}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Inline picker */}
      {selectedKey && !isComplex(LIGHT_COLORS[selectedKey]) && (
        <div style={{ borderTop: '1px solid rgba(100,200,255,0.08)', padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{ color: '#66ccff60', fontSize: 8, textTransform: 'uppercase', letterSpacing: 1, alignSelf: 'flex-start' }}>
            Editing: <span style={{ color: '#aaeeff' }}>{selectedKey as string}</span>
          </div>
          <Wheel
            color={pickerHex}
            onChange={handleWheelChange}
            width={120}
            height={120}
          />
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', width: '100%' }}>
            <div style={{ width: 18, height: 18, borderRadius: 3, background: pickerHex, border: '1px solid rgba(255,255,255,0.2)', flexShrink: 0 }} />
            <input
              value={hexInput}
              onChange={e => handleHexInput(e.target.value)}
              style={{
                flex: 1,
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(100,200,255,0.15)',
                borderRadius: 4,
                padding: '4px 8px',
                color: '#aaeeff',
                fontSize: 10,
                fontFamily: 'monospace',
                outline: 'none',
              }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 12px',
        background: '#0d0d1f',
        borderRadius: '0 0 8px 8px',
        borderTop: '1px solid rgba(100,200,255,0.08)',
      }}>
        <button
          onClick={handleResetAll}
          style={{
            background: 'rgba(255,85,102,0.1)',
            border: '1px solid rgba(255,85,102,0.2)',
            color: '#ff5566',
            fontSize: 9,
            padding: '4px 8px',
            borderRadius: 4,
            cursor: 'pointer',
            fontFamily: 'monospace',
          }}
        >
          Reset all
        </button>
        <button
          onClick={handleSave}
          style={{
            background: 'rgba(102,255,170,0.1)',
            border: '1px solid rgba(102,255,170,0.2)',
            color: '#66ffaa',
            fontSize: 9,
            padding: '4px 10px',
            borderRadius: 4,
            cursor: 'pointer',
            fontFamily: 'monospace',
          }}
        >
          Save + Reload
        </button>
      </div>
    </div>
  )
}
