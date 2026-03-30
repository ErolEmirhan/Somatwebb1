import { useState, useEffect, useMemo } from 'react'
import { menuPanels as localMenuPanels } from '../data/menuData'
import { fetchMenuPanelsFromFirestore } from '../services/menuFromFirestore'
import {
  collectMenuProductImages,
  dedupeMenuProductImages,
  padImageSources,
} from '../utils/collectMenuProductImages'

/** Menüde görsel yokken hero / galeri için yedek (önceki site görselleri) */
export const MENU_VISUAL_FALLBACK_URLS = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&q=80',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80',
  'https://images.unsplash.com/photo-1550966871-356eddb7dc26?w=1920&q=80',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&q=80',
  'https://images.unsplash.com/photo-1558030006-450675393462?w=1200&q=80',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&q=80',
  'https://images.unsplash.com/photo-1563729784474-5c2cbb1f67b2?w=1200&q=80',
  'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80',
  'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=1200&q=80',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1200&q=80',
]

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

  const heroUrls = useMemo(
    () =>
      padImageSources(
        entries.map((e) => e.src),
        4,
        MENU_VISUAL_FALLBACK_URLS
      ),
    [entries]
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

  return { entries, heroUrls, galleryCategories, fallbacks: MENU_VISUAL_FALLBACK_URLS }
}
