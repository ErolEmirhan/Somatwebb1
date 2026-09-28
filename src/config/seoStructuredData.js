import { BRAND, BRAND_LOGO_PATH } from './brand.js'
import {
  CONTACT_PHONE_TEL,
  CONTACT_MAP_LAT,
  CONTACT_MAP_LNG,
  CONTACT_INSTAGRAM_URL,
} from './contact.js'
import { SITE_URL } from './siteUrl.js'
import { RESTAURANT_ENTITY_ID } from '../content/seoPages.js'

/**
 * Schema.org Restaurant — yalnızca sitede doğrulanabilir alanlar.
 * Sokak adresi ve fiyat aralığı kaynakta yok; eklenmedi.
 */
export function buildRestaurantJsonLd() {
  const telephone = CONTACT_PHONE_TEL.replace(/^tel:/i, '')

  return {
    '@type': 'Restaurant',
    '@id': RESTAURANT_ENTITY_ID,
    name: BRAND.name,
    legalName: BRAND.legalName,
    url: SITE_URL,
    image: `${SITE_URL}${BRAND_LOGO_PATH}`,
    logo: `${SITE_URL}${BRAND_LOGO_PATH}`,
    telephone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Konya',
      addressCountry: 'TR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: CONTACT_MAP_LAT,
      longitude: CONTACT_MAP_LNG,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '11:00',
        closes: '21:30',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday'],
        opens: '10:00',
        closes: '21:30',
      },
    ],
    servesCuisine: [
      'Turkish',
      'Selçuklu mutfağı',
      'Mevlevi mutfağı',
      'Osmanlı mutfağı',
      'Konya mutfağı',
    ],
    menu: `${SITE_URL}/menu`,
    sameAs: [CONTACT_INSTAGRAM_URL],
  }
}

/** BreadcrumbList — breadcrumbs: [{ label, path }] */
export function buildBreadcrumbJsonLd(breadcrumbs) {
  if (!breadcrumbs?.length) return null

  return {
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `${SITE_URL}${item.path === '/' ? '/' : item.path}`,
    })),
  }
}

/** Tek script etiketi için Restaurant + isteğe bağlı BreadcrumbList */
export function buildPageJsonLd(breadcrumbs) {
  const graph = [buildRestaurantJsonLd()]
  const breadcrumb = buildBreadcrumbJsonLd(breadcrumbs)
  if (breadcrumb) graph.push(breadcrumb)

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  }
}
