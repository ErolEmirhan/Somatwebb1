/**
 * Sultan Somatı – SEO
 */
import { BRAND, BRAND_LOGO_PATH } from './config/brand'

export const SITE_URL = 'https://somatweb.com'

export const BRAND_SEO = BRAND

export const DEFAULT_OG_IMAGE = `${SITE_URL}${BRAND_LOGO_PATH}`

export const DEFAULT_META = {
  title: `${BRAND.name} | Tarihi Türk Mutfağı`,
  description: `${BRAND.name} — ${BRAND.tagline} Menü, rezervasyon ve iletişim.`,
  canonical: `${SITE_URL}/menu`,
}

export const PAGE_SEO = {
  '/anasayfa': {
    title: `${BRAND.name} | Tarihi Türk Mutfağı`,
    description: `${BRAND.name} — ${BRAND.tagline} Menü, rezervasyon ve iletişim.`,
    canonical: `${SITE_URL}/anasayfa`,
  },
  '/hakkimizda': {
    title: `Hakkımızda | ${BRAND.name}`,
    description: `${BRAND.name} hikayesi ve değerlerimiz. Tarihi mutfak geleneği ve özenli sunum.`,
    canonical: `${SITE_URL}/hakkimizda`,
  },
  '/galeri': {
    title: `Galeri | ${BRAND.name}`,
    description: `${BRAND.name} yemek ve mekan görselleri.`,
    canonical: `${SITE_URL}/galeri`,
  },
  '/menu': {
    title: `Menü | ${BRAND.name}`,
    description: `${BRAND.name} menü ve fiyat listesi. Tarihi mutfaklardan çorbalar, ana yemekler, içecekler ve tatlılar.`,
    canonical: `${SITE_URL}/menu`,
  },
  '/menu/order': {
    title: `Rezervasyon & Sipariş | ${BRAND.name}`,
    description: `${BRAND.name} rezervasyon ve sipariş. Bizi arayın veya iletişime geçin.`,
    canonical: `${SITE_URL}/menu/order`,
  },
  '/iletisim': {
    title: `İletişim | ${BRAND.name}`,
    description: `${BRAND.name} iletişim bilgileri, adres ve çalışma saatleri.`,
    canonical: `${SITE_URL}/iletisim`,
  },
}
