import { useState, useEffect } from 'react'
import type { FrameKey } from '../engine/frameSelector.ts'
import { getFrameComponents } from '../engine/frameSelector.ts'
import { loadFrameImage, loadPTImage, getPTKey } from '../engine/frameImageLoader.ts'
import { compositeDualFrame } from '../engine/frameMasking.ts'

/**
 * Loads the real Card Conjurer M15 frame image for the given FrameKey.
 * For mono-color frames, loads a single PNG.
 * For dual-color frames, composites two PNGs with the mask system.
 *
 * Returns an HTMLImageElement (or null while loading).
 */
export function useFrameImage(frameKey: FrameKey): HTMLImageElement | null {
  const [image, setImage] = useState<HTMLImageElement | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const components = getFrameComponents(frameKey)

        if (components.length === 2) {
          // Dual-color: composite two frames with mask
          const canvas = await compositeDualFrame(components[0], components[1])
          if (cancelled) return
          // Convert canvas to Image for Konva
          const img = new Image()
          img.onload = () => {
            if (!cancelled) setImage(img)
          }
          img.src = canvas.toDataURL()
        } else {
          // Mono-color: load single PNG
          const img = await loadFrameImage(components[0])
          if (!cancelled) setImage(img)
        }
      } catch {
        // Frame failed to load — will use fallback rects
        if (!cancelled) setImage(null)
      }
    }

    load()
    return () => { cancelled = true }
  }, [frameKey])

  return image
}

/**
 * Loads the P/T box image for the given frame key.
 */
export function usePTImage(frameKey: FrameKey): HTMLImageElement | null {
  const [image, setImage] = useState<HTMLImageElement | null>(null)

  useEffect(() => {
    let cancelled = false
    const key = getPTKey(frameKey)
    loadPTImage(key)
      .then((img) => {
        if (!cancelled) setImage(img)
      })
      .catch(() => {
        if (!cancelled) setImage(null)
      })
    return () => { cancelled = true }
  }, [frameKey])

  return image
}
