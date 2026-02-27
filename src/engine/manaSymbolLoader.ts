// Mana symbol image loader — composites colored circle + SVG glyph
import type { ManaSymbol } from './manaCost.ts'

// Cache for fully composited mana symbol images (circle + glyph)
const compositeCache = new Map<string, HTMLImageElement>()
const compositeLoading = new Map<string, Promise<HTMLImageElement>>()

// Cache for raw SVG glyph images
const glyphCache = new Map<string, HTMLImageElement>()
const glyphLoading = new Map<string, Promise<HTMLImageElement>>()

// Mana symbol background colors (matching real MTG cards)
const MANA_BG_COLORS: Record<string, string> = {
  W: '#f9f5d7',
  U: '#c1e3f5',
  B: '#a8a49d',
  R: '#f4a587',
  G: '#9bd3ae',
  C: '#cbc4bd',
  S: '#e0eff5',
}

const GENERIC_BG = '#cbc4bd'
const GLYPH_COLOR = '#1a1a1a'
const CANVAS_SIZE = 128

export function getSymbolPath(symbol: string): string {
  return `${import.meta.env.BASE_URL}mana-symbols/${symbol.toLowerCase()}.svg`
}

/**
 * Convert a parsed ManaSymbol to the file key used for loading.
 */
export function manaSymbolToKey(sym: { type: string; value: string; colors: string[] }): string {
  switch (sym.type) {
    case 'color':
    case 'colorless':
    case 'snow':
      return sym.value.toLowerCase()
    case 'generic':
      return sym.value
    case 'x':
      return 'x'
    case 'tap':
      return 't'
    case 'untap':
      return 'untap'
    case 'phyrexian':
      return `${sym.colors[0]?.toLowerCase() ?? 'c'}p`
    case 'hybrid':
      return `${sym.colors[0]?.toLowerCase() ?? ''}${sym.colors[1]?.toLowerCase() ?? ''}`
    default:
      return sym.value.toLowerCase()
  }
}

function getBackgroundColor(sym: ManaSymbol): string {
  if (sym.type === 'color' && sym.colors.length > 0) {
    return MANA_BG_COLORS[sym.colors[0]] ?? GENERIC_BG
  }
  if (sym.type === 'colorless') return MANA_BG_COLORS.C
  if (sym.type === 'snow') return MANA_BG_COLORS.S
  if (sym.type === 'phyrexian' && sym.colors.length > 0) {
    return MANA_BG_COLORS[sym.colors[0]] ?? GENERIC_BG
  }
  if (sym.type === 'hybrid' && sym.colors.length > 0) {
    return MANA_BG_COLORS[sym.colors[0]] ?? GENERIC_BG
  }
  return GENERIC_BG
}

function loadGlyphSvg(key: string): Promise<HTMLImageElement> {
  const cached = glyphCache.get(key)
  if (cached) return Promise.resolve(cached)

  const loading = glyphLoading.get(key)
  if (loading) return loading

  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    // Fetch SVG text so we can recolor the glyph
    fetch(getSymbolPath(key))
      .then((r) => r.text())
      .then((svgText) => {
        // Replace the fill color with dark glyph color
        const recolored = svgText.replace(/fill="#[0-9a-fA-F]+"/g, `fill="${GLYPH_COLOR}"`)
        const blob = new Blob([recolored], { type: 'image/svg+xml' })
        const url = URL.createObjectURL(blob)
        const img = new Image()
        img.onload = () => {
          URL.revokeObjectURL(url)
          glyphCache.set(key, img)
          glyphLoading.delete(key)
          resolve(img)
        }
        img.onerror = () => {
          URL.revokeObjectURL(url)
          glyphLoading.delete(key)
          reject(new Error(`Failed to load glyph: ${key}`))
        }
        img.src = url
      })
      .catch((err) => {
        glyphLoading.delete(key)
        reject(err)
      })
  })

  glyphLoading.set(key, promise)
  return promise
}

/**
 * Load a fully composited mana symbol image (colored circle + glyph).
 */
export function loadManaSymbol(key: string, sym?: ManaSymbol): Promise<HTMLImageElement> {
  const cacheKey = sym ? `${key}:${sym.type}:${sym.colors.join('')}` : key

  const cached = compositeCache.get(cacheKey)
  if (cached) return Promise.resolve(cached)

  const loading = compositeLoading.get(cacheKey)
  if (loading) return loading

  const bgColor = sym ? getBackgroundColor(sym) : GENERIC_BG

  const promise = loadGlyphSvg(key)
    .then((glyph) => compositeSymbol(glyph, bgColor))
    .then((img) => {
      compositeCache.set(cacheKey, img)
      compositeLoading.delete(cacheKey)
      return img
    })
    .catch((err) => {
      compositeLoading.delete(cacheKey)
      throw err
    })

  compositeLoading.set(cacheKey, promise)
  return promise
}

/**
 * Parse hex color to {r,g,b} values.
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const n = parseInt(hex.replace('#', ''), 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

function compositeSymbol(glyph: HTMLImageElement, bgColor: string): Promise<HTMLImageElement> {
  // Extra padding for drop shadow
  const PAD = 8
  const TOTAL = CANVAS_SIZE + PAD * 2
  const canvas = document.createElement('canvas')
  canvas.width = TOTAL
  canvas.height = TOTAL
  const ctx = canvas.getContext('2d')!

  const cx = TOTAL / 2
  const cy = TOTAL / 2
  const radius = CANVAS_SIZE / 2 - 2

  // Drop shadow — hard-edged offset shadow like a raised coin
  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,0.55)'
  ctx.shadowBlur = 3
  ctx.shadowOffsetX = -2
  ctx.shadowOffsetY = 3
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.fillStyle = bgColor
  ctx.fill()
  ctx.restore()

  // Radial gradient — lighter top-left highlight, darker bottom-right shadow
  const { r, g, b } = hexToRgb(bgColor)
  const highlight = `rgba(${Math.min(r + 30, 255)},${Math.min(g + 30, 255)},${Math.min(b + 30, 255)},1)`
  const shadow = `rgba(${Math.max(r - 40, 0)},${Math.max(g - 40, 0)},${Math.max(b - 40, 0)},1)`
  const grad = ctx.createRadialGradient(
    cx - radius * 0.3, cy - radius * 0.3, radius * 0.1,  // highlight center (upper-left)
    cx, cy, radius,                                        // circle edge
  )
  grad.addColorStop(0, highlight)
  grad.addColorStop(0.7, bgColor)
  grad.addColorStop(1, shadow)

  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.fillStyle = grad
  ctx.fill()

  // Dark border for definition
  ctx.strokeStyle = 'rgba(0,0,0,0.4)'
  ctx.lineWidth = 2.5
  ctx.stroke()

  // Inner edge highlight (subtle bevel — thin bright arc on top-left)
  ctx.beginPath()
  ctx.arc(cx, cy, radius - 2, -Math.PI * 0.75, -Math.PI * 0.1)
  ctx.strokeStyle = 'rgba(255,255,255,0.25)'
  ctx.lineWidth = 1.5
  ctx.stroke()

  // Draw glyph centered, slightly smaller than the circle
  const glyphSize = CANVAS_SIZE * 0.68
  const glyphX = (TOTAL - glyphSize) / 2
  const glyphY = (TOTAL - glyphSize) / 2
  ctx.drawImage(glyph, glyphX, glyphY, glyphSize, glyphSize)

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = canvas.toDataURL()
  })
}

const COMMON_SYMBOLS: Array<{ key: string; sym: ManaSymbol }> = [
  { key: 'w', sym: { type: 'color', value: 'W', colors: ['W' as any], cmc: 1 } },
  { key: 'u', sym: { type: 'color', value: 'U', colors: ['U' as any], cmc: 1 } },
  { key: 'b', sym: { type: 'color', value: 'B', colors: ['B' as any], cmc: 1 } },
  { key: 'r', sym: { type: 'color', value: 'R', colors: ['R' as any], cmc: 1 } },
  { key: 'g', sym: { type: 'color', value: 'G', colors: ['G' as any], cmc: 1 } },
  { key: 'c', sym: { type: 'colorless', value: 'C', colors: [], cmc: 1 } },
  ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => ({
    key: String(n),
    sym: { type: 'generic' as const, value: String(n), colors: [] as any[], cmc: n },
  })),
  { key: 'x', sym: { type: 'x', value: 'X', colors: [] as any[], cmc: 0 } },
]

export function preloadCommonSymbols(): void {
  COMMON_SYMBOLS.forEach(({ key, sym }) => loadManaSymbol(key, sym).catch(() => {}))
}
