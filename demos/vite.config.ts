import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

// Builds the landing page's feature demos into static files that index.html
// loads, into site/assets/demos. Run from the repo root: `npm run build`.
//
// The kit is its own chunk with its own stylesheet under kit/, so the demos'
// CSS stays separate from the kit's: StageShow's film checks tell a kit rule
// from a demo rule by that path.
const here = (path: string) => fileURLToPath(new URL(path, import.meta.url))

export default defineConfig({
  root: here('.'),
  plugins: [react()],
  build: {
    outDir: here('../site/assets/demos'),
    emptyOutDir: true,
    target: 'es2022',
    cssCodeSplit: true,
    rollupOptions: {
      input: { demos: here('mount.tsx') },
      output: {
        format: 'es',
        entryFileNames: '[name].js',
        chunkFileNames: 'kit/[name].js',
        assetFileNames: (asset) => (asset.names?.some((n) => n.startsWith('kit')) ? 'kit/[name][extname]' : '[name][extname]'),
        manualChunks: (id) => (id.includes('/demos/kit/') || id.includes('node_modules') ? 'kit' : undefined),
      },
    },
  },
})
