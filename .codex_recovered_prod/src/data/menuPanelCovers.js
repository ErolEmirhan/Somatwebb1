import { resolveMenuImageSrc } from '../utils/resolveMenuImageSrc'

function simpleHash(str) {
  const s = String(str ?? '')
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

/**
 * Kapak görseli: menüdeki ilk ürünün fotoğrafı kullanılmaz (başka görseller varsa).
 * Adaylar arasından panel `id` ile tutarlı bir indeks seçilir; yalnızca ilk üründe
 * görsel varsa yine o kullanılır.
 */
function pickCoverProductImageFromPanel(panel) {
  /** @type {{ menuIndex: number, url: string }[]} */
  const withImg = []
  let menuIndex = 0
  const sections = panel?.sections
  if (!Array.isArray(sections)) return null

  for (const sec of sections) {
    const items = sec?.items
    if (!Array.isArray(items)) continue
    for (const item of items) {
      const src = resolveMenuImageSrc(item?.image)
      if (src) withImg.push({ menuIndex, url: src })
      menuIndex++
    }
  }

  if (withImg.length === 0) return null

  let candidates = withImg.filter((x) => x.menuIndex !== 0)
  if (candidates.length === 0) candidates = withImg

  const h = simpleHash(panel?.id ?? panel?.title ?? '')
  return candidates[h % candidates.length].url
}

/**
 * Kategori paneli arka planı: önce panel içi ürün fotoğrafı (ilk ürün hariç, mümkünse),
 * yoksa panel `coverImage`. Harici stok görsel kullanılmaz.
 */
export const defaultPanelCover = null

export const menuPanelCoverById = {}

export function getPanelCoverImage(panel) {
  const fromProduct = pickCoverProductImageFromPanel(panel)
  if (fromProduct) return fromProduct
  if (panel?.coverImage) return panel.coverImage
  return null
}
