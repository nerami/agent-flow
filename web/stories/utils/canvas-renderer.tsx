import { useRef, useEffect, useContext } from 'react'
import { StoryColorsContext } from '@/stories/utils/story-colors-context'
import type { ColorPalette } from '@/lib/colors'

export interface CanvasRendererProps {
  width?: number
  height?: number
  /** Override background fill. Defaults to colors.void. */
  background?: string
  /** When true, runs a requestAnimationFrame loop and passes elapsed seconds as time. */
  animate?: boolean
  draw: (ctx: CanvasRenderingContext2D, colors: ColorPalette, time: number) => void
}

export function CanvasRenderer({
  width = 800,
  height = 600,
  background,
  animate = false,
  draw,
}: CanvasRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const colors = useContext(StoryColorsContext)
  const colorsRef = useRef(colors)
  colorsRef.current = colors
  const drawRef = useRef(draw)
  drawRef.current = draw
  const startRef = useRef(0)
  const rafRef = useRef(0)

  // Start/restart rAF loop when animate/dimensions change.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (animate) {
      startRef.current = performance.now()
      const loop = (now: number) => {
        const t = (now - startRef.current) / 1000
        const bg = background ?? colorsRef.current.void
        ctx.clearRect(0, 0, width, height)
        ctx.fillStyle = bg
        ctx.fillRect(0, 0, width, height)
        drawRef.current(ctx, colorsRef.current, t)
        rafRef.current = requestAnimationFrame(loop)
      }
      rafRef.current = requestAnimationFrame(loop)
      return () => cancelAnimationFrame(rafRef.current)
    }
  }, [animate, width, height, background])

  // Re-draw static (non-animated) stories on theme change.
  useEffect(() => {
    if (animate) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const bg = background ?? colors.void
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, width, height)
    drawRef.current(ctx, colors, 0)
  }, [colors, animate, width, height, background])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ display: 'block', borderRadius: 8 }}
    />
  )
}
