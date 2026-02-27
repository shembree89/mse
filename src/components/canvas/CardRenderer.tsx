import { Rect, Text, Group, Line, Image as KonvaImage } from 'react-konva'
import { useAtomValue, useSetAtom } from 'jotai'
import { useMemo, useState, useEffect, useCallback } from 'react'
import {
  cardNameAtom,
  manaCostAtom,
  typeLineAtom,
  subtypeLineAtom,
  rulesTextAtom,
  flavorTextAtom,
  powerAtom,
  toughnessAtom,
  rarityAtom,
  artworkIdAtom,
  artPositionAtom,
} from '../../stores/editorAtoms.ts'
import { deriveColors } from '../../engine/colorIdentity.ts'
import { selectFrame, getFrameColors } from '../../engine/frameSelector.ts'
import { parseManaCost, calculateCMC } from '../../engine/manaCost.ts'
import { db } from '../../db/database.ts'
import { useFrameImage, usePTImage } from '../../hooks/useFrameImage.ts'
import { useManaSymbolImages } from '../../hooks/useManaSymbolImages.ts'
import {
  MANA_SYMBOL,
  NAME_TEXT,
  ART_BOX,
  TYPE_TEXT,
  RARITY_SYMBOL,
  TEXT_BOX,
  TEXT_BOX_HEIGHT_WITH_PT,
  TEXT_BOX_HEIGHT_NO_PT,
  RULES_TEXT,
  FLAVOR_SEPARATOR_Y,
  FLAVOR_TEXT,
  FLAVOR_Y_WITH_RULES,
  FLAVOR_Y_WITHOUT_RULES,
  PT_BOX,
  INFO_BAR,
} from '../../engine/cardLayout.ts'

interface CardRendererProps {
  width: number
  height: number
}

// MTG-accurate font families
const FONT_TITLE = '"Beleren", "Beleren2016", serif'
const FONT_BODY = '"MPlantin", "PlantinMTPro", serif'
const FONT_PT = '"Beleren", "Relay", sans-serif'
const FONT_INFO = '"Gotham", "Beleren SC", sans-serif'

export function CardRenderer({ width, height }: CardRendererProps) {
  const cardName = useAtomValue(cardNameAtom)
  const manaCost = useAtomValue(manaCostAtom)
  const typeLine = useAtomValue(typeLineAtom)
  const subtypeLine = useAtomValue(subtypeLineAtom)
  const rulesText = useAtomValue(rulesTextAtom)
  const flavorText = useAtomValue(flavorTextAtom)
  const power = useAtomValue(powerAtom)
  const toughness = useAtomValue(toughnessAtom)
  const rarity = useAtomValue(rarityAtom)
  const artworkId = useAtomValue(artworkIdAtom)
  const artPosition = useAtomValue(artPositionAtom)
  const setArtPosition = useSetAtom(artPositionAtom)
  const [artImage, setArtImage] = useState<HTMLImageElement | null>(null)

  // Load artwork from IndexedDB
  useEffect(() => {
    if (!artworkId) {
      setArtImage(null)
      return
    }
    let cancelled = false
    db.images.get(artworkId).then((record) => {
      if (cancelled || !record) return
      const url = URL.createObjectURL(record.blob)
      const img = new window.Image()
      img.onload = () => {
        if (!cancelled) setArtImage(img)
      }
      img.src = url
      return () => URL.revokeObjectURL(url)
    })
    return () => { cancelled = true }
  }, [artworkId])

  const colors = useMemo(() => deriveColors(manaCost), [manaCost])
  const frameKey = useMemo(() => selectFrame(colors, typeLine.split(' ')), [colors, typeLine])
  const frameColors = useMemo(() => getFrameColors(frameKey), [frameKey])
  const manaSymbols = useMemo(() => parseManaCost(manaCost), [manaCost])
  const cmc = useMemo(() => calculateCMC(manaCost), [manaCost])

  // Real Card Conjurer frame image (async-loaded PNG)
  const frameImage = useFrameImage(frameKey)
  const ptImage = usePTImage(frameKey)

  // Fully composited mana symbol images (colored circle + glyph)
  const manaImages = useManaSymbolImages(manaSymbols)

  const fullTypeLine = subtypeLine ? `${typeLine} \u2014 ${subtypeLine}` : typeLine
  const hasPT = power !== '' || toughness !== ''
  const ptText = hasPT ? `${power || '0'}/${toughness || '0'}` : ''

  // Mana symbol layout — positioned from right edge
  const manaSymbolSize = MANA_SYMBOL.size
  const manaStep = MANA_SYMBOL.step
  const totalManaWidth = manaSymbols.length > 0
    ? (manaSymbols.length - 1) * manaStep + manaSymbolSize
    : 0
  const manaStartX = MANA_SYMBOL.rightEdge - totalManaWidth + manaSymbolSize / 2

  // Handle art drag
  const handleArtDragEnd = useCallback((e: any) => {
    const node = e.target
    setArtPosition((prev) => ({
      ...prev,
      x: node.x() - ART_BOX.x,
      y: node.y() - ART_BOX.y,
    }))
  }, [setArtPosition])

  return (
    <Group>
      {/* Full frame image — real M15 PNG from Card Conjurer */}
      {frameImage ? (
        <KonvaImage image={frameImage} x={0} y={0} width={width} height={height} />
      ) : (
        <>
          {/* Fallback: solid color frame while PNG loads */}
          <Rect x={0} y={0} width={width} height={height} cornerRadius={30} fill="#111" />
          <Rect x={4} y={4} width={width - 8} height={height - 8} cornerRadius={27} fill={frameColors.primary} />
        </>
      )}

      {/* Card name */}
      <Text
        x={NAME_TEXT.x}
        y={NAME_TEXT.y}
        width={NAME_TEXT.width - totalManaWidth - 20}
        height={NAME_TEXT.height}
        text={cardName || 'Card Name'}
        fontFamily={FONT_TITLE}
        fontSize={NAME_TEXT.fontSize}
        fontStyle="bold"
        fill={cardName ? frameColors.text : frameColors.text + '66'}
        verticalAlign="middle"
        ellipsis
        wrap="none"
      />

      {/* Mana cost symbols — composited colored circles with glyph */}
      {manaSymbols.map((sym, i) => {
        const x = manaStartX + i * manaStep
        const y = MANA_SYMBOL.y
        const img = manaImages.get(i)

        if (img) {
          return (
            <KonvaImage
              key={i}
              image={img}
              x={x}
              y={y}
              width={manaSymbolSize}
              height={manaSymbolSize}
            />
          )
        }

        // Fallback: simple gray circle while composited image loads
        return (
          <Rect
            key={i}
            x={x}
            y={y}
            width={manaSymbolSize}
            height={manaSymbolSize}
            cornerRadius={manaSymbolSize / 2}
            fill="#cbc4bd"
            stroke="#999"
            strokeWidth={1}
          />
        )
      })}

      {/* Art box — clipped region for artwork */}
      <Group
        clipX={ART_BOX.x}
        clipY={ART_BOX.y}
        clipWidth={ART_BOX.width}
        clipHeight={ART_BOX.height}
      >
        {artImage ? (
          <KonvaImage
            image={artImage}
            x={ART_BOX.x + artPosition.x}
            y={ART_BOX.y + artPosition.y}
            scaleX={artPosition.scale}
            scaleY={artPosition.scale}
            width={artImage.naturalWidth}
            height={artImage.naturalHeight}
            draggable
            onDragEnd={handleArtDragEnd}
          />
        ) : (
          <Text
            x={ART_BOX.x}
            y={ART_BOX.y + ART_BOX.height / 2 - 10}
            width={ART_BOX.width}
            text="Tap to add artwork"
            fontFamily="sans-serif"
            fontSize={18}
            fill="#555"
            align="center"
          />
        )}
      </Group>

      {/* Type line text */}
      <Text
        x={TYPE_TEXT.x}
        y={TYPE_TEXT.y}
        width={TYPE_TEXT.width - RARITY_SYMBOL.size - 20}
        height={TYPE_TEXT.height}
        text={fullTypeLine || 'Card Type'}
        fontFamily={FONT_TITLE}
        fontSize={TYPE_TEXT.fontSize}
        fontStyle="bold"
        fill={typeLine ? frameColors.text : frameColors.text + '66'}
        verticalAlign="middle"
        ellipsis
        wrap="none"
      />

      {/* Rarity symbol */}
      <Rect
        x={RARITY_SYMBOL.x}
        y={RARITY_SYMBOL.y}
        width={RARITY_SYMBOL.size}
        height={RARITY_SYMBOL.size}
        cornerRadius={3}
        fill={
          rarity === 'mythic' ? '#d44'
          : rarity === 'rare' ? '#da4'
          : rarity === 'uncommon' ? '#aac'
          : '#666'
        }
      />

      {/* Rules text */}
      {rulesText && (
        <Text
          x={RULES_TEXT.x}
          y={RULES_TEXT.y}
          width={RULES_TEXT.width}
          height={RULES_TEXT.height}
          text={rulesText}
          fontFamily={FONT_BODY}
          fontSize={RULES_TEXT.fontSize}
          lineHeight={1.35}
          fill="#1a1a1a"
          wrap="word"
        />
      )}

      {/* Flavor text separator */}
      {flavorText && rulesText && (
        <Line
          points={[width / 2 - 100, FLAVOR_SEPARATOR_Y, width / 2 + 100, FLAVOR_SEPARATOR_Y]}
          stroke="#999"
          strokeWidth={0.5}
        />
      )}

      {/* Flavor text */}
      {flavorText && (
        <Text
          x={FLAVOR_TEXT.x}
          y={rulesText ? FLAVOR_Y_WITH_RULES : FLAVOR_Y_WITHOUT_RULES}
          width={FLAVOR_TEXT.width}
          height={FLAVOR_TEXT.height}
          text={flavorText}
          fontFamily={FONT_BODY}
          fontSize={FLAVOR_TEXT.fontSize}
          fontStyle="italic"
          lineHeight={1.25}
          fill="#444"
          wrap="word"
        />
      )}

      {/* P/T box — real Card Conjurer PT image */}
      {hasPT && (
        <Group>
          {ptImage ? (
            <KonvaImage
              image={ptImage}
              x={PT_BOX.x}
              y={PT_BOX.y}
              width={PT_BOX.width}
              height={PT_BOX.height}
            />
          ) : (
            <Rect
              x={PT_BOX.x}
              y={PT_BOX.y}
              width={PT_BOX.width}
              height={PT_BOX.height}
              cornerRadius={PT_BOX.radius}
              fill={frameColors.primary}
              stroke={frameColors.secondary}
              strokeWidth={1.5}
            />
          )}
          <Text
            x={PT_BOX.textX}
            y={PT_BOX.textY}
            width={PT_BOX.textWidth}
            height={PT_BOX.textHeight}
            text={ptText}
            fontFamily={FONT_PT}
            fontSize={PT_BOX.fontSize}
            fontStyle="bold"
            fill={frameColors.text}
            align="center"
            verticalAlign="middle"
          />
        </Group>
      )}

      {/* Bottom info / collector bar */}
      <Text
        x={INFO_BAR.x}
        y={INFO_BAR.y}
        width={INFO_BAR.width}
        height={20}
        text={`${cmc > 0 ? `CMC: ${cmc} \u2022 ` : ''}${rarity.charAt(0).toUpperCase() + rarity.slice(1)}`}
        fontFamily={FONT_INFO}
        fontSize={INFO_BAR.fontSize}
        fill="#fff"
        opacity={0.7}
      />
    </Group>
  )
}
