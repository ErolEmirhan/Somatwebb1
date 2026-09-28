/**
 * RAW HTTP HTML + browser runtime SEO audit.
 * Önce: npm run build && npx vite preview --port 4173
 */
import { chromium } from 'playwright'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const BASE = 'http://127.0.0.1:4173'

const ROUTES = ['/', '/konyada-ne-yenir', '/menu', '/hakkimizda', '/galeri', '/iletisim']

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
    title: "Menü | Sultan Somatı – Konya'da Yenilecek En Güzel Yemekler",
    description:
      "Konya'da yenilecek en güzel yemekler: Selçuklu, Mevlevi, Osmanlı ve Konya mutfağından çorbalar, ana yemekler, içecekler ve tatlılar. Güncel menü ve fiyatlar.",
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

function parseRawHtml(html) {
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i)
  const title = titleMatch?.[1]?.trim() ?? ''
  const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content="([^"]*)"/i)
  const description = descMatch?.[1] ?? ''
  const canonMatches = [...html.matchAll(/<link[^>]+rel=["']canonical["'][^>]*>/gi)]
  const canonicalUrls = canonMatches.map((m) => {
    const href = m[0].match(/href=["']([^"']*)["']/i)
    return href?.[1] ?? ''
  })
  const jsonLdMatches = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
  let jsonLdValid = false
  let jsonLdCount = jsonLdMatches.length
  for (const m of jsonLdMatches) {
    try {
      const data = JSON.parse(m[1])
      if (data?.['@type'] === 'Restaurant') jsonLdValid = true
    } catch {
      /* invalid */
    }
  }
  return {
    title,
    description,
    canonicalCount: canonicalUrls.length,
    canonicalUrl: canonicalUrls[0] ?? '',
    jsonLdCount,
    jsonLdValid,
  }
}

async function httpStatus(path) {
  const res = await fetch(`${BASE}${path}`, { redirect: 'manual' })
  return res.status
}

async function fetchRawHtml(path) {
  const res = await fetch(`${BASE}${path}`)
  return { status: res.status, html: await res.text() }
}

async function auditRuntime(page, route) {
  const consoleErrors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text())
  })
  page.on('pageerror', (err) => consoleErrors.push(err.message))

  await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForFunction(
    () => {
      const el = document.querySelector('script[type="application/ld+json"]')
      return el?.textContent?.includes('Restaurant') ?? false
    },
    { timeout: 15000 }
  )

  const dom = await page.evaluate(() => {
    const canonicals = [...document.querySelectorAll('link[rel="canonical"]')].map((l) => l.href)
    const titles = [...document.querySelectorAll('title')].map((t) => t.textContent?.trim() ?? '')
    const jsonLdCount = document.querySelectorAll('script[type="application/ld+json"]').length
    return { canonicalCount: canonicals.length, canonicalUrl: canonicals[0] ?? '', title: titles[0] ?? '', jsonLdCount }
  })

  return { ...dom, consoleErrors }
}

async function main() {
  const rawResults = []
  const runtimeResults = []

  for (const route of ROUTES) {
    const exp = EXPECTED[route]
    const { status, html } = await fetchRawHtml(route)
    const parsed = parseRawHtml(html)
    const rawPass =
      status === 200 &&
      parsed.title === exp.title &&
      parsed.canonicalCount === 1 &&
      parsed.canonicalUrl === exp.canonical &&
      parsed.description === exp.description &&
      parsed.jsonLdCount === 1 &&
      parsed.jsonLdValid

    rawResults.push({
      route,
      http: status,
      sourceTitle: parsed.title,
      sourceCanonicalCount: parsed.canonicalCount,
      sourceCanonical: parsed.canonicalUrl,
      sourceDescription: parsed.description,
      sourceJsonLdCount: parsed.jsonLdCount,
      sourceJsonLd: parsed.jsonLdValid ? 'valid Restaurant' : 'invalid/missing',
      pass: rawPass,
    })
  }

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()

  for (const route of ROUTES) {
    const exp = EXPECTED[route]
    const rt = await auditRuntime(page, route)
    const rtPass =
      rt.canonicalCount === 1 &&
      rt.canonicalUrl === exp.canonical &&
      rt.title === exp.title &&
      rt.jsonLdCount === 1 &&
      rt.consoleErrors.length === 0

    runtimeResults.push({
      route,
      runtimeCanonicalCount: rt.canonicalCount,
      runtimeTitle: rt.title,
      runtimeJsonLdCount: rt.jsonLdCount,
      consoleErrors: rt.consoleErrors,
      pass: rtPass,
    })
  }

  await browser.close()

  console.log('=== RAW HTTP HTML AUDIT ===')
  console.log(JSON.stringify(rawResults, null, 2))
  console.log('\n=== BROWSER RUNTIME AUDIT ===')
  console.log(JSON.stringify(runtimeResults, null, 2))

  const allPass = rawResults.every((r) => r.pass) && runtimeResults.every((r) => r.pass)
  process.exit(allPass ? 0 : 1)
}

main().catch((e) => {
  console.error(e)
  process.exit(2)
})
