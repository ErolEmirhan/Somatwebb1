import { HERO_SECTION_BACKGROUNDS } from '../config/heroBackgrounds'
import { getPanelCoverImage } from '../data/menuPanelCovers'
import { buildHomeMenuCategoryCards } from '../utils/homeMenuCategoryCards'
import { preloadImages } from '../utils/preloadImages'
import { fetchMenuPanelsFromFirestore } from './menuFromFirestore'

let bootstrapPromise = null

function collectMenuVisualUrls(panels) {
  const urls = new Set(HERO_SECTION_BACKGROUNDS)

  for (const panel of panels) {
    const cover = getPanelCoverImage(panel)
    if (cover) urls.add(cover)
  }

  for (const card of buildHomeMenuCategoryCards(panels)) {
    if (card.image) urls.add(card.image)
  }

  return [...urls]
}

/**
 * Splash sırasında: Firestore menü + kategori/hero görsellerini önceden yükler.
 */
export function bootstrapMenuExperience() {
  if (bootstrapPromise) return bootstrapPromise

  bootstrapPromise = (async () => {
    const result = await fetchMenuPanelsFromFirestore()
    const panels = Array.isArray(result.panels) ? result.panels : []
    const urls = panels.length > 0 ? collectMenuVisualUrls(panels) : HERO_SECTION_BACKGROUNDS
    try {
      await preloadImages(urls)
    } catch {
      /* Görsel ön yükleme başarısız olsa da menü verisi kullanılabilir */
    }
    return result
  })()

  return bootstrapPromise
}
