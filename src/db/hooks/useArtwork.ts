import { useLiveQuery } from 'dexie-react-hooks'
import { v4 as uuid } from 'uuid'
import { db, type DBImage } from '../database.ts'

export function useImage(id: string | null) {
  return useLiveQuery(() => (id ? db.images.get(id) : undefined), [id])
}

export async function storeImage(
  file: File,
): Promise<{ id: string; width: number; height: number }> {
  const id = uuid()
  const blob = new Blob([await file.arrayBuffer()], { type: file.type })

  // Get dimensions
  const { width, height } = await getImageDimensions(blob)

  // Generate thumbnail (256px wide)
  const thumbnailBlob = await generateThumbnail(blob, 256)

  const record: DBImage = {
    id,
    blob,
    mimeType: file.type,
    width,
    height,
    thumbnailBlob,
    sourceFilename: file.name,
    createdAt: Date.now(),
  }

  await db.images.add(record)
  return { id, width, height }
}

export async function deleteImage(id: string) {
  await db.images.delete(id)
}

function getImageDimensions(blob: Blob): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
      URL.revokeObjectURL(url)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }
    img.src = url
  })
}

function generateThumbnail(blob: Blob, maxWidth: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.naturalWidth)
      const w = Math.round(img.naturalWidth * scale)
      const h = Math.round(img.naturalHeight * scale)

      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, w, h)

      canvas.toBlob(
        (thumbnailBlob) => {
          URL.revokeObjectURL(url)
          if (thumbnailBlob) resolve(thumbnailBlob)
          else reject(new Error('Thumbnail generation failed'))
        },
        'image/jpeg',
        0.8,
      )
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image for thumbnail'))
    }
    img.src = url
  })
}
