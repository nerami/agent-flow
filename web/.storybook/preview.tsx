import React, { useEffect } from 'react'
import type { Decorator } from '@storybook/react'
import { useGlobals } from 'storybook/preview-api'
import { DARK_COLORS, LIGHT_COLORS, type ColorPalette } from '@/lib/colors'
import { createContext } from 'react'
import '../app/globals.css'

export const StoryColorsContext = createContext<ColorPalette>(DARK_COLORS)

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

const withTheme: Decorator = (Story, context) => {
  const [globals] = useGlobals()
  const isDark = (globals.theme ?? 'dark') !== 'light'
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

export const decorators = [withTheme]
