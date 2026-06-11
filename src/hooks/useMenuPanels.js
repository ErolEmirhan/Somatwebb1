import { useState, useEffect } from 'react'
import {
  fetchMenuPanelsFromFirestore,
  getInitialMenuPanels,
} from '../services/menuFromFirestore'

/**
 * Menü panelleri: yerel / önbellek verisi anında, Firestore arka planda günceller.
 */
export function useMenuPanels() {
  const [panels, setPanels] = useState(getInitialMenuPanels)
  const [menuLoadError, setMenuLoadError] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(true)

  useEffect(() => {
    let cancelled = false
    setIsRefreshing(true)

    fetchMenuPanelsFromFirestore().then((r) => {
      if (cancelled) return
      if (Array.isArray(r.panels) && r.panels.length > 0) {
        setPanels(r.panels)
      }
      setMenuLoadError(r.error)
      setIsRefreshing(false)
    })

    return () => {
      cancelled = true
    }
  }, [])

  return { panels, menuLoadError, isRefreshing }
}
