import { chromium } from 'playwright'
const BASE = 'https://www.sultansomati.com.tr'

async function main() {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  const errors = []
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
  page.on('pageerror', (e) => errors.push(e.message))

  await page.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 120000 })
  await page.waitForTimeout(4000)
  const splash = await page.evaluate(() => document.body.innerText.includes('Sultan'))

  const menuLink = page.locator('a[href="/menu"]').first()
  if (await menuLink.count()) await menuLink.click()
  await page.waitForURL(/\/menu/, { timeout: 20000 }).catch(() => {})
  const spaNav = page.url().includes('/menu')

  await page.goto(BASE + '/menu', { waitUntil: 'networkidle', timeout: 120000 })
  await page.waitForTimeout(8000)
  const menuLoaded = await page.evaluate(() => document.body.innerText.length > 500)
  const rezOk = (await page.locator('a[href="/menu/order"], a[href*="menu/order"], a:has-text("Rezervasyon")').count()) > 0

  await page.goto(BASE + '/galeri', { waitUntil: 'networkidle', timeout: 120000 })
  const galeriOk = (await page.content()).length > 1000
  await page.goto(BASE + '/iletisim', { waitUntil: 'networkidle', timeout: 120000 })
  const iletisimOk = (await page.content()).length > 1000

  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const mp = await mobile.newPage()
  await mp.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 120000 })
  const mobileOk = await mp.evaluate(() => document.body.innerText.length > 200)

  await browser.close()
  const out = { splash, spaNav, menuLoaded, rezOk, galeriOk, iletisimOk, mobileOk, consoleErrors: errors, pass: spaNav && menuLoaded && rezOk && galeriOk && iletisimOk && mobileOk && errors.length === 0 }
  console.log(JSON.stringify(out, null, 2))
  process.exit(out.pass ? 0 : 1)
}
main().catch((e) => { console.error(e); process.exit(2) })
