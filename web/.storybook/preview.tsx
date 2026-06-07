import { useEffect, type ReactElement } from 'react'
import { DARK_COLORS, LIGHT_COLORS, type ColorPalette } from '../lib/colors'
import { StoryColorsContext } from '../stories/utils/story-colors-context'
// @ts-expect-error — CSS module not typed in this context
import '../app/globals.css'

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Color theme',
    defaultValue: 'dark',
    toolbar: {
      icon: 'circlehollow',
      items: [
        { value: 'dark', title: 'Dark' },
        { value: 'light', title: 'Light' },
      ],
      showName: true,
    },
  },
}

const withTheme = (Story: () => ReactElement, context: { globals: Record<string, string> }) => {
  const isDark = (context.globals['theme'] ?? 'dark') !== 'light'
  const colors: ColorPalette = isDark ? DARK_COLORS : LIGHT_COLORS

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  return (
    <StoryColorsContext.Provider value={colors}>
      <div style={{ background: colors.void, minHeight: '100vh', padding: '16px' }}>
        <Story />
      </div>
    </StoryColorsContext.Provider>
  )
}

export const parameters = {
  layout: 'fullscreen',
}

export const decorators = [withTheme]
