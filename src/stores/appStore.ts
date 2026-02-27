import { create } from 'zustand'

export type ViewMode = 'sets' | 'editor' | 'cardlist' | 'stats' | 'keywords'

interface AppState {
  currentSetId: string | null
  currentCardId: string | null
  currentView: ViewMode

  editorPanelWidth: number
  isExportDialogOpen: boolean
  isManaKeyboardOpen: boolean
  cardListSort: { field: string; direction: 'asc' | 'desc' }
  cardListFilter: string
  zoomLevel: number

  setCurrentSet: (setId: string | null) => void
  setCurrentCard: (cardId: string | null) => void
  navigateToView: (view: ViewMode) => void
  setEditorPanelWidth: (width: number) => void
  setExportDialogOpen: (open: boolean) => void
  setManaKeyboardOpen: (open: boolean) => void
  setCardListSort: (sort: { field: string; direction: 'asc' | 'desc' }) => void
  setCardListFilter: (filter: string) => void
  setZoomLevel: (zoom: number) => void
}

export const useAppStore = create<AppState>((set) => ({
  currentSetId: null,
  currentCardId: null,
  currentView: 'sets',

  editorPanelWidth: 360,
  isExportDialogOpen: false,
  isManaKeyboardOpen: false,
  cardListSort: { field: 'sortOrder', direction: 'asc' },
  cardListFilter: '',
  zoomLevel: 1.0,

  setCurrentSet: (setId) => set({ currentSetId: setId }),
  setCurrentCard: (cardId) => set({ currentCardId: cardId }),
  navigateToView: (view) => set({ currentView: view }),
  setEditorPanelWidth: (width) => set({ editorPanelWidth: width }),
  setExportDialogOpen: (open) => set({ isExportDialogOpen: open }),
  setManaKeyboardOpen: (open) => set({ isManaKeyboardOpen: open }),
  setCardListSort: (sort) => set({ cardListSort: sort }),
  setCardListFilter: (filter) => set({ cardListFilter: filter }),
  setZoomLevel: (zoom) => set({ zoomLevel: zoom }),
}))
