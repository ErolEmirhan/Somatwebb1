/**
 * SEO audit — RAW HTTP + optional Playwright runtime.
 * Önce: npm run build && npx vite preview --port 4173
 * Sonra: npm run seo:audit
 */
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PAGE_SEO, SITE_URL } from '../src/seo.config.js'
import { SEO_PAGES } from '../src/content/seoPages.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const BASE = process.env.SEO_AUDIT_BASE ?? 'http://127.0.0.1:4173'

const INDEXABLE_ROUTES = Object.keys(PAGE_SEO).filter((p) => p !== '/menu/order')

function parseRawHtml(html) {
  const titleMatches = [...html.matchAll(/<title[^>]*>([^<]*)<\/title>/gi)]
  const titles = titleMatches.map((m) => m[1]?.trim() ?? '')
  const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content="([^"]*)"/i)
  const description = descMatch?.[1] ?? ''
  const canonMatches = [...html.matchAll(/<link[^>]+rel=["']canonical["'][^>]*>/gi)]
  const canonicalUrls = canonMatches.map((m) => {
    const href = m[0].match(/href=["']([^"']*)["']/i)
    return href?.[1] ?? ''
  })
  const robotsMatch = html.match(/<meta[^>]+name=["']robots["'][^>]+content="([^"]*)"/i)
  const robots = robotsMatch?.[1] ?? ''
  const ogTitleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content="([^"]*)"/i)
  const ogUrlMatch = html.match(/<meta[^>]+property=["']og:url["'][^>]+content="([^"]*)"/i)
  const h1Matches = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)]
  const h1Texts = h1Matches.map((m) => m[1].replace(/<[^>]+>/g, '').trim())

  const jsonLdMatches = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
  let restaurantLd = false
  let breadcrumbLd = false
  let jsonLdParseOk = true
  for (const m of jsonLdMatches) {
    try {
      const data = JSON.parse(m[1])
      const graph = data['@graph'] ?? [data]
      for (const node of graph) {
        if (node['@type'] === 'Restaurant') restaurantLd = true
        if (node['@type'] === 'BreadcrumbList') breadcrumbLd = true
      }
    } catch {
      jsonLdParseOk = false
    }
  }

  const internalLinks = [...html.matchAll(/href=["'](\/[^"'#?]*)/gi)].map((m) => m[1])

  return {
    title: titles[0] ?? '',
    titleCount: titles.length,
    description,
    canonicalCount: canonicalUrls.length,
    canonicalUrl: canonicalUrls[0] ?? '',
    robots,
    ogTitle: ogTitleMatch?.[1] ?? '',
    ogUrl: ogUrlMatch?.[1] ?? '',
    h1Count: h1Texts.length,
    h1: h1Texts[0] ?? '',
    jsonLdCount: jsonLdMatches.length,
    jsonLdParseOk,
    restaurantLd,
    breadcrumbLd,
    internalLinks,
  }
}

function buildExpectedIncomingLinks() {
  const incoming = new Map(INDEXABLE_ROUTES.map((r) => [r, new Set()]))
  const footerTargets = ['/', '/konyada-ne-yenir', '/hakkimizda', '/galeri', '/menu', '/iletisim']

  for (const from of INDEXABLE_ROUTES) {
    for (const target of footerTargets) {
      if (from !== target) incoming.get(target).add(from)
    }
    incoming.get('/konyada-ne-yenir').add('/')
  }

  for (const page of SEO_PAGES) {
    const path = `/${page.slug}`
    for (const slug of page.relatedSlugs ?? []) {
      incoming.get(`/${slug}`).add(path)
    }
    if (page.slug !== 'konyada-ne-yenir') {
      incoming.get('/konyada-ne-yenir').add(path)
    }
  }

  for (const page of SEO_PAGES) {
    if (page.menuItemName || page.menuPanelId) {
      incoming.get('/menu').add(`/${page.slug}`)
    }
  }

  return incoming
}

function loadSitemapPaths() {
  try {
    const xml = readFileSync(join(root, 'public', 'sitemap.xml'), 'utf8')
    return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => {
      const url = m[1]
      return url.replace(SITE_URL, '') || '/'
    })
  } catch {
    return []
  }
}

async function fetchRoute(path) {
  const res = await fetch(`${BASE}${path}`, { redirect: 'manual' })
  const html = res.status === 200 ? await res.text() : ''
  return { status: res.status, html }
}

async function auditRaw() {
  const results = []
  const titles = new Map()
  const descriptions = new Map()
  const h1s = new Map()
  const canonicals = new Map()
  const sitemapPaths = loadSitemapPaths()
  const expectedIncoming = buildExpectedIncomingLinks()

  for (const route of INDEXABLE_ROUTES) {
    const exp = PAGE_SEO[route]
    const { status, html } = await fetchRoute(route)
    const parsed = parseRawHtml(html)

    const fails = []
    if (status !== 200) fails.push(`HTTP ${status}`)
    if (parsed.title !== exp.title) fails.push('title mismatch')
    if (parsed.titleCount !== 1) fails.push(`title count ${parsed.titleCount}`)
    if (parsed.canonicalCount !== 1) fails.push(`canonical count ${parsed.canonicalCount}`)
    if (parsed.canonicalUrl !== exp.canonical) fails.push('canonical mismatch')
    if (parsed.description !== exp.description) fails.push('description mismatch')
    if (parsed.ogTitle !== exp.title) fails.push('og:title mismatch')
    if (parsed.ogUrl !== exp.canonical) fails.push('og:url mismatch')
    if (!parsed.jsonLdParseOk) fails.push('JSON-LD parse error')
    if (!parsed.restaurantLd) fails.push('Restaurant JSON-LD missing')
    if (exp.breadcrumbs?.length && !parsed.breadcrumbLd) {
      fails.push('Breadcrumb JSON-LD missing')
    }
    if (!sitemapPaths.includes(route)) fails.push('not in sitemap')

    const track = (map, key, route) => {
      if (!key) return
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(route)
    }
    track(titles, parsed.title, route)
    track(descriptions, parsed.description, route)
    track(h1s, parsed.h1, route)
    track(canonicals, parsed.canonicalUrl, route)

    results.push({
      route,
      http: status,
      pass: fails.length === 0,
      fails,
      title: parsed.title,
      canonical: parsed.canonicalUrl,
      h1: parsed.h1,
      incomingLinkSources: [...expectedIncoming.get(route) ?? []],
    })
  }

  const duplicates = {
    title: [...titles.entries()].filter(([, routes]) => routes.length > 1),
    description: [...descriptions.entries()].filter(([, routes]) => routes.length > 1),
    h1: [...h1s.entries()].filter(([, routes]) => routes.length > 1),
    canonical: [...canonicals.entries()].filter(([, routes]) => routes.length > 1),
  }

  const orphans = INDEXABLE_ROUTES.filter((route) => {
    if (route === '/') return false
    const sources = expectedIncoming.get(route) ?? new Set()
    return sources.size === 0
  })

  return { results, duplicates, orphans, sitemapPaths }
}

async function auditBrowser() {
  let chromium
  try {
    ({ chromium } = await import('playwright'))
  } catch {
    console.log('[seo:audit] Playwright yüklü değil — yalnızca RAW HTTP audit')
    return null
  }

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  const runtimeResults = []

  for (const route of INDEXABLE_ROUTES) {
    const exp = PAGE_SEO[route]
    const consoleErrors = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })
    page.on('pageerror', (err) => consoleErrors.push(err.message))

    await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded', timeout: 60000 })
    await page.waitForFunction(
      () => !document.querySelector('.fixed.inset-0.z-\\[9999\\]'),
      { timeout: 15000 }
    )

    const dom = await page.evaluate(() => {
      const canonicals = [...document.querySelectorAll('link[rel="canonical"]')].map((l) => l.href)
      const titles = [...document.querySelectorAll('title')].map((t) => t.textContent?.trim() ?? '')
      const h1s = [...document.querySelectorAll('h1')].map((h) => h.textContent?.trim() ?? '')
      const jsonLdCount = document.querySelectorAll('script[type="application/ld+json"]').length
      let breadcrumbLd = false
      for (const el of document.querySelectorAll('script[type="application/ld+json"]')) {
        try {
          const data = JSON.parse(el.textContent)
          const graph = data['@graph'] ?? [data]
          if (graph.some((n) => n['@type'] === 'BreadcrumbList')) breadcrumbLd = true
        } catch {
          /* skip */
        }
      }
      return {
        canonicalCount: canonicals.length,
        canonicalUrl: canonicals[0] ?? '',
        title: titles[0] ?? '',
        titleCount: titles.length,
        h1: h1s[0] ?? '',
        h1Count: h1s.length,
        jsonLdCount,
        breadcrumbLd,
      }
    })

    const expectedH1 = SEO_PAGES.find((p) => `/${p.slug}` === route)?.h1
    const requiresH1 = expectedH1 || route === '/' || route === '/menu'

    const fails = []
    if (dom.canonicalCount !== 1) fails.push(`canonical count ${dom.canonicalCount}`)
    if (dom.canonicalUrl !== exp.canonical) fails.push('canonical mismatch')
    if (dom.title !== exp.title) fails.push('title mismatch')
    if (dom.titleCount !== 1) fails.push(`title count ${dom.titleCount}`)
    if (requiresH1 && dom.h1Count !== 1) fails.push(`h1 count ${dom.h1Count}`)
    if (expectedH1 && dom.h1 !== expectedH1) fails.push('h1 mismatch')
    if (dom.jsonLdCount !== 1) fails.push(`jsonLd count ${dom.jsonLdCount}`)
    if (exp.breadcrumbs?.length && !dom.breadcrumbLd) fails.push('Breadcrumb JSON-LD missing')
    if (consoleErrors.length > 0) fails.push(`console errors: ${consoleErrors.length}`)

    runtimeResults.push({
      route,
      pass: fails.length === 0,
      fails,
      consoleErrors,
    })
  }

  await browser.close()
  return runtimeResults
}

async function main() {
  const { results, duplicates, orphans, sitemapPaths } = await auditRaw()
  const runtimeResults = await auditBrowser()

  console.log('=== RAW HTTP SEO AUDIT ===')
  console.log(JSON.stringify(results, null, 2))
  console.log('\n=== DUPLICATE REPORT ===')
  console.log(JSON.stringify(duplicates, null, 2))
  console.log('\n=== ORPHAN REPORT (config graph) ===')
  console.log(JSON.stringify(orphans, null, 2))
  console.log(`\nSitemap URLs: ${sitemapPaths.length}`)

  if (runtimeResults) {
    console.log('\n=== BROWSER RUNTIME AUDIT ===')
    console.log(JSON.stringify(runtimeResults, null, 2))
  }

  const rawPass = results.every((r) => r.pass)
  const dupPass =
    duplicates.title.length === 0 &&
    duplicates.description.length === 0 &&
    duplicates.h1.length === 0 &&
    duplicates.canonical.length === 0
  const orphanPass = orphans.length === 0
  const runtimePass = !runtimeResults || runtimeResults.every((r) => r.pass)

  const allPass = rawPass && dupPass && orphanPass && runtimePass
  if (!allPass) {
    console.error('\n[seo:audit] FAIL — build/deploy önerilmez')
    process.exit(1)
  }
  console.log('\n[seo:audit] PASS')
}

main().catch((e) => {
  console.error(e)
  process.exit(2)
})
