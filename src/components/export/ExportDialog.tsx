import { useState } from 'react'
import { useAppStore } from '../../stores/appStore.ts'
import { exportCardAsPng, exportSetAsZip, type DPIOption } from '../../export/pngExporter.ts'
import { exportSetAsJson } from '../../export/jsonExporter.ts'

type ExportFormat = 'png-single' | 'png-set' | 'json'

export function ExportDialog() {
  const isOpen = useAppStore((s) => s.isExportDialogOpen)
  const setOpen = useAppStore((s) => s.setExportDialogOpen)
  const currentSetId = useAppStore((s) => s.currentSetId)
  const currentCardId = useAppStore((s) => s.currentCardId)

  const [format, setFormat] = useState<ExportFormat>('png-single')
  const [dpi, setDpi] = useState<DPIOption>(300)
  const [exporting, setExporting] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0 })

  if (!isOpen) return null

  async function handleExport() {
    setExporting(true)
    try {
      let blob: Blob
      let filename: string

      switch (format) {
        case 'png-single':
          if (!currentCardId) return
          blob = await exportCardAsPng(currentCardId, dpi)
          filename = `card_${dpi}dpi.png`
          break
        case 'png-set':
          if (!currentSetId) return
          blob = await exportSetAsZip(currentSetId, dpi, (current, total) => {
            setProgress({ current, total })
          })
          filename = `set_${dpi}dpi.zip`
          break
        case 'json':
          if (!currentSetId) return
          blob = await exportSetAsJson(currentSetId)
          filename = 'set.json'
          break
        default:
          return
      }

      // Trigger download
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setExporting(false)
      setProgress({ current: 0, total: 0 })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setOpen(false)}>
      <div
        className="w-full max-w-md rounded-xl border border-border bg-surface-1 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-lg font-semibold text-text-primary">Export</h2>

        <div className="mb-4 flex flex-col gap-2">
          <label className="text-xs font-medium text-text-secondary">Format</label>
          <div className="flex flex-col gap-1">
            {([
              { value: 'png-single' as const, label: 'Current Card (PNG)', desc: 'Export the current card as a high-res PNG' },
              { value: 'png-set' as const, label: 'Full Set (ZIP)', desc: 'Export all cards as PNGs in a ZIP file' },
              { value: 'json' as const, label: 'Card Data (JSON)', desc: 'Export card data as structured JSON' },
            ] as const).map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFormat(opt.value)}
                className={`rounded-lg p-3 text-left transition-colors min-h-[56px] ${
                  format === opt.value
                    ? 'bg-accent/20 border border-accent'
                    : 'bg-surface-2 border border-transparent hover:bg-surface-3'
                }`}
              >
                <p className="text-sm font-medium text-text-primary">{opt.label}</p>
                <p className="text-xs text-text-muted">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {format !== 'json' && (
          <div className="mb-4 flex flex-col gap-2">
            <label className="text-xs font-medium text-text-secondary">Resolution</label>
            <div className="grid grid-cols-3 gap-1">
              {([300, 600, 1200] as DPIOption[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDpi(d)}
                  className={`rounded px-3 py-2 text-sm font-medium min-h-[44px] ${
                    dpi === d
                      ? 'bg-accent/20 text-accent border border-accent'
                      : 'bg-surface-2 text-text-secondary border border-transparent hover:bg-surface-3'
                  }`}
                >
                  {d} DPI
                </button>
              ))}
            </div>
            <p className="text-xs text-text-muted">
              {dpi === 300 && '750x1050px — Standard quality'}
              {dpi === 600 && '1500x2100px — High quality'}
              {dpi === 1200 && '3000x4200px — Ultra high quality (print)'}
            </p>
          </div>
        )}

        {exporting && progress.total > 0 && (
          <div className="mb-4">
            <div className="mb-1 flex justify-between text-xs text-text-secondary">
              <span>Exporting...</span>
              <span>{progress.current}/{progress.total}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-surface-3">
              <div
                className="h-full rounded-full bg-accent transition-all"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg px-4 py-2.5 text-sm text-text-secondary hover:bg-surface-2 min-h-[44px]"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-surface-0 hover:bg-accent-hover disabled:opacity-50 min-h-[44px]"
          >
            {exporting ? 'Exporting...' : 'Export'}
          </button>
        </div>
      </div>
    </div>
  )
}
