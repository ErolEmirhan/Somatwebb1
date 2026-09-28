/**
 * Vercel Preview deployment SEO audit — RAW HTTP + Playwright runtime.
 * Usage: node scripts/seo-vercel-preview-audit.mjs <PREVIEW_URL>
 */
import { chromium } from 'playwright'

const BASE = process.argv[2]?.replace(/\/$/, '') ?? ''
if (!BASE) {
  console.error('Usage: node scripts/seo-vercel-preview-audit.mjs <PREVIEW_URL>')
  process.exit(2)
}

const ROUTES = ['/', '/konyada-ne-yenir', '/menu', '/hakkimizda', '/galeri', '/iletisim']
const REDIRECTS = [
  { from: '/anasayfa', to: '/', toPath: '/' },
  { from: '/About', to: '/hakkimizda', toPath: '/hakkimizda' },
  { from: '/about', to: '/hakkimizda', toPath: '/hakkimizda' },
]

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
  const ogTitleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content="([^"]*)"/i)
  const ogUrlMatch = html.match(/<meta[^>]+property=["']og:url["'][^>]+content="([^"]*)"/i)
  const jsonLdMatches = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
  let jsonLdValid = false
  for (const m of jsonLdMatches) {
    try {
      const data = JSON.parse(m[1])
      if (data?.['@type'] === 'Restaurant') jsonLdValid = true
    } catch {
      /* invalid */
    }
  }
  const hasPrerenderMarker = html.includes('data-seo-prerender="1"')
  const isGenericHome =
    title === EXPECTED['/'].title && canonicalUrls[0] === EXPECTED['/'].canonical
  return {
    title,
    description,
    canonicalCount: canonicalUrls.length,
    canonicalUrl: canonicalUrls[0] ?? '',
    ogTitle: ogTitleMatch?.[1] ?? '',
    ogUrl: ogUrlMatch?.[1] ?? '',
    jsonLdCount: jsonLdMatches.length,
    jsonLdValid,
    hasPrerenderMarker,
    isGenericHome,
  }
}

async function fetchRaw(path, redirect = 'follow') {
  const res = await fetch(`${BASE}${path}`, { redirect })
  return { status: res.status, html: await res.text(), headers: res.headers }
}

async function auditRedirect({ from, toPath }) {
  const res = await fetch(`${BASE}${from}`, { redirect: 'manual' })
  const location = res.headers.get('location') ?? ''
  const locPath = location.replace(/^https?:\/\/[^/]+/, '') || location
  const ok =
    res.status >= 300 &&
    res.status < 400 &&
    (locPath === toPath || locPath === `${toPath}/` || location.endsWith(toPath))
  const follow = await fetch(`${BASE}${from}`)
  const followOk = follow.status === 200
  return { from, status: res.status, location, ok, followStatus: follow.status, followOk, loop: !ok }
}

async function auditRuntime(page, route) {
  const consoleErrors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text())
  })
  page.on('pageerror', (err) => consoleErrors.push(err.message))

  await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle', timeout: 90000 })
  await page.waitForFunction(
    () => {
      const el = document.querySelector('script[type="application/ld+json"]')
      return el?.textContent?.includes('Restaurant') ?? false
    },
    { timeout: 20000 }
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
  const redirectResults = []

  for (const route of ROUTES) {
    const exp = EXPECTED[route]
    const { status, html } = await fetchRaw(route)
    const parsed = parseRawHtml(html)
    const routeSpecific =
      route === '/konyada-ne-yenir'
        ? parsed.title === exp.title && !parsed.isGenericHome && parsed.hasPrerenderMarker
        : parsed.title === exp.title

    const rawPass =
      status === 200 &&
      parsed.title === exp.title &&
      parsed.canonicalCount === 1 &&
      parsed.canonicalUrl === exp.canonical &&
      parsed.description === exp.description &&
      parsed.ogTitle === exp.title &&
      parsed.ogUrl === exp.canonical &&
      parsed.jsonLdCount === 1 &&
      parsed.jsonLdValid

    rawResults.push({
      route,
      http: status,
      sourceTitle: parsed.title,
      sourceCanonical: parsed.canonicalUrl,
      sourceCanonicalCount: parsed.canonicalCount,
      sourceDescriptionOk: parsed.description === exp.description,
      sourceOgTitle: parsed.ogTitle,
      sourceOgUrl: parsed.ogUrl,
      sourceJsonLdCount: parsed.jsonLdCount,
      sourceJsonLd: parsed.jsonLdValid ? 'valid Restaurant' : 'invalid/missing',
      routeSpecificStaticHtml: routeSpecific,
      pass: rawPass,
    })
  }

  for (const r of REDIRECTS) {
    redirectResults.push(await auditRedirect(r))
  }

  const sitemap = await fetchRaw('/sitemap.xml')
  const robots = await fetchRaw('/robots.txt')

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

  // SPA navigation smoke
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: 90000 })
  await page.click('a[href="/menu"], a[href="/menu/"]', { timeout: 10000 }).catch(() => {})
  await page.waitForURL(/\/menu/, { timeout: 15000 }).catch(() => {})
  const spaNavOk = page.url().includes('/menu')

  // Menu Firestore load smoke
  await page.goto(`${BASE}/menu`, { waitUntil: 'networkidle', timeout: 90000 })
  await page.waitForTimeout(5000)
  const menuLoaded = await page.evaluate(() => {
    const text = document.body.innerText
    return text.length > 500 && !text.includes('Menü yüklenemedi')
  })

  // Splash on fresh load
  const splashPage = await browser.newPage()
  await splashPage.goto(`${BASE}/`, { waitUntil: 'domcontentloaded', timeout: 90000 })
  const splashVisible = await splashPage.evaluate(() => {
    const splash = document.querySelector('[class*="splash"], [data-splash], #splash')
    return splash !== null || document.body.innerText.includes('Sultan')
  })
  await splashPage.close()

  // Rezervasyon link
  await page.goto(`${BASE}/menu`, { waitUntil: 'networkidle', timeout: 90000 })
  const rezLink = await page.$('a[href="/menu/order"], a[href*="menu/order"]')
  const rezOk = rezLink !== null

  // Galeri + iletisim
  await page.goto(`${BASE}/galeri`, { waitUntil: 'networkidle', timeout: 90000 })
  const galeriOk = (await page.content()).length > 1000
  await page.goto(`${BASE}/iletisim`, { waitUntil: 'networkidle', timeout: 90000 })
  const iletisimOk = (await page.content()).length > 1000

  await browser.close()

  const out = {
    base: BASE,
    rawResults,
    redirectResults,
    sitemap: {
      status: sitemap.status,
      hasSultansomati: sitemap.html.includes('sultansomati.com.tr'),
      pass: sitemap.status === 200 && sitemap.html.includes('sultansomati.com.tr'),
    },
    robots: {
      status: robots.status,
      hasSitemap: robots.html.toLowerCase().includes('sitemap'),
      pass: robots.status === 200 && robots.html.toLowerCase().includes('sitemap'),
    },
    runtimeResults,
    smoke: { spaNavOk, menuLoaded, splashVisible, rezOk, galeriOk, iletisimOk },
    allPass:
      rawResults.every((r) => r.pass) &&
      runtimeResults.every((r) => r.pass) &&
      redirectResults.every((r) => r.ok && r.followOk) &&
      sitemap.pass &&
      robots.pass &&
      spaNavOk &&
      menuLoaded &&
      rezOk &&
      galeriOk &&
      iletisimOk,
  }

  console.log(JSON.stringify(out, null, 2))
  process.exit(out.allPass ? 0 : 1)
}

main().catch((e) => {
  console.error(e)
  process.exit(2)
})
