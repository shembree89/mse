import { useEffect, useRef } from 'react'
import { useAtomValue } from 'jotai'
import {
  cardIdAtom,
  cardNameAtom,
  manaCostAtom,
  typeLineAtom,
  subtypeLineAtom,
  rulesTextAtom,
  flavorTextAtom,
  powerAtom,
  toughnessAtom,
  rarityAtom,
  artistAtom,
  artworkIdAtom,
  artPositionAtom,
  collectorNumberAtom,
} from '../stores/editorAtoms.ts'
import { updateCard } from '../db/hooks/useCards.ts'

export function useAutoSave() {
  const cardId = useAtomValue(cardIdAtom)
  const cardName = useAtomValue(cardNameAtom)
  const manaCost = useAtomValue(manaCostAtom)
  const typeLine = useAtomValue(typeLineAtom)
  const subtypeLine = useAtomValue(subtypeLineAtom)
  const rulesText = useAtomValue(rulesTextAtom)
  const flavorText = useAtomValue(flavorTextAtom)
  const power = useAtomValue(powerAtom)
  const toughness = useAtomValue(toughnessAtom)
  const rarity = useAtomValue(rarityAtom)
  const artist = useAtomValue(artistAtom)
  const artworkId = useAtomValue(artworkIdAtom)
  const artPosition = useAtomValue(artPositionAtom)
  const collectorNumber = useAtomValue(collectorNumberAtom)

  const timerRef = useRef<ReturnType<typeof setTimeout>>()
  const initialLoadRef = useRef(true)

  useEffect(() => {
    // Skip auto-save on initial load (when card data is being loaded into atoms)
    if (initialLoadRef.current) {
      initialLoadRef.current = false
      return
    }
    if (!cardId) return

    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      updateCard(cardId, {
        name: cardName,
        manaCost,
        typeLine,
        subtypeLine,
        rulesText,
        flavorText,
        power: power || null,
        toughness: toughness || null,
        rarity,
        artist,
        artworkImageId: artworkId,
        artworkPosition: artPosition,
        collectorNumber,
      })
    }, 300)

    return () => clearTimeout(timerRef.current)
  }, [
    cardId,
    cardName,
    manaCost,
    typeLine,
    subtypeLine,
    rulesText,
    flavorText,
    power,
    toughness,
    rarity,
    artist,
    artworkId,
    artPosition,
    collectorNumber,
  ])

  // Reset initial load flag when card changes
  useEffect(() => {
    initialLoadRef.current = true
  }, [cardId])
}
