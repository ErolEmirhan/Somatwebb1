import { menuPanels } from '../data/menuData.js'

/** Menüdeki tüm ürün adlarını düz liste olarak döner (analiz/rapor). */
export function listAllMenuItemNames() {
  const names = []
  for (const panel of menuPanels) {
    for (const section of panel.sections ?? []) {
      for (const item of section.items ?? []) {
        if (item?.name) names.push(item.name)
      }
    }
  }
  return names
}

/** Tam ürün adıyla menü kaydı (Firestore yazma yok). */
export function findMenuItemByName(name) {
  for (const panel of menuPanels) {
    for (const section of panel.sections ?? []) {
      for (const item of section.items ?? []) {
        if (item.name === name) {
          return { item, panel, sectionTitle: section.title }
        }
      }
    }
  }
  return null
}

export function findMenuPanelById(id) {
  return menuPanels.find((p) => p.id === id) ?? null
}
