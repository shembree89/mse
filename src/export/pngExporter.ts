import Konva from 'konva'
import { db } from '../db/database.ts'
import type { Card } from '../types/card.ts'
import { deriveColors } from '../engine/colorIdentity.ts'
import { selectFrame, getFrameColors, getFrameComponents } from '../engine/frameSelector.ts'
import { parseManaCost, calculateCMC } from '../engine/manaCost.ts'
import { loadFrameImage, loadPTImage, getPTKey } from '../engine/frameImageLoader.ts'
import { compositeDualFrame } from '../engine/frameMasking.ts'
import { loadManaSymbol, manaSymbolToKey } from '../engine/manaSymbolLoader.ts'
import {
  CARD_WIDTH, CARD_HEIGHT,
  NAME_TEXT, MANA_SYMBOL, ART_BOX, TYPE_TEXT,
  RULES_TEXT, FLAVOR_Y_WITH_RULES, FLAVOR_Y_WITHOUT_RULES,
  PT_BOX, INFO_BAR,
} from '../engine/cardLayout.ts'

// MTG-accurate font families
const FONT_TITLE = '"Beleren", "Beleren2016", serif'
const FONT_BODY = '"MPlantin", "PlantinMTPro", serif'
const FONT_PT = '"Beleren", "Relay", sans-serif'
const FONT_INFO = '"Gotham", "Beleren SC", sans-serif'

export type DPIOption = 300 | 600 | 1200
const DPI_TO_PIXEL_RATIO: Record<DPIOption, number> = {
  300: 1,
  600: 2,
  1200: 4,
}

export async function exportCardAsPng(
  cardId: string,
  dpi: DPIOption = 300,
): Promise<Blob> {
  const card = await db.cards.get(cardId)
  if (!card) throw new Error('Card not found')

  let artImage: HTMLImageElement | null = null
  if (card.artworkImageId) {
    const imgRecord = await db.images.get(card.artworkImageId)
    if (imgRecord) {
      artImage = await loadImage(imgRecord.blob)
    }
  }

  const pixelRatio = DPI_TO_PIXEL_RATIO[dpi]
  const stage = await renderCardToStage(card, artImage)

  const dataUrl = stage.toDataURL({
    pixelRatio,
    mimeType: 'image/png',
  })

  stage.destroy()

  return dataURLToBlob(dataUrl)
}

export async function exportSetAsZip(
  setId: string,
  dpi: DPIOption = 300,
  onProgress?: (current: number, total: number) => void,
): Promise<Blob> {
  const { zipSync, strToU8 } = await import('fflate')
  const cards = await db.cards.where('setId').equals(setId).sortBy('sortOrder')
  const set = await db.sets.get(setId)
  const files: Record<string, Uint8Array> = {}

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i]
    const blob = await exportCardAsPng(card.id, dpi)
    const arrayBuffer = await blob.arrayBuffer()
    const num = (i + 1).toString().padStart(3, '0')
    const safeName = card.name.replace(/[^a-zA-Z0-9]/g, '_') || 'untitled'
    files[`${num}_${safeName}.png`] = new Uint8Array(arrayBuffer)
    onProgress?.(i + 1, cards.length)
  }

  const manifest = {
    setName: set?.name ?? 'Unknown',
    setCode: set?.code ?? 'UNK',
    cardCount: cards.length,
    dpi,
    exportDate: new Date().toISOString(),
    cards: cards.map((c, i) => ({
      number: i + 1,
      name: c.name,
      type: c.typeLine,
      rarity: c.rarity,
    })),
  }
  files['manifest.json'] = strToU8(JSON.stringify(manifest, null, 2))

  const zipData = zipSync(files)
  return new Blob([zipData], { type: 'application/zip' })
}

async function renderCardToStage(card: Card, artImage: HTMLImageElement | null): Promise<Konva.Stage> {
  const container = document.createElement('div')
  container.style.position = 'absolute'
  container.style.left = '-9999px'
  document.body.appendChild(container)

  const stage = new Konva.Stage({
    container,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  })

  const layer = new Konva.Layer()
  stage.add(layer)

  const colors = deriveColors(card.manaCost)
  const frameKey = selectFrame(colors, card.types)
  const fc = getFrameColors(frameKey)
  const manaSymbols = parseManaCost(card.manaCost)
  const cmc = calculateCMC(card.manaCost)
  const fullTypeLine = card.subtypeLine
    ? `${card.typeLine} \u2014 ${card.subtypeLine}`
    : card.typeLine
  const hasPT = card.power !== null || card.toughness !== null
  const ptText = hasPT ? `${card.power ?? '0'}/${card.toughness ?? '0'}` : ''

  // --- Frame image (real Card Conjurer PNG) ---
  try {
    const components = getFrameComponents(frameKey)
    let frameImg: HTMLImageElement

    if (components.length === 2) {
      const canvas = await compositeDualFrame(components[0], components[1])
      frameImg = await canvasToImage(canvas)
    } else {
      frameImg = await loadFrameImage(components[0])
    }

    layer.add(new Konva.Image({ image: frameImg, x: 0, y: 0, width: CARD_WIDTH, height: CARD_HEIGHT }))
  } catch {
    // Fallback: solid color
    layer.add(new Konva.Rect({ x: 0, y: 0, width: CARD_WIDTH, height: CARD_HEIGHT, cornerRadius: 30, fill: '#111' }))
    layer.add(new Konva.Rect({ x: 4, y: 4, width: CARD_WIDTH - 8, height: CARD_HEIGHT - 8, cornerRadius: 27, fill: fc.primary }))
  }

  // --- Card name ---
  const totalManaWidth = manaSymbols.length > 0
    ? (manaSymbols.length - 1) * MANA_SYMBOL.step + MANA_SYMBOL.size
    : 0

  layer.add(new Konva.Text({
    x: NAME_TEXT.x, y: NAME_TEXT.y, width: NAME_TEXT.width - totalManaWidth - 20, height: NAME_TEXT.height,
    text: card.name || 'Untitled', fontFamily: FONT_TITLE, fontSize: NAME_TEXT.fontSize,
    fontStyle: 'bold', fill: fc.text, verticalAlign: 'middle',
  }))

  // --- Mana symbols (composited colored circles with glyph) ---
  const manaStartX = MANA_SYMBOL.rightEdge - totalManaWidth + MANA_SYMBOL.size / 2
  for (let i = 0; i < manaSymbols.length; i++) {
    const sym = manaSymbols[i]
    const x = manaStartX + i * MANA_SYMBOL.step
    const y = MANA_SYMBOL.y

    try {
      const key = manaSymbolToKey(sym)
      const manaImg = await loadManaSymbol(key, sym)
      layer.add(new Konva.Image({ image: manaImg, x, y, width: MANA_SYMBOL.size, height: MANA_SYMBOL.size }))
    } catch {
      layer.add(new Konva.Rect({
        x, y, width: MANA_SYMBOL.size, height: MANA_SYMBOL.size,
        cornerRadius: MANA_SYMBOL.size / 2, fill: '#cbc4bd', stroke: '#999', strokeWidth: 1,
      }))
    }
  }

  // --- Art box ---
  const artGroup = new Konva.Group({ clipX: ART_BOX.x, clipY: ART_BOX.y, clipWidth: ART_BOX.width, clipHeight: ART_BOX.height })
  if (artImage) {
    artGroup.add(new Konva.Image({
      image: artImage,
      x: ART_BOX.x + (card.artworkPosition?.x ?? 0),
      y: ART_BOX.y + (card.artworkPosition?.y ?? 0),
      scaleX: card.artworkPosition?.scale ?? 1,
      scaleY: card.artworkPosition?.scale ?? 1,
      width: artImage.naturalWidth,
      height: artImage.naturalHeight,
    }))
  }
  layer.add(artGroup)

  // --- Type line ---
  layer.add(new Konva.Text({
    x: TYPE_TEXT.x, y: TYPE_TEXT.y, width: TYPE_TEXT.width - 60, height: TYPE_TEXT.height,
    text: fullTypeLine, fontFamily: FONT_TITLE, fontSize: TYPE_TEXT.fontSize,
    fontStyle: 'bold', fill: fc.text, verticalAlign: 'middle',
  }))

  // --- Rules text ---
  if (card.rulesText) {
    layer.add(new Konva.Text({
      x: RULES_TEXT.x, y: RULES_TEXT.y, width: RULES_TEXT.width, height: RULES_TEXT.height,
      text: card.rulesText, fontFamily: FONT_BODY, fontSize: RULES_TEXT.fontSize,
      lineHeight: 1.35, fill: '#1a1a1a', wrap: 'word',
    }))
  }

  // --- Flavor text ---
  if (card.flavorText) {
    layer.add(new Konva.Text({
      x: RULES_TEXT.x, y: card.rulesText ? FLAVOR_Y_WITH_RULES : FLAVOR_Y_WITHOUT_RULES,
      width: RULES_TEXT.width, height: 80,
      text: card.flavorText, fontFamily: FONT_BODY, fontSize: 26,
      fontStyle: 'italic', lineHeight: 1.25, fill: '#444', wrap: 'word',
    }))
  }

  // --- P/T box ---
  if (hasPT) {
    try {
      const ptImg = await loadPTImage(getPTKey(frameKey))
      layer.add(new Konva.Image({
        image: ptImg, x: PT_BOX.x, y: PT_BOX.y, width: PT_BOX.width, height: PT_BOX.height,
      }))
    } catch {
      layer.add(new Konva.Rect({
        x: PT_BOX.x, y: PT_BOX.y, width: PT_BOX.width, height: PT_BOX.height,
        cornerRadius: PT_BOX.radius, fill: fc.primary, stroke: fc.secondary, strokeWidth: 1.5,
      }))
    }
    layer.add(new Konva.Text({
      x: PT_BOX.textX, y: PT_BOX.textY, width: PT_BOX.textWidth, height: PT_BOX.textHeight,
      text: ptText, fontFamily: FONT_PT, fontSize: PT_BOX.fontSize,
      fontStyle: 'bold', fill: fc.text, align: 'center', verticalAlign: 'middle',
    }))
  }

  // --- Info bar ---
  layer.add(new Konva.Text({
    x: INFO_BAR.x, y: INFO_BAR.y, width: INFO_BAR.width, height: 20,
    text: `${cmc > 0 ? `CMC: ${cmc} \u2022 ` : ''}${card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1)}`,
    fontFamily: FONT_INFO, fontSize: INFO_BAR.fontSize, fill: '#fff', opacity: 0.7,
  }))

  layer.draw()
  document.body.removeChild(container)

  return stage
}

function canvasToImage(canvas: HTMLCanvasElement): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = canvas.toDataURL()
  })
}

function loadImage(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.onload = () => {
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }
    img.src = url
  })
}

function dataURLToBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(',')
  const mime = parts[0].match(/:(.*?);/)![1]
  const bstr = atob(parts[1])
  const u8arr = new Uint8Array(bstr.length)
  for (let i = 0; i < bstr.length; i++) u8arr[i] = bstr.charCodeAt(i)
  return new Blob([u8arr], { type: mime })
}
