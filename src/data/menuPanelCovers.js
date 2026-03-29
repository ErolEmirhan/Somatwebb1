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
 * Kategori paneli arka planı: panel içi ürün fotoğrafı (ilk ürün hariç, mümkünse),
 * yoksa `coverImage`, sonra Unsplash.
 */
export const defaultPanelCover =
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80'

export const menuPanelCoverById = {
  'selcuklu-mevlevi':
    'https://images.unsplash.com/photo-1546549032-9571cd6ac27f?w=1920&q=80',
  osmanli:
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1920&q=80',
  konya:
    'https://images.unsplash.com/photo-1558030006-450675393462?w=1920&q=80',
  vejetaryen:
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1920&q=80',
  vegan:
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1920&q=80',
  kahvalti:
    'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=1920&q=80',
  'soguk-icecekler':
    'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=1920&q=80',
  'salata-tatli':
    'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=1920&q=80',
  'sicak-icecekler':
    'https://images.unsplash.com/photo-1495474473417-c4e71bf2b93f?w=1920&q=80',
  'cocuk-menu':
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1920&q=80',
}

export function getPanelCoverImage(panel) {
  const fromProduct = pickCoverProductImageFromPanel(panel)
  if (fromProduct) return fromProduct
  if (panel?.coverImage) return panel.coverImage
  return menuPanelCoverById[panel.id] || defaultPanelCover
}
