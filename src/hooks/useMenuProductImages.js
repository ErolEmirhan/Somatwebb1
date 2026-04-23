import { useState, useEffect, useMemo } from 'react'
import { menuPanels as localMenuPanels } from '../data/menuData'
import { fetchMenuPanelsFromFirestore } from '../services/menuFromFirestore'
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
  const [panels, setPanels] = useState(localMenuPanels)

  useEffect(() => {
    let cancelled = false
    fetchMenuPanelsFromFirestore().then((r) => {
      if (cancelled) return
      if (import.meta.env.PROD && r.error) {
        console.warn('[Sultan Somatı] Firestore menü okunamadı, yerel menü kullanılıyor:', r.error)
      }
      if (Array.isArray(r.panels) && r.panels.length > 0) setPanels(r.panels)
    })
    return () => {
      cancelled = true
    }
  }, [])

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
