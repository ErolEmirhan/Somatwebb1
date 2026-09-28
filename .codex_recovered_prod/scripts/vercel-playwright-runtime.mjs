/**
 * Playwright runtime audit on Vercel preview with protection bypass.
 * Bypass token extracted via vercel curl verbose (Deployment Protection).
 */
import { chromium } from 'playwright'
import { spawnSync } from 'node:child_process'

const BASE = 'https://somatwebb1-oubgg8mtu-asdasd-039804fe.vercel.app'
const ROUTES = ['/', '/konyada-ne-yenir', '/menu', '/hakkimizda', '/galeri', '/iletisim']

const EXPECTED = {
  '/': {
    title: 'Sultan Somatı | Selçuklu ve Mevlevi Mutfağı – Konya',
    canonical: 'https://www.sultansomati.com.tr/',
  },
  '/konyada-ne-yenir': {
    title: "Konya'da Ne Yenir? Konya'nın Yöresel Lezzetleri | Sultan Somatı",
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

function getBypassToken() {
  const r = spawnSync('npx', ['vercel', 'curl', `${BASE}/`, '--', '--verbose', '-o', 'NUL'], {
    encoding: 'utf8',
    maxBuffer: 5 * 1024 * 1024,
    shell: true,
  })
  const combined = `${r.stdout ?? ''}${r.stderr ?? ''}`
  const m = combined.match(/x-vercel-protection-bypass:\s*([^\s\r\n]+)/i)
  if (!m) throw new Error('Bypass token not found')
  return m[1]
}

async function main() {
  const bypass = getBypassToken()
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext()
  const page = await context.newPage()

  // Cookie tabanlı bypass — global header Firebase/font CORS'unu bozmaz
  await page.goto(
    `${BASE}/?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=${bypass}`,
    { waitUntil: 'domcontentloaded', timeout: 120000 }
  )
  const appConsoleErrors = []

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const t = msg.text()
      if (!t.includes('vercel.live') && !t.includes('GSI_LOGGER')) appConsoleErrors.push(t)
    }
  })
  page.on('pageerror', (err) => appConsoleErrors.push(err.message))

  const results = []
  for (const route of ROUTES) {
    const exp = EXPECTED[route]
    await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle', timeout: 120000 })
    await page.waitForFunction(
      () => document.querySelector('script[type="application/ld+json"]')?.textContent?.includes('Restaurant'),
      { timeout: 45000 }
    )
    const dom = await page.evaluate(() => ({
      canonicalCount: document.querySelectorAll('link[rel="canonical"]').length,
      canonicalUrl: document.querySelector('link[rel="canonical"]')?.href ?? '',
      title: document.querySelector('title')?.textContent?.trim() ?? '',
      jsonLdCount: document.querySelectorAll('script[type="application/ld+json"]').length,
    }))
    results.push({
      route,
      ...dom,
      pass:
        dom.canonicalCount === 1 &&
        dom.canonicalUrl === exp.canonical &&
        dom.title === exp.title &&
        dom.jsonLdCount === 1,
    })
  }

  await page.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: 120000 })
  await page.waitForTimeout(4000)
  const menuLink = page.locator('a[href="/menu"]').first()
  if (await menuLink.count()) await menuLink.click()
  await page.waitForURL(/\/menu/, { timeout: 20000 }).catch(() => {})
  const spaNavOk = page.url().includes('/menu')

  await page.goto(`${BASE}/menu`, { waitUntil: 'networkidle', timeout: 120000 })
  await page.waitForTimeout(8000)
  const menuLoaded = await page.evaluate(() => document.body.innerText.length > 500)
  const rezOk = (await page.locator('a[href="/menu/order"], a[href*="menu/order"], a:has-text("Rezervasyon")').count()) > 0

  await page.goto(`${BASE}/galeri`, { waitUntil: 'networkidle', timeout: 120000 })
  const galeriOk = (await page.content()).length > 1000
  await page.goto(`${BASE}/iletisim`, { waitUntil: 'networkidle', timeout: 120000 })
  const iletisimOk = (await page.content()).length > 1000

  const splashPage = await context.newPage()
  await splashPage.goto(`${BASE}/`, { waitUntil: 'domcontentloaded', timeout: 120000 })
  const splashVisible = await splashPage.evaluate(() => document.body.innerText.includes('Sultan'))
  await splashPage.close()

  await browser.close()

  const out = {
    results,
    consoleErrors: appConsoleErrors,
    smoke: { spaNavOk, menuLoaded, rezOk, galeriOk, iletisimOk, splashVisible },
    allPass:
      results.every((r) => r.pass) &&
      appConsoleErrors.length === 0 &&
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
