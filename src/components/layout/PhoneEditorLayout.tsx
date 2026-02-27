import { type ReactNode, useState } from 'react'

interface PhoneEditorLayoutProps {
  preview: ReactNode
  panel: ReactNode
}

export function PhoneEditorLayout({ preview, panel }: PhoneEditorLayoutProps) {
  const [tab, setTab] = useState<'preview' | 'editor'>('preview')

  return (
    <div className="flex h-full flex-col">
      {/* Tab bar */}
      <div className="flex shrink-0 border-b border-border bg-surface-1">
        <button
          onClick={() => setTab('preview')}
          className={`flex-1 py-2 text-center text-sm font-medium transition-colors ${
            tab === 'preview'
              ? 'border-b-2 border-accent text-accent'
              : 'text-text-secondary'
          }`}
        >
          Preview
        </button>
        <button
          onClick={() => setTab('editor')}
          className={`flex-1 py-2 text-center text-sm font-medium transition-colors ${
            tab === 'editor'
              ? 'border-b-2 border-accent text-accent'
              : 'text-text-secondary'
          }`}
        >
          Editor
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {tab === 'preview' ? (
          <div className="h-full">{preview}</div>
        ) : (
          <div className="h-full overflow-y-auto">{panel}</div>
        )}
      </div>
    </div>
  )
}
