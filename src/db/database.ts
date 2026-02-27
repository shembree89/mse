import Dexie, { type Table } from 'dexie'
import type { Card } from '../types/card.ts'
import type { CardSet } from '../types/set.ts'
import type { Keyword } from '../types/keyword.ts'

export interface DBImage {
  id: string
  blob: Blob
  mimeType: string
  width: number
  height: number
  thumbnailBlob: Blob | null
  sourceFilename: string
  createdAt: number
}

export interface DBPreferences {
  key: string
  value: unknown
}

class MSEDatabase extends Dexie {
  sets!: Table<CardSet>
  cards!: Table<Card>
  images!: Table<DBImage>
  keywords!: Table<Keyword>
  preferences!: Table<DBPreferences>

  constructor() {
    super('mse-pwa')

    this.version(1).stores({
      sets: 'id, name, code, updatedAt',
      cards: 'id, setId, name, [setId+sortOrder], [setId+name], rarity, cmc, *colors, *types',
      images: 'id, createdAt',
      keywords: 'id, [setId+name], name, isEvergreen',
      preferences: 'key',
    })
  }
}

export const db = new MSEDatabase()
