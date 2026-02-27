import type { Color } from '../types/enums.ts'

export interface ManaSymbol {
  type: 'generic' | 'color' | 'hybrid' | 'phyrexian' | 'snow' | 'colorless' | 'x' | 'tap' | 'untap'
  value: string
  colors: Color[]
  cmc: number
}

const COLOR_CHARS = new Set(['W', 'U', 'B', 'R', 'G'])
const SYMBOL_PATTERN = /\{([^}]+)\}/g

export function parseManaCost(cost: string): ManaSymbol[] {
  if (!cost) return []
  const symbols: ManaSymbol[] = []
  let match: RegExpExecArray | null

  SYMBOL_PATTERN.lastIndex = 0
  while ((match = SYMBOL_PATTERN.exec(cost)) !== null) {
    symbols.push(parseSymbol(match[1]))
  }

  return symbols
}

function parseSymbol(value: string): ManaSymbol {
  const upper = value.toUpperCase()

  // Tap/Untap
  if (upper === 'T') return { type: 'tap', value: 'T', colors: [], cmc: 0 }
  if (upper === 'Q') return { type: 'untap', value: 'Q', colors: [], cmc: 0 }

  // Snow
  if (upper === 'S') return { type: 'snow', value: 'S', colors: [], cmc: 1 }

  // Colorless (explicit)
  if (upper === 'C') return { type: 'colorless', value: 'C', colors: [], cmc: 1 }

  // X/Y/Z variable
  if (upper === 'X' || upper === 'Y' || upper === 'Z')
    return { type: 'x', value: upper, colors: [], cmc: 0 }

  // Generic mana (number)
  const num = parseInt(upper, 10)
  if (!isNaN(num)) return { type: 'generic', value: upper, colors: [], cmc: num }

  // Single color
  if (COLOR_CHARS.has(upper) && upper.length === 1)
    return { type: 'color', value: upper, colors: [upper as Color], cmc: 1 }

  // Hybrid mana (W/U, 2/W, W/P)
  if (upper.includes('/')) {
    const parts = upper.split('/')

    // Phyrexian (W/P, U/P, etc.)
    if (parts[1] === 'P' && COLOR_CHARS.has(parts[0]))
      return { type: 'phyrexian', value: upper, colors: [parts[0] as Color], cmc: 1 }

    // Hybrid generic (2/W, 2/U, etc.)
    const genericPart = parseInt(parts[0], 10)
    if (!isNaN(genericPart) && COLOR_CHARS.has(parts[1]))
      return { type: 'hybrid', value: upper, colors: [parts[1] as Color], cmc: genericPart }

    // Hybrid color (W/U, B/R, etc.)
    if (COLOR_CHARS.has(parts[0]) && COLOR_CHARS.has(parts[1]))
      return {
        type: 'hybrid',
        value: upper,
        colors: [parts[0] as Color, parts[1] as Color],
        cmc: 1,
      }
  }

  // Fallback
  return { type: 'generic', value, colors: [], cmc: 0 }
}

export function calculateCMC(cost: string): number {
  const symbols = parseManaCost(cost)
  return symbols.reduce((sum, s) => sum + s.cmc, 0)
}

export function getColorsFromManaCost(cost: string): Color[] {
  const symbols = parseManaCost(cost)
  const colors = new Set<Color>()
  for (const sym of symbols) {
    for (const c of sym.colors) {
      colors.add(c)
    }
  }
  // Sort in WUBRG order
  return (['W', 'U', 'B', 'R', 'G'] as Color[]).filter((c) => colors.has(c))
}

export function formatManaCost(symbols: ManaSymbol[]): string {
  return symbols.map((s) => `{${s.value}}`).join('')
}
