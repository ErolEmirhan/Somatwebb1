/**
 * SEO runtime audit — production preview üzerinde DOM + HTTP kontrolü.
 * Çalıştır: node scripts/seo-runtime-audit.mjs
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

async function httpStatus(path) {
  const res = await fetch(`${BASE}${path}`, { redirect: 'manual' })
  return res.status
}

function parseSitemapUrls() {
  const xml = readFileSync(join(root, 'public', 'sitemap.xml'), 'utf8')
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
}

async function auditRoute(page, route) {
  await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForFunction(
    () => {
      const el = document.querySelector('script[type="application/ld+json"]')
      return el?.textContent?.includes('Restaurant') ?? false
    },
    { timeout: 15000 }
  )

  return await page.evaluate(() => {
    const canonicals = [...document.querySelectorAll('link[rel="canonical"]')].map((l) => l.href)
    const titles = [...document.querySelectorAll('title')].map((t) => t.textContent?.trim() ?? '')
    const descriptions = [...document.querySelectorAll('meta[name="description"]')].map(
      (m) => m.getAttribute('content') ?? ''
    )
    const ogUrls = [...document.querySelectorAll('meta[property="og:url"]')].map(
      (m) => m.getAttribute('content') ?? ''
    )
    const ogTitles = [...document.querySelectorAll('meta[property="og:title"]')].map(
      (m) => m.getAttribute('content') ?? ''
    )
    const robots = [...document.querySelectorAll('meta[name="robots"]')].map(
      (m) => m.getAttribute('content') ?? ''
    )
    const jsonLdScripts = [...document.querySelectorAll('script[type="application/ld+json"]')].map(
      (s) => s.textContent ?? ''
    )
    return { canonicals, titles, descriptions, ogUrls, ogTitles, robots, jsonLdScripts }
  })
}

function validateJsonLd(text) {
  const data = JSON.parse(text)
  const issues = []
  const walk = (obj, path = '') => {
    if (obj === null || obj === undefined) issues.push(`${path}: null/undefined`)
    if (Array.isArray(obj)) obj.forEach((v, i) => walk(v, `${path}[${i}]`))
    else if (typeof obj === 'object') {
      for (const [k, v] of Object.entries(obj)) {
        if (v === null || v === undefined || v === '') issues.push(`${path}.${k}: empty`)
        else walk(v, `${path}.${k}`)
      }
    }
  }
  walk(data, 'root')
  return { valid: issues.length === 0, issues, data }
}

async function main() {
  const results = []

  // HTTP static assets
  const robotsRes = await fetch(`${BASE}/robots.txt`)
  const robotsText = await robotsRes.text()
  const sitemapRes = await fetch(`${BASE}/sitemap.xml`)
  const sitemapText = await sitemapRes.text()

  console.log('=== HTTP static ===')
  console.log('robots.txt', robotsRes.status)
  console.log('sitemap.xml', sitemapRes.status)
  for (const route of ROUTES) {
    const st = await httpStatus(route)
    console.log(`${route} HTTP`, st)
  }
  const konyaDirect = await httpStatus('/konyada-ne-yenir')
  console.log('/konyada-ne-yenir direct HTTP', konyaDirect)

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()

  for (const route of ROUTES) {
    const exp = EXPECTED[route]
    const dom = await auditRoute(page, route)
    const http = await httpStatus(route)

    const jsonLdResults = dom.jsonLdScripts.map((t) => validateJsonLd(t))
    const jsonLdOk =
      jsonLdResults.length >= 1 &&
      jsonLdResults.every((r) => r.valid) &&
      jsonLdResults[0]?.data?.['@type'] === 'Restaurant'

    const pass =
      http === 200 &&
      dom.canonicals.length === 1 &&
      dom.canonicals[0] === exp.canonical &&
      dom.titles.length === 1 &&
      dom.titles[0] === exp.title &&
      dom.descriptions.length === 1 &&
      dom.descriptions[0] === exp.description &&
      dom.ogUrls.length === 1 &&
      dom.ogUrls[0] === exp.canonical &&
      dom.ogTitles.length === 1 &&
      dom.ogTitles[0] === exp.title &&
      dom.robots.length === 1 &&
      dom.robots[0] === 'index, follow' &&
      jsonLdOk

    results.push({
      route,
      http,
      title: dom.titles[0] ?? '',
      canonicalCount: dom.canonicals.length,
      canonicalUrl: dom.canonicals[0] ?? '',
      canonicalAll: dom.canonicals,
      description: dom.descriptions[0] ?? '',
      descriptionCount: dom.descriptions.length,
      ogUrl: dom.ogUrls[0] ?? '',
      ogUrlCount: dom.ogUrls.length,
      ogTitle: dom.ogTitles[0] ?? '',
      robots: dom.robots[0] ?? '',
      robotsCount: dom.robots.length,
      jsonLd: jsonLdOk ? 'valid Restaurant' : JSON.stringify(jsonLdResults),
      pass,
    })
  }

  await browser.close()

  // Sitemap URL checks (local path mapping)
  const sitemapUrls = parseSitemapUrls()
  const sitemapChecks = []
  for (const url of sitemapUrls) {
    const path = url.replace('https://www.sultansomati.com.tr', '') || '/'
    const st = await httpStatus(path)
    sitemapChecks.push({ url, path, status: st })
  }

  console.log('\n=== ROUTE AUDIT ===')
  console.log(JSON.stringify(results, null, 2))
  console.log('\n=== SITEMAP URL HTTP ===')
  console.log(JSON.stringify(sitemapChecks, null, 2))
  console.log('\n=== ROBOTS ===')
  console.log(robotsText)
  console.log('\n=== JSON-LD sample (/) ===')
  const browser2 = await chromium.launch({ headless: true })
  const p2 = await browser2.newPage()
  await p2.goto(`${BASE}/`, { waitUntil: 'networkidle' })
  await p2.waitForFunction(
    () => {
      const el = document.querySelector('script[type="application/ld+json"]')
      return el?.textContent?.includes('Restaurant') ?? false
    },
    { timeout: 15000 }
  )
  const sampleText = await p2.evaluate(
    () => document.querySelector('script[type="application/ld+json"]')?.textContent ?? ''
  )
  await browser2.close()
  if (sampleText) {
    console.log(JSON.stringify(JSON.parse(sampleText), null, 2))
  } else {
    console.log('MISSING')
  }

  const allPass = results.every((r) => r.pass) && sitemapChecks.every((s) => s.status === 200)
  process.exit(allPass ? 0 : 1)
}

main().catch((e) => {
  console.error(e)
  process.exit(2)
})
