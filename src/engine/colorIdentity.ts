import type { Color } from '../types/enums.ts'
import { getColorsFromManaCost } from './manaCost.ts'

const MANA_SYMBOL_IN_TEXT = /\{([WUBRGC])(?:\/[WUBRGCP])?\}/gi

export function deriveColors(manaCost: string): Color[] {
  return getColorsFromManaCost(manaCost)
}

export function deriveColorIdentity(manaCost: string, rulesText: string): Color[] {
  const colors = new Set<Color>(getColorsFromManaCost(manaCost))

  // Also scan rules text for mana symbols
  let match: RegExpExecArray | null
  MANA_SYMBOL_IN_TEXT.lastIndex = 0
  while ((match = MANA_SYMBOL_IN_TEXT.exec(rulesText)) !== null) {
    const c = match[1].toUpperCase()
    if (c === 'W' || c === 'U' || c === 'B' || c === 'R' || c === 'G') {
      colors.add(c)
    }
  }

  return (['W', 'U', 'B', 'R', 'G'] as Color[]).filter((c) => colors.has(c))
}
