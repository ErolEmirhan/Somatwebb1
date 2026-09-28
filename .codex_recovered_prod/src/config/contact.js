/** İletişim: telefon, Instagram, harita (tek kaynak) */

export const CONTACT_PHONE_DISPLAY = '0506 040 4200'
export const CONTACT_PHONE_TEL = 'tel:+905060404200'

export const CONTACT_INSTAGRAM_URL = 'https://www.instagram.com/sultansomati/'

export const CONTACT_MAP_LAT = 37.86803064687241
export const CONTACT_MAP_LNG = 32.50383058386916

/** Kısa adres satırı (tam sokak bilgisi yok; konum haritada) */
export const CONTACT_ADDRESS_LINE = 'Sultan Somatı · Konya'

/** Çalışma saatleri (footer, iletişim, rezervasyon) */
export const CONTACT_HOURS_WEEKDAY = 'Hafta içi: 11.00 – 21.30'
export const CONTACT_HOURS_WEEKEND = 'Hafta sonu: 10.00 – 21.30'

export function contactMapsSearchUrl() {
  return `https://www.google.com/maps/search/?api=1&query=${CONTACT_MAP_LAT},${CONTACT_MAP_LNG}`
}

export function contactMapsDirectionsUrl() {
  return `https://www.google.com/maps/dir/?api=1&destination=${CONTACT_MAP_LAT},${CONTACT_MAP_LNG}`
}

/** iframe embed (API anahtarı gerekmez) */
export function contactMapsEmbedUrl() {
  return `https://maps.google.com/maps?q=${CONTACT_MAP_LAT},${CONTACT_MAP_LNG}&hl=tr&z=17&output=embed`
}
