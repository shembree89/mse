import type { Color } from '../types/enums.ts'

export type FrameKey =
  | 'white'
  | 'blue'
  | 'black'
  | 'red'
  | 'green'
  | 'gold'
  | 'artifact'
  | 'colorless'
  | 'land'
  | 'white-blue'
  | 'blue-black'
  | 'black-red'
  | 'red-green'
  | 'green-white'
  | 'white-black'
  | 'blue-red'
  | 'black-green'
  | 'red-white'
  | 'green-blue'

const COLOR_TO_FRAME: Record<Color, FrameKey> = {
  W: 'white',
  U: 'blue',
  B: 'black',
  R: 'red',
  G: 'green',
}

// Dual color pairs in WUBRG order (allied pairs first, then enemy pairs)
const DUAL_FRAMES: Record<string, FrameKey> = {
  'WU': 'white-blue',
  'UB': 'blue-black',
  'BR': 'black-red',
  'RG': 'red-green',
  'GW': 'green-white',
  'WB': 'white-black',
  'UR': 'blue-red',
  'BG': 'black-green',
  'RW': 'red-white',
  'GU': 'green-blue',
}

// Frame colors for rendering
export const FRAME_COLORS: Record<FrameKey, { primary: string; secondary: string; text: string }> = {
  white: { primary: '#f8f6d8', secondary: '#e8e4c4', text: '#1a1a1a' },
  blue: { primary: '#0e68ab', secondary: '#1a5c8f', text: '#e0e0e0' },
  black: { primary: '#2a2a2a', secondary: '#1a1a1a', text: '#c8c8c0' },
  red: { primary: '#d3202a', secondary: '#a51a22', text: '#f0e0d0' },
  green: { primary: '#00733e', secondary: '#005a2f', text: '#e0e8d0' },
  gold: { primary: '#c9a43d', secondary: '#a88830', text: '#1a1a1a' },
  artifact: { primary: '#8a919b', secondary: '#6e757e', text: '#1a1a1a' },
  colorless: { primary: '#9ba0a8', secondary: '#7e8490', text: '#1a1a1a' },
  land: { primary: '#a08060', secondary: '#806848', text: '#1a1a1a' },
  'white-blue': { primary: '#c4d8e8', secondary: '#a0b8d0', text: '#1a1a1a' },
  'blue-black': { primary: '#1a3858', secondary: '#0e2840', text: '#c8c8d0' },
  'black-red': { primary: '#4a1a20', secondary: '#2a0a10', text: '#d0c0b8' },
  'red-green': { primary: '#6a4020', secondary: '#4a2810', text: '#e0d8c0' },
  'green-white': { primary: '#a8c8a0', secondary: '#88b080', text: '#1a1a1a' },
  'white-black': { primary: '#a0a098', secondary: '#808078', text: '#e0e0d8' },
  'blue-red': { primary: '#6a3060', secondary: '#4a1848', text: '#d0c8d8' },
  'black-green': { primary: '#1a3828', secondary: '#0a2818', text: '#c0c8b8' },
  'red-white': { primary: '#d8a898', secondary: '#c08878', text: '#1a1a1a' },
  'green-blue': { primary: '#188878', secondary: '#106858', text: '#d8e8e0' },
}

export function selectFrame(colors: Color[], types: string[]): FrameKey {
  const isLand = types.includes('Land')
  const isArtifact = types.includes('Artifact')

  if (isLand && colors.length === 0) return 'land'
  if (isArtifact && colors.length === 0) return 'artifact'
  if (colors.length === 0) return 'colorless'
  if (colors.length === 1) return COLOR_TO_FRAME[colors[0]]
  if (colors.length === 2) {
    const key = colors.join('')
    return DUAL_FRAMES[key] ?? 'gold'
  }
  return 'gold'
}

export function getFrameColors(frameKey: FrameKey) {
  return FRAME_COLORS[frameKey]
}

/**
 * Returns the mono-color keys that make up a frame.
 * For dual-color frames, returns [leftColor, rightColor].
 * For mono-color/special frames, returns [key].
 */
export function getFrameComponents(frameKey: FrameKey): [string] | [string, string] {
  if (frameKey.includes('-')) {
    const [left, right] = frameKey.split('-')
    return [left, right]
  }
  return [frameKey]
}
