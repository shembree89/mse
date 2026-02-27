import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/mse/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'canvas': ['react-konva', 'konva'],
          'charts': ['recharts'],
          'db': ['dexie', 'dexie-react-hooks'],
          'state': ['zustand', 'jotai'],
        },
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
        // Frame PNGs are too large for precaching (2-3MB each).
        // They're handled by runtimeCaching with CacheFirst strategy below.
        runtimeCaching: [
          {
            urlPattern: /\/templates\/.*\.png$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'template-frames',
              expiration: { maxEntries: 200, maxAgeSeconds: 30 * 24 * 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /\/mana-symbols\/.*\.svg$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'mana-symbols',
              expiration: { maxEntries: 100 },
            },
          },
          {
            urlPattern: /\/fonts\/.*\.woff2$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts',
              expiration: { maxEntries: 20 },
            },
          },
        ],
      },
      manifest: {
        name: 'Magic Set Editor',
        short_name: 'MSE',
        description: 'Design Magic: The Gathering cards on your tablet',
        start_url: '/mse/',
        display: 'standalone',
        orientation: 'any',
        background_color: '#0f0f14',
        theme_color: '#1a1a2e',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      devOptions: { enabled: true },
    }),
  ],
})
