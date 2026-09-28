import { resolveMenuImageSrc } from './resolveMenuImageSrc'

/**
 * Panellerdeki ürünlerden geçerli görsel URL/data URL listesi (sıra: menü sırası).
 * @returns {{ src: string, title: string, panelId: string, panelTitle: string, sectionTitle: string | null }[]}
 */
export function collectMenuProductImages(panels) {
  if (!Array.isArray(panels)) return []
  const out = []
  for (const panel of panels) {
    const sections = panel?.sections
    if (!Array.isArray(sections)) continue
    for (const sec of sections) {
      const items = sec?.items
      if (!Array.isArray(items)) continue
      const sectionTitle = sec?.title ?? null
      for (const item of items) {
        const src = resolveMenuImageSrc(item?.image)
        if (!src) continue
        out.push({
          src,
          title: item.name ?? 'Ürün',
          panelId: String(panel.id ?? ''),
          panelTitle: panel.title ?? '',
          sectionTitle,
        })
      }
    }
  }
  return out
}

/** Aynı src tekrarlarını atla; sırayı koru */
export function dedupeMenuProductImages(entries) {
  const seen = new Set()
  return entries.filter((e) => {
    if (seen.has(e.src)) return false
    seen.add(e.src)
    return true
  })
}

/** Yetersiz uzunlukta listeyi tamamlar (aynı src eklenmez) */
export function padImageSources(primary, targetLength, fallbacks) {
  const out = []
  const seen = new Set()
  for (const u of primary) {
    if (seen.has(u)) continue
    seen.add(u)
    out.push(u)
    if (out.length >= targetLength) return out
  }
  for (const u of fallbacks) {
    if (seen.has(u)) continue
    seen.add(u)
    out.push(u)
    if (out.length >= targetLength) return out
  }
  return out
}
