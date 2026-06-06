import { createContext } from 'react'
import { DARK_COLORS, type ColorPalette } from '@/lib/colors'

export const StoryColorsContext = createContext<ColorPalette>(DARK_COLORS)
