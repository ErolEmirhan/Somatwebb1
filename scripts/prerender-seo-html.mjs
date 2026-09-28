/**
 * Build-time SEO head injection — route-specific meta/JSON-LD in static HTML.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PAGE_SEO, DEFAULT_OG_IMAGE } from '../src/seo.config.js'
import { buildPageJsonLd } from '../src/config/seoStructuredData.js'
import { getPrerenderPaths } from '../src/content/seoPages.js'
import { BRAND } from '../src/config/brand.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const distDir = join(root, 'dist')

const PRERENDER_ROUTES = getPrerenderPaths()

/** Menüde olmayan ürün adları ve yanlış marka ifadeleri SEO'ya girmemeli */
const SEO_FORBIDDEN = [/somatçı/i, /fırın\s*kebab/i, /furun\s*kebab/i, /firun\s*kebab/i]

function assertSeoTextSafe(text, label) {
  for (const re of SEO_FORBIDDEN) {
    if (re.test(text)) {
      throw new Error(`[prerender-seo] Yasak SEO ifadesi (${label}): ${text}`)
    }
  }
}

function escapeHtmlText(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;')
}

function escapeAttr(value) {
  return escapeHtmlText(value).replace(/"/g, '&quot;')
}

function buildSeoHeadBlock(seo) {
  const title = seo.title
  const description = seo.description
  const canonical = seo.canonical
  const jsonLd = JSON.stringify(buildPageJsonLd(seo.breadcrumbs))
  const brandName = BRAND.name
  const ogImage = DEFAULT_OG_IMAGE

  return `
    <!-- seo-prerender -->
    <title data-seo-prerender="1">${escapeHtmlText(title)}</title>
    <meta data-seo-prerender="1" name="description" content="${escapeAttr(description)}" />
    <link data-seo-prerender="1" rel="canonical" href="${escapeAttr(canonical)}" />
    <meta data-seo-prerender="1" name="robots" content="index, follow" />
    <meta data-seo-prerender="1" property="og:type" content="website" />
    <meta data-seo-prerender="1" property="og:site_name" content="${escapeAttr(brandName)}" />
    <meta data-seo-prerender="1" property="og:locale" content="tr_TR" />
    <meta data-seo-prerender="1" property="og:title" content="${escapeAttr(title)}" />
    <meta data-seo-prerender="1" property="og:description" content="${escapeAttr(description)}" />
    <meta data-seo-prerender="1" property="og:url" content="${escapeAttr(canonical)}" />
    <meta data-seo-prerender="1" property="og:image" content="${escapeAttr(ogImage)}" />
    <meta data-seo-prerender="1" property="og:image:type" content="image/png" />
    <meta data-seo-prerender="1" property="og:image:alt" content="${escapeAttr(brandName)} — resmî logo" />
    <meta data-seo-prerender="1" name="twitter:card" content="summary_large_image" />
    <meta data-seo-prerender="1" name="twitter:title" content="${escapeAttr(title)}" />
    <meta data-seo-prerender="1" name="twitter:description" content="${escapeAttr(description)}" />
    <meta data-seo-prerender="1" name="twitter:image" content="${escapeAttr(ogImage)}" />
    <meta data-seo-prerender="1" name="twitter:image:alt" content="${escapeAttr(brandName)} — resmî logo" />
    <script data-seo-prerender="1" type="application/ld+json">${jsonLd}</script>
  `.trim()
}

function injectSeoIntoTemplate(baseHtml, seoBlock) {
  return baseHtml.replace('</head>', `${seoBlock}\n</head>`)
}

function writeRouteHtml(route, baseHtml, seoBlock) {
  const html = injectSeoIntoTemplate(baseHtml, seoBlock)
  if (route === '/') {
    writeFileSync(join(distDir, 'index.html'), html, 'utf8')
    return
  }
  const segment = route.replace(/^\//, '')
  const outDir = join(distDir, segment)
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'index.html'), html, 'utf8')
}

const baseTemplate = readFileSync(join(distDir, 'index.html'), 'utf8')

for (const route of PRERENDER_ROUTES) {
  const seo = PAGE_SEO[route]
  if (!seo) {
    console.warn(`[prerender-seo] PAGE_SEO eksik: ${route}`)
    continue
  }
  assertSeoTextSafe(seo.title, `${route} title`)
  assertSeoTextSafe(seo.description ?? '', `${route} description`)
  writeRouteHtml(route, baseTemplate, buildSeoHeadBlock(seo))
  console.log(`[prerender-seo] ${route}`)
}

console.log(`[prerender-seo] ${PRERENDER_ROUTES.length} route HTML yazıldı.`)
