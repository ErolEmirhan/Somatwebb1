import { useEffect, useMemo } from 'react'
import { useMenuPanels } from './useMenuPanels'
import {
  collectMenuProductImages,
  dedupeMenuProductImages,
} from '../utils/collectMenuProductImages'

/** Harici stok görsel kullanılmaz; yalnızca menüdeki ürün görselleri (base64 / data URL) kullanılır */
export const MENU_VISUAL_FALLBACK_URLS = []

/**
 * Firestore menüsünden (veya yerel menuData) ürün görselleri.
 * Uzaktan veri gelince liste güncellenir.
 */
export function useMenuProductImages() {
  const { panels, menuLoadError } = useMenuPanels()

  useEffect(() => {
    if (import.meta.env.PROD && menuLoadError) {
      console.warn('[Sultan Somatı] Firestore menü okunamadı, yerel menü kullanılıyor:', menuLoadError)
    }
  }, [menuLoadError])

  const entries = useMemo(
    () => dedupeMenuProductImages(collectMenuProductImages(panels)),
    [panels]
  )

  const galleryCategories = useMemo(() => {
    const base = [{ id: 'all', name: 'Tümü' }]
    const seen = new Set()
    for (const e of entries) {
      if (!e.panelId || seen.has(e.panelId)) continue
      seen.add(e.panelId)
      base.push({
        id: e.panelId,
        name: e.panelTitle || e.panelId,
      })
    }
    return base
  }, [entries])

  return {
    entries,
    galleryCategories,
    fallbacks: MENU_VISUAL_FALLBACK_URLS,
    panels,
  }
}
