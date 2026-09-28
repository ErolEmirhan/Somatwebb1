/**
 * Sultan Somatı – SEO (canonical domain: www.sultansomati.com.tr)
 * Kurallar: başlık/açıklamada "Somatçı" yok; menüde olmayan ürün adı (ör. fırın kebabı) yok.
 */
import { BRAND, BRAND_LOGO_PATH } from './config/brand.js'
import { buildSeoPageMeta, getIndexablePaths } from './content/seoPages.js'

import { SITE_URL } from './config/siteUrl.js'

export { SITE_URL }

export const BRAND_SEO = BRAND

export const DEFAULT_OG_IMAGE = `${SITE_URL}${BRAND_LOGO_PATH}`

export const DEFAULT_META = {
  title: `${BRAND.name} | Selçuklu ve Mevlevi Mutfağı – Konya`,
  description:
    'Konya\'da Selçuklu, Mevlevi ve Osmanlı tarihi mutfağından seçkiler. Menü, rezervasyon ve yöresel lezzet deneyimi için Sultan Somatı.',
  canonical: `${SITE_URL}/`,
}

export const PAGE_SEO = {
  '/': DEFAULT_META,
  '/konyada-ne-yenir': {
    title: "Konya'da Ne Yenir? Konya'nın Yöresel Lezzetleri | Sultan Somatı",
    description:
      "Konya'da ne yenir, yöresel ve geleneksel lezzetler, Selçuklu ve Mevlevi mutfağı rehberi. Sultan Somatı menü ve rezervasyon.",
    canonical: `${SITE_URL}/konyada-ne-yenir`,
  },
  '/hakkimizda': {
    title: `Hakkımızda | ${BRAND.name} – Konya`,
    description: `${BRAND.name} hikayesi: Selçuklu, Mevlevi, Osmanlı ve Konya mutfak geleneği. Değerlerimiz ve yolculuğumuz.`,
    canonical: `${SITE_URL}/hakkimizda`,
  },
  '/galeri': {
    title: `Galeri | ${BRAND.name} – Yemek ve Mekan Görselleri`,
    description: `${BRAND.name} menü ürün görselleri ve mekan fotoğrafları. Konya restoran galerisi.`,
    canonical: `${SITE_URL}/galeri`,
  },
  '/menu': {
    title: `Menü | ${BRAND.name} – Konya'da Yenilecek En Güzel Yemekler`,
    description:
      "Konya'da yenilecek en güzel yemekler: Selçuklu, Mevlevi, Osmanlı ve Konya mutfağından çorbalar, ana yemekler, içecekler ve tatlılar. Güncel menü ve fiyatlar.",
    canonical: `${SITE_URL}/menu`,
  },
  '/menu/order': {
    title: `Rezervasyon | ${BRAND.name} – Konya`,
    description: `${BRAND.name} rezervasyon ve iletişim. Telefon ile rezervasyon yapın.`,
    canonical: `${SITE_URL}/menu/order`,
  },
  '/iletisim': {
    title: `İletişim ve Adres | ${BRAND.name} – Konya`,
    description: `${BRAND.name} telefon, adres, çalışma saatleri ve harita. Konya restoran iletişim bilgileri.`,
    canonical: `${SITE_URL}/iletisim`,
  },
  ...buildSeoPageMeta(),
}

/** Sitemap ve indexlenebilir primary URL listesi */
export const SITEMAP_PATHS = getIndexablePaths()
