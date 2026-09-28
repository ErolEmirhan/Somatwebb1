/**
 * Sitemap generator — indexlenebilir SEO sayfaları otomatik dahil.
 * public/ ve (build sonrası) dist/ için çalıştırılır.
 */
import { writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { SITEMAP_PATHS, SITE_URL } from '../src/seo.config.js'
import { SEO_PAGES } from '../src/content/seoPages.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const EXCLUDE_FROM_SITEMAP = ['/menu/order']

function priorityFor(path) {
  if (path === '/') return '1.0'
  if (path === '/konyada-ne-yenir' || path === '/menu') return '0.9'
  if (SEO_PAGES.some((p) => `/${p.slug}` === path)) return '0.8'
  return '0.7'
}

function changefreqFor(path) {
  if (path === '/menu' || path === '/galeri') return 'weekly'
  return 'monthly'
}

function lastmodFor(path) {
  const slug = path.replace(/^\//, '')
  const page = SEO_PAGES.find((p) => p.slug === slug)
  return page?.lastModified ?? null
}

function buildSitemapXml() {
  const paths = SITEMAP_PATHS.filter((p) => !EXCLUDE_FROM_SITEMAP.includes(p))
  const urls = paths.map((path) => {
    const loc = `${SITE_URL}${path === '/' ? '/' : path}`
    const lastmod = lastmodFor(path)
    const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''
    return `  <url>\n    <loc>${loc}</loc>${lastmodTag}\n    <changefreq>${changefreqFor(path)}</changefreq>\n    <priority>${priorityFor(path)}</priority>\n  </url>`
  })

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
}

const xml = buildSitemapXml()
writeFileSync(join(root, 'public', 'sitemap.xml'), xml, 'utf8')
console.log(`[generate-sitemap] public/sitemap.xml — ${SITEMAP_PATHS.length - EXCLUDE_FROM_SITEMAP.length} URL`)

const distDir = join(root, 'dist')
try {
  writeFileSync(join(distDir, 'sitemap.xml'), xml, 'utf8')
  console.log('[generate-sitemap] dist/sitemap.xml güncellendi')
} catch {
  console.log('[generate-sitemap] dist/ henüz yok — build sonrası tekrar çalıştırılacak')
}
