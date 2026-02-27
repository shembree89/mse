import { useCallback, useRef, useState } from 'react'
import { useAtom } from 'jotai'
import { artworkIdAtom, artPositionAtom } from '../../stores/editorAtoms.ts'
import { storeImage, deleteImage } from '../../db/hooks/useArtwork.ts'
import { ART_BOX } from '../../engine/cardLayout.ts'

export function ArtworkUploader() {
  const [artworkId, setArtworkId] = useAtom(artworkIdAtom)
  const [artPosition, setArtPosition] = useAtom(artPositionAtom)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) return

      // Delete old artwork if exists
      if (artworkId) {
        await deleteImage(artworkId)
      }

      const result = await storeImage(file)
      setArtworkId(result.id)

      // Auto-fit: load image to get dimensions, then calculate cover-fit
      const url = URL.createObjectURL(file)
      const img = new window.Image()
      img.onload = () => {
        const coverScale = Math.max(
          ART_BOX.width / img.naturalWidth,
          ART_BOX.height / img.naturalHeight,
        )
        const x = (ART_BOX.width - img.naturalWidth * coverScale) / 2
        const y = (ART_BOX.height - img.naturalHeight * coverScale) / 2
        setArtPosition({ x, y, scale: coverScale, rotation: 0 })
        URL.revokeObjectURL(url)
      }
      img.onerror = () => {
        setArtPosition({ x: 0, y: 0, scale: 1, rotation: 0 })
        URL.revokeObjectURL(url)
      }
      img.src = url
    },
    [artworkId, setArtworkId, setArtPosition],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  async function handleRemove() {
    if (artworkId) {
      await deleteImage(artworkId)
      setArtworkId(null)
    }
  }

  function handleZoom(e: React.ChangeEvent<HTMLInputElement>) {
    const newScale = parseFloat(e.target.value)
    setArtPosition((prev) => ({ ...prev, scale: newScale }))
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium text-text-secondary">Artwork</label>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`flex h-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
          isDragging
            ? 'border-accent bg-accent/10'
            : artworkId
              ? 'border-success/50 bg-success/5'
              : 'border-border bg-surface-2 hover:border-accent/50'
        }`}
      >
        {artworkId ? (
          <div className="flex items-center gap-2 text-sm text-success">
            <span>Artwork loaded — drag on card to reposition</span>
          </div>
        ) : (
          <span className="text-sm text-text-muted">
            Drop image or tap to upload
          </span>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
      {artworkId && (
        <div className="flex items-center gap-2">
          <label className="text-xs text-text-muted">Zoom</label>
          <input
            type="range"
            min={artPosition.scale * 0.5}
            max={artPosition.scale * 3}
            step={0.01}
            value={artPosition.scale}
            onChange={handleZoom}
            className="flex-1"
          />
          <button
            onClick={handleRemove}
            className="rounded px-2 py-1 text-xs text-danger hover:bg-danger/10"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  )
}
