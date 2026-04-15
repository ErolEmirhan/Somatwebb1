/**
 * Menü ürünü `image` alanı:
 * - Tam data URL: "data:image/jpeg;base64,..."
 * - Ham base64 (JPEG varsayılan): "iVBORw0KGgo..." → data:image/jpeg;base64,...
 * - Normal URL: http(s)://...
 */
export function resolveMenuImageSrc(image) {
  if (image == null || typeof image !== 'string') return null
  const t = image.trim()
  if (!t) return null
  if (t.startsWith('data:')) return t
  if (t.startsWith('http://') || t.startsWith('https://')) return t
  return `data:image/jpeg;base64,${t}`
}
