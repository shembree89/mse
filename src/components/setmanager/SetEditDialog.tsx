import { useState, useEffect, useRef } from 'react'
import { useSet, updateSet } from '../../db/hooks/useSets.ts'
import { storeImage } from '../../db/hooks/useArtwork.ts'
import { db } from '../../db/database.ts'

interface SetEditDialogProps {
  setId: string
  onClose: () => void
}

export function SetEditDialog({ setId, onClose }: SetEditDialogProps) {
  const set = useSet(setId)
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [designer, setDesigner] = useState('')
  const [copyright, setCopyright] = useState('')
  const [symbolPreview, setSymbolPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)

  // Initialize form from set data
  useEffect(() => {
    if (!set) return
    setName(set.name)
    setCode(set.code)
    setDesigner(set.designer)
    setCopyright(set.copyright)
  }, [set?.id])

  // Load symbol preview
  useEffect(() => {
    if (!set?.symbolImageId) {
      setSymbolPreview(null)
      return
    }
    let cancelled = false
    db.images.get(set.symbolImageId).then((record) => {
      if (cancelled || !record) return
      const url = URL.createObjectURL(record.blob)
      setSymbolPreview(url)
      return () => URL.revokeObjectURL(url)
    })
    return () => { cancelled = true }
  }, [set?.symbolImageId])

  if (!set) return null

  async function handleSave() {
    const trimmedCode = code.trim().toUpperCase()
    if (trimmedCode.length < 2 || trimmedCode.length > 5) return
    await updateSet(setId, {
      name: name.trim() || 'Untitled Set',
      code: trimmedCode || 'UNT',
      designer: designer.trim(),
      copyright: copyright.trim(),
    })
    onClose()
  }

  async function handleSymbolUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const { id } = await storeImage(file)
    await updateSet(setId, { symbolImageId: id })
  }

  function handleSymbolRemove() {
    updateSet(setId, { symbolImageId: null })
    setSymbolPreview(null)
  }

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === backdropRef.current) onClose()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') onClose()
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSave()
  }

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div className="w-full max-w-md rounded-xl bg-surface-1 shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold text-text-primary">Edit Set</h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-text-muted hover:bg-surface-2 hover:text-text-primary"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4 p-5">
          {/* Set Name */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-text-secondary">Set Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Untitled Set"
              className="rounded-lg border border-border bg-surface-0 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
              autoFocus
            />
          </div>

          {/* Set Code */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-text-secondary">Set Code (2-5 characters)</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 5))}
              placeholder="UNT"
              maxLength={5}
              className="w-24 rounded-lg border border-border bg-surface-0 px-3 py-2 text-sm font-mono text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none uppercase"
            />
          </div>

          {/* Designer */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-text-secondary">Designer</label>
            <input
              type="text"
              value={designer}
              onChange={(e) => setDesigner(e.target.value)}
              placeholder="Card designer name"
              className="rounded-lg border border-border bg-surface-0 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
            />
          </div>

          {/* Copyright */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-text-secondary">Copyright</label>
            <input
              type="text"
              value={copyright}
              onChange={(e) => setCopyright(e.target.value)}
              placeholder="© 2026 Your Name"
              className="rounded-lg border border-border bg-surface-0 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
            />
          </div>

          {/* Set Symbol */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-text-secondary">Set Symbol</label>
            <div className="flex items-center gap-3">
              {symbolPreview ? (
                <div className="flex items-center gap-2">
                  <img
                    src={symbolPreview}
                    alt="Set symbol"
                    className="h-10 w-10 rounded border border-border object-contain bg-surface-0 p-1"
                  />
                  <button
                    onClick={handleSymbolRemove}
                    className="text-xs text-danger hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-10 items-center gap-2 rounded-lg border border-dashed border-border bg-surface-0 px-3 text-xs text-text-secondary hover:border-accent hover:text-accent transition-colors"
                >
                  Upload Symbol
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleSymbolUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-border px-5 py-4">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface-2 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-surface-0 hover:bg-accent-hover transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
