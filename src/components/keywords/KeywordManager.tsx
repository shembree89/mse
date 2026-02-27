import { useState } from 'react'
import { useKeywords, createKeyword, deleteKeyword } from '../../db/hooks/useKeywords.ts'
import { useAppStore } from '../../stores/appStore.ts'

export function KeywordManager() {
  const currentSetId = useAppStore((s) => s.currentSetId)
  const keywords = useKeywords(currentSetId)
  const [filter, setFilter] = useState('')

  const filtered = keywords.filter(
    (k) =>
      k.name.toLowerCase().includes(filter.toLowerCase()) ||
      k.reminderText.toLowerCase().includes(filter.toLowerCase()),
  )

  async function handleAddKeyword() {
    await createKeyword({
      setId: currentSetId,
      name: 'New Keyword',
      match: '\\bNew Keyword\\b',
      reminderText: '(Reminder text here.)',
      parameters: [],
      isEvergreen: false,
      isCustom: true,
      sortOrder: keywords.length,
    })
  }

  return (
    <div className="flex h-full flex-col p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text-primary">Keywords</h1>
        <button
          onClick={handleAddKeyword}
          className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-surface-0 hover:bg-accent-hover min-h-[44px]"
        >
          + Custom Keyword
        </button>
      </div>

      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Search keywords..."
        className="mb-4 rounded bg-surface-2 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted border border-border focus:border-accent focus:outline-none min-h-[44px]"
      />

      <div className="flex flex-col gap-1 overflow-y-auto">
        {filtered.map((kw) => (
          <div
            key={kw.id}
            className="flex items-start gap-3 rounded-lg px-4 py-3 hover:bg-surface-2"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-text-primary">{kw.name}</span>
                {kw.isEvergreen && (
                  <span className="rounded bg-success/20 px-1.5 py-0.5 text-xs text-success">
                    Evergreen
                  </span>
                )}
                {kw.isCustom && (
                  <span className="rounded bg-accent/20 px-1.5 py-0.5 text-xs text-accent">
                    Custom
                  </span>
                )}
              </div>
              {kw.reminderText && (
                <p className="mt-1 text-xs italic text-text-muted">{kw.reminderText}</p>
              )}
            </div>
            {kw.isCustom && (
              <button
                onClick={() => deleteKeyword(kw.id)}
                className="rounded px-2 py-1 text-xs text-danger hover:bg-danger/10"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
