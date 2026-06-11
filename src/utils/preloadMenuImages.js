import { getPanelCoverImage } from '../data/menuPanelCovers'
import { buildHomeMenuCategoryCards } from './homeMenuCategoryCards'

const inflight = new Map()

/**
 * Tarayıcı önbelleğine alır (http URL veya data URL).
 */
export function preloadImageSrc(src) {
  if (!src || typeof src !== 'string') return Promise.resolve()
  const key = src
  if (inflight.has(key)) return inflight.get(key)

  const promise = new Promise((resolve) => {
    const img = new Image()
    img.decoding = 'async'
    const done = () => resolve()
    img.onload = done
    img.onerror = done
    img.src = src
    if (img.complete) done()
  })

  inflight.set(key, promise)
  return promise
}

function collectPanelCoverUrls(panels) {
  if (!Array.isArray(panels)) return []
  const urls = new Set()
  for (const panel of panels) {
    const cover = getPanelCoverImage(panel)
    if (cover) urls.add(cover)
  }
  return [...urls]
}

function collectHomeCategoryCoverUrls(panels) {
  if (!Array.isArray(panels)) return []
  const urls = new Set()
  for (const card of buildHomeMenuCategoryCards(panels)) {
    if (card?.image) urls.add(card.image)
  }
  return [...urls]
}

/** Menü kategori kapakları + anasayfa kategori kartları */
export async function preloadMenuVisuals(panels) {
  const urls = new Set([
    ...collectPanelCoverUrls(panels),
    ...collectHomeCategoryCoverUrls(panels),
  ])
  if (urls.size === 0) return
  await Promise.allSettled([...urls].map((src) => preloadImageSrc(src)))
}
