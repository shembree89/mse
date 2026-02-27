import { useState, useEffect } from 'react'
import { db } from '../../db/database.ts'

interface SetSymbolProps {
  imageId: string | null
  size?: number
}

export function SetSymbol({ imageId, size = 20 }: SetSymbolProps) {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!imageId) {
      setUrl(null)
      return
    }
    let cancelled = false
    let objectUrl: string | null = null
    db.images.get(imageId).then((record) => {
      if (cancelled || !record) return
      objectUrl = URL.createObjectURL(record.thumbnailBlob ?? record.blob)
      setUrl(objectUrl)
    })
    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [imageId])

  if (!url) return null

  return (
    <img
      src={url}
      alt="Set symbol"
      style={{ width: size, height: size }}
      className="object-contain"
    />
  )
}
