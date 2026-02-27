import { useState, useEffect } from 'react'
import type { ManaSymbol } from '../engine/manaCost.ts'
import { loadManaSymbol, manaSymbolToKey } from '../engine/manaSymbolLoader.ts'

/**
 * React hook that loads fully composited mana symbol images (colored circle + glyph)
 * for a given ManaSymbol[] array. Returns a Map<index, HTMLImageElement>.
 */
export function useManaSymbolImages(symbols: ManaSymbol[]): Map<number, HTMLImageElement> {
  const [images, setImages] = useState<Map<number, HTMLImageElement>>(new Map())

  useEffect(() => {
    if (symbols.length === 0) {
      setImages(new Map())
      return
    }

    let cancelled = false
    const result = new Map<number, HTMLImageElement>()

    const promises = symbols.map((sym, i) => {
      const key = manaSymbolToKey(sym)
      return loadManaSymbol(key, sym)
        .then((img) => {
          if (!cancelled) {
            result.set(i, img)
          }
        })
        .catch(() => {
          // Symbol failed to load — fallback will be used
        })
    })

    Promise.all(promises).then(() => {
      if (!cancelled) {
        setImages(new Map(result))
      }
    })

    return () => {
      cancelled = true
    }
  }, [symbols.map((s) => `${s.type}:${s.value}`).join(',')])

  return images
}
