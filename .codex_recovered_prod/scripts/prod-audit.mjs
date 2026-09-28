/**
 * Production post-deploy audit — RAW HTTP + domain checks.
 */
const PROD = 'https://www.sultansomati.com.tr'
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
    canonical: 'https://www.sultansomati.com.tr/menu',
  },
  '/hakkimizda': {
    title: 'Hakkımızda | Sultan Somatı – Konya',
    canonical: 'https://www.sultansomati.com.tr/hakkimizda',
  },
  '/galeri': {
    title: 'Galeri | Sultan Somatı – Yemek ve Mekan Görselleri',
    canonical: 'https://www.sultansomati.com.tr/galeri',
  },
  '/iletisim': {
    title: 'İletişim ve Adres | Sultan Somatı – Konya',
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
  const jsonLd = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>/gi)].length
  let jsonLdValid = false
  for (const m of [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]) {
    try {
      if (JSON.parse(m[1])?.['@type'] === 'Restaurant') jsonLdValid = true
    } catch {}
  }
  return { title, description, canonicalCount: canonMatches.length, canonicalUrl, ogTitle, ogUrl, jsonLdCount: jsonLd, jsonLdValid }
}

async function fetchRedirect(url) {
  const res = await fetch(url, { redirect: 'manual' })
  return { status: res.status, location: res.headers.get('location') ?? '' }
}

async function fetchHtml(base, path) {
  const res = await fetch(`${base}${path}`)
  return { status: res.status, html: await res.text() }
}

const domainChecks = [
  'https://sultansomati.com.tr/',
  'https://www.sultansomati.com/',
  'https://sultansomati.com/',
  'https://www.somatweb.com/',
  'https://somatweb.com/',
  'https://www.somatwebb.com/',
]

const redirectChecks = [
  { from: '/anasayfa', to: '/' },
  { from: '/About', to: '/hakkimizda' },
  { from: '/about', to: '/hakkimizda' },
]

const routeResults = []
for (const route of ROUTES) {
  const exp = EXPECTED[route]
  const { status, html } = await fetchHtml(PROD, route)
  const p = parse(html)
  const pass =
    status === 200 &&
    p.title === exp.title &&
    p.canonicalCount === 1 &&
    p.canonicalUrl === exp.canonical &&
    (exp.description ? p.description === exp.description : true) &&
    p.ogTitle === exp.title &&
    p.ogUrl === exp.canonical &&
    p.jsonLdCount === 1 &&
    p.jsonLdValid
  routeResults.push({ route, http: status, ...p, pass })
}

const konyaPass =
  routeResults.find((r) => r.route === '/konyada-ne-yenir')?.title ===
  "Konya'da Ne Yenir? Konya'nın Yöresel Lezzetleri | Sultan Somatı"

const sitemap = await fetchHtml(PROD, '/sitemap.xml')
const robots = await fetchHtml(PROD, '/robots.txt')

const legacyRedirects = []
for (const r of redirectChecks) {
  const first = await fetchRedirect(`${PROD}${r.from}`)
  const loc = first.location.replace(/https?:\/\/[^/]+/, '') || first.location
  const ok = first.status === 301 || first.status === 308
  const targetOk = loc === r.to || loc === `${r.to}/` || first.location.endsWith(r.to)
  const follow = await fetch(`${PROD}${r.from}`)
  legacyRedirects.push({ from: r.from, status: first.status, location: first.location, ok: ok && targetOk, followStatus: follow.status })
}

const domains = []
for (const url of domainChecks) {
  try {
    const first = await fetchRedirect(url)
    const follow = await fetch(url, { redirect: 'follow' })
    const finalUrl = follow.url
    domains.push({
      url,
      firstStatus: first.status,
      location: first.location,
      finalUrl,
      duplicate200: first.status === 200,
      redirectsToPrimary:
        finalUrl.startsWith('https://www.sultansomati.com.tr') ||
        first.location.includes('www.sultansomati.com.tr'),
      error: null,
    })
  } catch (e) {
    domains.push({ url, error: e.cause?.code ?? e.message, dnsFail: true })
  }
}

console.log(
  JSON.stringify({
    routeResults,
    konyaRawTitlePass: konyaPass,
    sitemap: { status: sitemap.status, pass: sitemap.status === 200 && sitemap.html.includes('sultansomati.com.tr') },
    robots: { status: robots.status, pass: robots.status === 200 && robots.html.toLowerCase().includes('sitemap') },
    legacyRedirects,
    domains,
    allPass: routeResults.every((r) => r.pass) && konyaPass && legacyRedirects.every((r) => r.ok),
  }, null, 2)
)
