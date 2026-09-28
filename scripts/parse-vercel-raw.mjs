/**
 * Parse vercel curl RAW HTML files and output audit JSON.
 */
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const FILE_MAP = {
  '/': 'vercel-raw-root.html',
  '/konyada-ne-yenir': 'vercel-raw-_konyada-ne-yenir.html',
  '/menu': 'vercel-raw-_menu.html',
  '/hakkimizda': 'vercel-raw-_hakkimizda.html',
  '/galeri': 'vercel-raw-_galeri.html',
  '/iletisim': 'vercel-raw-_iletisim.html',
}

const EXPECTED = {
  '/': {
    title: 'Sultan Somatı | Selçuklu ve Mevlevi Mutfağı – Konya',
    description:
      "Konya'da Selçuklu, Mevlevi ve Osmanlı tarihi mutfağından seçkiler. Menü, rezervasyon ve yöresel lezzet deneyimi için Sultan Somatı.",
    canonical: 'https://www.sultansomati.com.tr/',
  },
  '/konyada-ne-yenir': {
    title: "Konya'da Ne Yenir? Konya'nın Yöresel Lezzetleri | Sultan Somatı",
    description:
      "Konya'da ne yenir, yöresel ve geleneksel lezzetler, Selçuklu ve Mevlevi mutfağı rehberi. Sultan Somatı menü ve rezervasyon.",
    canonical: 'https://www.sultansomati.com.tr/konyada-ne-yenir',
  },
  '/menu': {
    title: 'Menü ve Fiyatlar | Sultan Somatı – Konya Restoran',
    description:
      'Selçuklu, Mevlevi, Osmanlı ve Konya mutfağından çorbalar, ana yemekler, içecekler ve tatlılar. Güncel menü ve fiyat listesi.',
    canonical: 'https://www.sultansomati.com.tr/menu',
  },
  '/hakkimizda': {
    title: 'Hakkımızda | Sultan Somatı – Konya',
    description:
      'Sultan Somatı hikayesi: Selçuklu, Mevlevi, Osmanlı ve Konya mutfak geleneği. Değerlerimiz ve yolculuğumuz.',
    canonical: 'https://www.sultansomati.com.tr/hakkimizda',
  },
  '/galeri': {
    title: 'Galeri | Sultan Somatı – Yemek ve Mekan Görselleri',
    description: 'Sultan Somatı menü ürün görselleri ve mekan fotoğrafları. Konya restoran galerisi.',
    canonical: 'https://www.sultansomati.com.tr/galeri',
  },
  '/iletisim': {
    title: 'İletişim ve Adres | Sultan Somatı – Konya',
    description:
      'Sultan Somatı telefon, adres, çalışma saatleri ve harita. Konya restoran iletişim bilgileri.',
    canonical: 'https://www.sultansomati.com.tr/iletisim',
  },
}

function parse(html) {
  const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ?? ''
  const description = html.match(/<meta[^>]+name=["']description["'][^>]+content="([^"]*)"/i)?.[1] ?? ''
  const canonMatches = [...html.matchAll(/<link[^>]+rel=["']canonical["'][^>]*>/gi)]
  const canonicalUrl = canonMatches[0]?.[0].match(/href=["']([^"']*)["']/i)?.[1] ?? ''
  const ogTitle = html.match(/<meta[^>]+property=["']og:title["'][^>]+content="([^"]*)"/i)?.[1] ?? ''
  const ogUrl = html.match(/<meta[^>]+property=["']og:url["'][^>]+content="([^"]*)"/i)?.[1] ?? ''
  const jsonLdMatches = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>/gi)]
  let jsonLdValid = false
  for (const m of [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]) {
    try {
      if (JSON.parse(m[1])?.['@type'] === 'Restaurant') jsonLdValid = true
    } catch {}
  }
  return {
    title,
    description,
    canonicalCount: canonMatches.length,
    canonicalUrl,
    ogTitle,
    ogUrl,
    jsonLdCount: jsonLdMatches.length,
    jsonLdValid,
    hasPrerender: html.includes('data-seo-prerender="1"'),
    isGenericHome: title === EXPECTED['/'].title && canonicalUrl === EXPECTED['/'].canonical,
  }
}

const results = []
for (const [route, file] of Object.entries(FILE_MAP)) {
  const html = readFileSync(join(root, file), 'utf8')
  const exp = EXPECTED[route]
  const p = parse(html)
  const routeSpecific =
    route === '/konyada-ne-yenir'
      ? p.title === exp.title && p.hasPrerender && !p.isGenericHome
      : p.title === exp.title
  const pass =
    p.title === exp.title &&
    p.canonicalCount === 1 &&
    p.canonicalUrl === exp.canonical &&
    p.description === exp.description &&
    p.ogTitle === exp.title &&
    p.ogUrl === exp.canonical &&
    p.jsonLdCount === 1 &&
    p.jsonLdValid
  results.push({ route, http: 200, ...p, routeSpecificStaticHtml: routeSpecific, pass })
}

const sitemap = readFileSync(join(root, 'vercel-raw-_sitemap_xml.html'), 'utf8')
const robots = readFileSync(join(root, 'vercel-raw-_robots_txt.html'), 'utf8')

console.log(
  JSON.stringify({
    rawResults: results,
    sitemap: { status: 200, pass: sitemap.includes('sultansomati.com.tr') },
    robots: { status: 200, pass: robots.toLowerCase().includes('sitemap') },
    allRawPass: results.every((r) => r.pass),
  }, null, 2)
)
