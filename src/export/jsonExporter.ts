import { db } from '../db/database.ts'

export async function exportSetAsJson(setId: string): Promise<Blob> {
  const set = await db.sets.get(setId)
  if (!set) throw new Error('Set not found')

  const cards = await db.cards.where('setId').equals(setId).sortBy('sortOrder')

  const data = {
    format: 'mse-pwa',
    version: 1,
    exportDate: new Date().toISOString(),
    set: {
      name: set.name,
      code: set.code,
      designer: set.designer,
      copyright: set.copyright,
      description: set.description,
    },
    cards: cards.map((c) => ({
      name: c.name,
      manaCost: c.manaCost,
      colors: c.colors,
      typeLine: c.typeLine,
      subtypeLine: c.subtypeLine,
      supertypes: c.supertypes,
      types: c.types,
      subtypes: c.subtypes,
      rulesText: c.rulesText,
      flavorText: c.flavorText,
      power: c.power,
      toughness: c.toughness,
      loyalty: c.loyalty,
      rarity: c.rarity,
      artist: c.artist,
      collectorNumber: c.collectorNumber,
      cmc: c.cmc,
    })),
  }

  return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
}
