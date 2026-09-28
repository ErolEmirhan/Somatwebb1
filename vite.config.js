import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

/** Vercel benzeri: prerender route HTML dosyalarını preview'da sunar */
function seoPrerenderPreview() {
  return {
    name: 'seo-prerender-preview',
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        const raw = req.url?.split('?')[0] ?? '/'
        if (raw !== '/' && !raw.includes('.') && !raw.endsWith('/')) {
          const outDir = join(server.config.root, server.config.build.outDir)
          const htmlPath = join(outDir, raw.slice(1), 'index.html')
          if (existsSync(htmlPath)) {
            req.url = `${raw}/index.html`
          }
        }
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), seoPrerenderPreview()],
  base: '/',
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name]-[hash].js`,
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: true
  }
})
