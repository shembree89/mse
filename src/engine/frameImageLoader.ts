import type { FrameKey } from './frameSelector.ts'

/**
 * Frame image loader — loads real M15 card frame PNGs from Card Conjurer assets.
 * Source frames are 2010x2814 RGBA PNGs with transparency.
 */

const imageCache = new Map<string, HTMLImageElement>()
const loadingPromises = new Map<string, Promise<HTMLImageElement>>()

/** Map FrameKey to the PNG filename in /templates/m15/frames/ */
const FRAME_FILE_MAP: Record<string, string> = {
  white: 'm15FrameW.png',
  blue: 'm15FrameU.png',
  black: 'm15FrameB.png',
  red: 'm15FrameR.png',
  green: 'm15FrameG.png',
  gold: 'm15FrameM.png',
  artifact: 'm15FrameA.png',
  colorless: 'eldrazi.png',
  land: 'm15FrameL.png',
}

/** Map FrameKey to PT box PNG */
const PT_FILE_MAP: Record<string, string> = {
  white: 'm15PTW.png',
  blue: 'm15PTU.png',
  black: 'm15PTB.png',
  red: 'm15PTR.png',
  green: 'm15PTG.png',
  gold: 'm15PTM.png',
  artifact: 'm15PTA.png',
  colorless: 'm15PTA.png',
  land: 'm15PTA.png',
}

function loadImageByUrl(url: string): Promise<HTMLImageElement> {
  const cached = imageCache.get(url)
  if (cached) return Promise.resolve(cached)

  const loading = loadingPromises.get(url)
  if (loading) return loading

  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      imageCache.set(url, img)
      loadingPromises.delete(url)
      resolve(img)
    }
    img.onerror = () => {
      loadingPromises.delete(url)
      reject(new Error(`Failed to load: ${url}`))
    }
    img.crossOrigin = 'anonymous'
    img.src = url
  })

  loadingPromises.set(url, promise)
  return promise
}

/** Load a mono-color frame PNG. */
export function loadFrameImage(monoKey: string): Promise<HTMLImageElement> {
  const file = FRAME_FILE_MAP[monoKey]
  if (!file) return Promise.reject(new Error(`Unknown frame key: ${monoKey}`))
  return loadImageByUrl(`${import.meta.env.BASE_URL}templates/m15/frames/${file}`)
}

/** Load a P/T box PNG. */
export function loadPTImage(monoKey: string): Promise<HTMLImageElement> {
  const file = PT_FILE_MAP[monoKey] ?? 'm15PTA.png'
  return loadImageByUrl(`${import.meta.env.BASE_URL}templates/m15/pt/${file}`)
}

/** Load a mask PNG from /templates/m15/masks/. */
export function loadMaskImage(filename: string): Promise<HTMLImageElement> {
  return loadImageByUrl(`${import.meta.env.BASE_URL}templates/m15/masks/${filename}`)
}

/** Get a cached image (returns null if not loaded yet). */
export function getCachedImage(url: string): HTMLImageElement | null {
  return imageCache.get(url) ?? null
}

/** Get the mono-color key for a potentially dual FrameKey. */
export function getMonoFrameKeys(frameKey: FrameKey): [string] | [string, string] {
  if (frameKey.includes('-')) {
    const parts = frameKey.split('-')
    return [parts[0], parts[1]] as [string, string]
  }
  return [frameKey]
}

/** Get the first (or only) mono-color key for PT box selection. */
export function getPTKey(frameKey: FrameKey): string {
  if (frameKey.includes('-')) {
    return 'gold' // Dual-color cards use gold PT box
  }
  return frameKey
}

/** Preload all mono-color frames for fast switching. */
export function preloadFrameImages(): void {
  Object.keys(FRAME_FILE_MAP).forEach((key) => loadFrameImage(key).catch(() => {}))
}
