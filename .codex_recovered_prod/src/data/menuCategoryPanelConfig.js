/**
 * İsteğe bağlı manuel gruplama: `categoryKeys` doluysa bu gruplar (otomatik önekten sonra)
 * uygulanır.
 *
 * Selçuklu / Osmanlı / Konya / Vejetaryen / Vegan için önek eşlemesi:
 * `menuAutoPrefixGroups.js` — kategori adı "Konya Mutfağı …" gibi başlıyorsa tek panelde birleşir.
 */
export const MENU_PANEL_GROUPS = []

/**
 * Firestore `panelGroup` + `panelTitle` yoksa: grup anahtarı → panel başlığı
 */
export const PANEL_GROUP_TITLES = {
  selcuklu: 'Selçuklu Mevlevi Mutfağı',
  'selcuklu-mevlevi': 'Selçuklu Mevlevi Mutfağı',
  osmanli: 'Osmanlı Mutfağı',
  konya: 'Konya Mutfağı',
  vejetaryen: 'Vejetaryen',
  vegan: 'Vegan',
}
