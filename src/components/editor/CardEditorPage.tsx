import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSetAtom } from 'jotai'
import { TabletLayout } from '../layout/TabletLayout.tsx'
import { PhoneEditorLayout } from '../layout/PhoneEditorLayout.tsx'
import { CardCanvas } from '../canvas/CardCanvas.tsx'
import { EditorPanel } from './EditorPanel.tsx'
import { useAppStore } from '../../stores/appStore.ts'
import { useCard } from '../../db/hooks/useCards.ts'
import { useAutoSave } from '../../hooks/useAutoSave.ts'
import { useBreakpoint } from '../../hooks/useBreakpoint.ts'
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
} from '../../stores/editorAtoms.ts'

export function CardEditorPage() {
  const { setId, cardId } = useParams<{ setId: string; cardId: string }>()
  const navigate = useNavigate()
  const card = useCard(cardId ?? null)
  const setCurrentSet = useAppStore((s) => s.setCurrentSet)
  const setCurrentCard = useAppStore((s) => s.setCurrentCard)
  const breakpoint = useBreakpoint()

  const setCardId = useSetAtom(cardIdAtom)
  const setCardName = useSetAtom(cardNameAtom)
  const setManaCost = useSetAtom(manaCostAtom)
  const setTypeLine = useSetAtom(typeLineAtom)
  const setSubtypeLine = useSetAtom(subtypeLineAtom)
  const setRulesText = useSetAtom(rulesTextAtom)
  const setFlavorText = useSetAtom(flavorTextAtom)
  const setPower = useSetAtom(powerAtom)
  const setToughness = useSetAtom(toughnessAtom)
  const setRarity = useSetAtom(rarityAtom)
  const setArtist = useSetAtom(artistAtom)
  const setArtworkId = useSetAtom(artworkIdAtom)
  const setArtPosition = useSetAtom(artPositionAtom)
  const setCollectorNumber = useSetAtom(collectorNumberAtom)

  useEffect(() => {
    if (setId) setCurrentSet(setId)
    if (cardId) setCurrentCard(cardId)
  }, [setId, cardId, setCurrentSet, setCurrentCard])

  // Load card data into atoms when card changes
  useEffect(() => {
    if (!card) return
    setCardId(card.id)
    setCardName(card.name)
    setManaCost(card.manaCost)
    setTypeLine(card.typeLine)
    setSubtypeLine(card.subtypeLine)
    setRulesText(card.rulesText)
    setFlavorText(card.flavorText)
    setPower(card.power ?? '')
    setToughness(card.toughness ?? '')
    setRarity(card.rarity)
    setArtist(card.artist)
    setArtworkId(card.artworkImageId)
    setArtPosition(card.artworkPosition)
    setCollectorNumber(card.collectorNumber)
  }, [
    card?.id, // Only reload when card ID changes, not on every field update
  ])

  useAutoSave()

  if (!setId || !cardId) {
    navigate('/sets')
    return null
  }

  const preview = <CardCanvas />
  const panel = <EditorPanel />

  if (breakpoint === 'phone') {
    return <PhoneEditorLayout preview={preview} panel={panel} />
  }

  return <TabletLayout preview={preview} panel={panel} />
}
