export interface CardSet {
  id: string
  name: string
  code: string
  designer: string
  copyright: string
  description: string
  symbolImageId: string | null
  createdAt: number
  updatedAt: number
  cardCount: number
}

export function createDefaultSet(): Omit<CardSet, 'id'> {
  const now = Date.now()
  return {
    name: 'Untitled Set',
    code: 'UNT',
    designer: '',
    copyright: '',
    description: '',
    symbolImageId: null,
    createdAt: now,
    updatedAt: now,
    cardCount: 0,
  }
}
