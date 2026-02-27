import type { Color, Rarity } from './enums.ts'

export interface ArtPosition {
  x: number
  y: number
  scale: number
  rotation: number
}

export interface Card {
  id: string
  setId: string
  name: string
  manaCost: string
  colors: Color[]
  colorIdentity: Color[]
  typeLine: string
  subtypeLine: string
  supertypes: string[]
  types: string[]
  subtypes: string[]
  rulesText: string
  flavorText: string
  power: string | null
  toughness: string | null
  loyalty: string | null
  rarity: Rarity
  artist: string
  collectorNumber: string
  artworkImageId: string | null
  artworkPosition: ArtPosition
  templateId: string
  frameOverride: string | null
  customFields: Record<string, string>
  cmc: number
  sortOrder: number
  createdAt: number
  updatedAt: number
}

export function createDefaultCard(setId: string, sortOrder: number): Omit<Card, 'id'> {
  const now = Date.now()
  return {
    setId,
    name: '',
    manaCost: '',
    colors: [],
    colorIdentity: [],
    typeLine: 'Creature',
    subtypeLine: '',
    supertypes: [],
    types: ['Creature'],
    subtypes: [],
    rulesText: '',
    flavorText: '',
    power: null,
    toughness: null,
    loyalty: null,
    rarity: 'common',
    artist: '',
    collectorNumber: '',
    artworkImageId: null,
    artworkPosition: { x: 0, y: 0, scale: 1, rotation: 0 },
    templateId: 'mtg-m15',
    frameOverride: null,
    customFields: {},
    cmc: 0,
    sortOrder,
    createdAt: now,
    updatedAt: now,
  }
}
