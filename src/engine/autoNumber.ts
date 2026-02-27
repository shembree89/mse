import type { Card } from '../types/card.ts'
import { COLOR_ORDER, type Color } from '../types/enums.ts'

/**
 * Sort cards in collector number order:
 * 1. White cards (by name)
 * 2. Blue cards (by name)
 * 3. Black cards (by name)
 * 4. Red cards (by name)
 * 5. Green cards (by name)
 * 6. Multicolor cards (by color count, then name)
 * 7. Colorless/Artifact cards (by name)
 * 8. Lands (by name)
 */
export function sortByCollectorNumber(cards: Card[]): Card[] {
  return [...cards].sort((a, b) => {
    const orderA = getColorSortOrder(a)
    const orderB = getColorSortOrder(b)
    if (orderA !== orderB) return orderA - orderB
    return a.name.localeCompare(b.name)
  })
}

function getColorSortOrder(card: Card): number {
  const isLand = card.types.includes('Land')
  if (isLand) return 800

  if (card.colors.length === 0) return 700 // Colorless/Artifact

  if (card.colors.length > 1) return 600 + card.colors.length // Multicolor

  // Mono-color: WUBRG order
  return COLOR_ORDER[card.colors[0] as Color] * 100
}

/**
 * Assign collector numbers to cards in collector order.
 * Format: "001/100", "002/100", etc.
 */
export function assignCollectorNumbers(cards: Card[], setCode: string): { id: string; collectorNumber: string }[] {
  const sorted = sortByCollectorNumber(cards)
  const total = sorted.length.toString()

  return sorted.map((card, i) => ({
    id: card.id,
    collectorNumber: `${(i + 1).toString().padStart(total.length, '0')}/${total}`,
  }))
}
