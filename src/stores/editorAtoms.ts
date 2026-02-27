import { atom } from 'jotai'
import type { Rarity } from '../types/enums.ts'
import type { ArtPosition } from '../types/card.ts'

export const cardIdAtom = atom<string | null>(null)
export const cardNameAtom = atom<string>('')
export const manaCostAtom = atom<string>('')
export const typeLineAtom = atom<string>('Creature')
export const subtypeLineAtom = atom<string>('')
export const rulesTextAtom = atom<string>('')
export const flavorTextAtom = atom<string>('')
export const powerAtom = atom<string>('')
export const toughnessAtom = atom<string>('')
export const loyaltyAtom = atom<string>('')
export const rarityAtom = atom<Rarity>('common')
export const artistAtom = atom<string>('')
export const artworkIdAtom = atom<string | null>(null)
export const artPositionAtom = atom<ArtPosition>({ x: 0, y: 0, scale: 1, rotation: 0 })
export const collectorNumberAtom = atom<string>('')

export const focusedFieldAtom = atom<string | null>(null)
export const isEditingAtom = atom<boolean>(false)
