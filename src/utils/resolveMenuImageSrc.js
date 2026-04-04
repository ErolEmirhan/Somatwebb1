/**
 * Menü ürünü `image` alanı:
 * - Tam data URL: "data:image/png;base64,..."
 * - Ham base64: MIME imzasına göre png/jpeg/webp/gif (yalnızca jpeg varsayımı PNG’yi bozuyordu)
 * - URL: http(s)://...
 */
function stripDataUrlWhitespace(t) {
  const i = t.indexOf(',')
  if (i === -1) return t.trim()
  const head = t.slice(0, i + 1)
  const b64 = t.slice(i + 1).replace(/\s/g, '')
  return head + b64
}

/** Ham base64 (data: öneki yok) — tip imzası */
function rawBase64ToDataUrl(s) {
  if (!s) return null
  if (s.startsWith('iVBORw0KGgo')) return `data:image/png;base64,${s}`
  if (s.startsWith('/9j/')) return `data:image/jpeg;base64,${s}`
  if (s.startsWith('R0lGOD')) return `data:image/gif;base64,${s}`
  if (s.startsWith('UklGR')) return `data:image/webp;base64,${s}`
  if (s.startsWith('Qk')) return `data:image/bmp;base64,${s}`
  return `data:image/jpeg;base64,${s}`
}

export function resolveMenuImageSrc(image) {
  if (image == null) return null
  if (typeof image !== 'string') {
    const s = String(image).trim()
    return s ? resolveMenuImageSrc(s) : null
  }
  let t = image.trim()
  if (!t) return null

  if (t.startsWith('data:')) {
    return stripDataUrlWhitespace(t)
  }
  if (t.startsWith('http://') || t.startsWith('https://')) return t

  const s = t.replace(/\s/g, '')
  if (!s) return null
  return rawBase64ToDataUrl(s)
}
