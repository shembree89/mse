import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell.tsx'
import { SetManager } from './components/setmanager/SetManager.tsx'
import { CardEditorPage } from './components/editor/CardEditorPage.tsx'
import { CardListPage } from './components/cardlist/CardListPage.tsx'
import { KeywordManager } from './components/keywords/KeywordManager.tsx'
import { StatsPanel } from './components/statistics/StatsPanel.tsx'
import { ExportDialog } from './components/export/ExportDialog.tsx'
import { seedKeywords } from './db/hooks/useKeywords.ts'
import { preloadCommonSymbols } from './engine/manaSymbolLoader.ts'
import { preloadFrameImages } from './engine/frameImageLoader.ts'

export default function App() {
  useEffect(() => {
    seedKeywords()
    preloadCommonSymbols()
    preloadFrameImages()
  }, [])

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/sets" replace />} />
        <Route path="/sets" element={<SetManager />} />
        <Route path="/sets/:setId/cards" element={<CardListPage />} />
        <Route path="/sets/:setId/cards/:cardId" element={<CardEditorPage />} />
        <Route path="/sets/:setId/keywords" element={<KeywordManager />} />
        <Route path="/sets/:setId/stats" element={<StatsPanel />} />
      </Routes>
      <ExportDialog />
    </AppShell>
  )
}
