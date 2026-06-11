import { fetchMenuPanelsFromFirestore } from './menuFromFirestore'

let bootstrapPromise = null

/**
 * Site açılışında (splash dahil) arka planda menü verisi + kategori görselleri.
 * Tekrar çağrılar aynı promise'i paylaşır.
 */
export function bootstrapMenuExperience() {
  if (!bootstrapPromise) {
    bootstrapPromise = fetchMenuPanelsFromFirestore().catch((err) => {
      bootstrapPromise = null
      throw err
    })
  }
  return bootstrapPromise
}
