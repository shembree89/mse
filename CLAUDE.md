# Magic Set Editor (MSE) — PWA Card Editor

## Overview
A Progressive Web App for designing Magic: The Gathering cards on tablets/phones. Built as a client-side-only app with offline support.

## Tech Stack
React 19, TypeScript 5.9, Vite 7.3, Tailwind CSS 4.2, react-konva 19.2 (canvas rendering), Dexie 4.3 (IndexedDB), Jotai 2.18 (editor atoms), Zustand 5.0 (global app state), VitePWA

## Development Commands
```bash
npx vite --host        # Dev server (accessible on LAN for tablet testing)
npx vite build         # Production build
npx tsc --noEmit       # Type check
```

## Deployment
- **GitHub Pages**: https://shembree89.github.io/mse/
- Auto-deploys on push to `main` via `.github/workflows/deploy.yml`
- Vite `base: '/mse/'` — all asset paths use `import.meta.env.BASE_URL`
- Remote: `https://github.com/shembree89/mse.git` (HTTPS, authenticated via `gh` CLI)

## Architecture

### Rendering Pipeline
- **CardRenderer.tsx** — React-Konva component reading Jotai atoms, renders card preview on canvas
- **pngExporter.ts** — Headless Konva rendering for PNG/ZIP export (mirrors CardRenderer logic)
- **cardLayout.ts** — Shared coordinate constants (Card Conjurer M15 coords at 750x1050)
- Both renderers must stay in sync — changes to one should be mirrored in the other

### Asset System
- **Frame PNGs** — Real Card Conjurer M15 frames in `public/templates/m15/` (~2-3MB each, 2010x2814px)
- **Mana SVGs** — Glyph-only SVGs from andrewgioia/mana in `public/mana-symbols/`
- **Fonts** — Real MTG fonts (Beleren, MPlantin, Relay, Gotham) in `public/fonts/`
- **manaSymbolLoader.ts** — Composites colored circle bg + recolored glyph SVG into final mana symbol images
- **frameImageLoader.ts** — Loads frame PNGs, PT box images, masks
- **frameMasking.ts** — Composites dual-color frames using Canvas 2D masking

### State Management
- **Jotai atoms** (`stores/editorAtoms.ts`) — Per-card editor fields (name, manaCost, typeLine, etc.)
- **Zustand store** (`stores/appStore.ts`) — Global app state (current set/card selection)
- **Dexie** (`db/database.ts`) — Persistent storage for sets, cards, images

### PWA
- Frame PNGs excluded from precache (too large) — handled by runtime CacheFirst strategy
- Mana symbols and fonts use runtime caching too
- Config in `vite.config.ts` VitePWA plugin

## Current Status

| Area | Status | Notes |
|------|--------|-------|
| Visual polish | Open | User confirmed frames/mana correct, but says "still got work to do" — ask what to fix |
| GitHub Pages | Done | Live at shembree89.github.io/mse/, auto-deploys on push |

All Phase 7 items complete (phone layout, mana symbols, set metadata, M15 frames, dual-color frames, layout coords, fonts, art upload). Details in git history.

## Next Step
Ask the user what specific visual polish is needed — they've confirmed the frame and mana symbols look right but haven't specified remaining issues yet.

## Key Files

| File | Purpose |
|------|---------|
| `src/components/canvas/CardRenderer.tsx` | Main card preview renderer (react-konva) |
| `src/export/pngExporter.ts` | Export renderer (headless Konva) |
| `src/engine/cardLayout.ts` | All card coordinate constants |
| `src/engine/frameSelector.ts` | Color → frame mapping + getFrameComponents |
| `src/engine/manaSymbolLoader.ts` | Mana symbol compositing (circle + glyph) |
| `src/engine/frameImageLoader.ts` | Frame/PT PNG loader with cache |
| `src/engine/frameMasking.ts` | Dual-color frame compositing |
| `src/hooks/useFrameImage.ts` | React hooks for frame/PT image loading |
| `src/hooks/useManaSymbolImages.ts` | React hook for mana symbol loading |
| `src/components/editor/ArtworkUploader.tsx` | Art upload with auto-fit + zoom |
| `src/components/layout/AppShell.tsx` | Responsive shell (phone/tablet/desktop) |
| `src/stores/editorAtoms.ts` | Jotai atoms for card editor state |
| `src/fonts.css` | @font-face declarations for all MTG fonts |
| `.github/workflows/deploy.yml` | GitHub Pages deployment workflow |

## Recent Decisions

| Decision | Why |
|----------|-----|
| Card Conjurer frames as source | Only open-source M15 frame PNGs available, 2010x2814 RGBA with transparency |
| andrewgioia/mana SVGs | Industry-standard MTG symbol font, glyph-only SVGs recolored at runtime |
| Canvas compositing for mana symbols | Colored circle + dark glyph composited into cached images, shared by renderer and exporter |
| Frame PNGs excluded from PWA precache | 2-3MB each, too large — use runtime CacheFirst instead |
| Layout coords from Card Conjurer source | 1500x2100 canvas coords halved to 750x1050, from `/data/scripts/versions/m15/version.js` |
| Art rendered at naturalWidth/Height | Prevents distortion — scale/position applied for cover-fit cropping |
| HTTPS remote (not SSH) for git push | SSH keys not configured; `gh` CLI handles HTTPS auth |
| `import.meta.env.BASE_URL` for public asset paths | Vite doesn't rewrite JS template literal paths — CSS `url()` is handled automatically |
