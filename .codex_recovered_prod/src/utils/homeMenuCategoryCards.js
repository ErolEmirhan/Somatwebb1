import { getPanelCoverImage } from '../data/menuPanelCovers'

function normTr(s) {
  return String(s ?? '')
    .trim()
    .toLocaleLowerCase('tr-TR')
}

/**
 * Ana sayfa “Menü Kategorilerimiz” kartları: Firestore / yerel panellerden eşleşen kapak görselleri.
 */
export function buildHomeMenuCategoryCards(panels) {
  const list = Array.isArray(panels) ? panels : []

  const selPanel =
    list.find((p) => p.id === 'selcuklu-mevlevi') ||
    list.find((p) => {
      const t = normTr(p.title)
      return (
        (t.includes('selçuklu') || t.includes('selcuklu')) &&
        (t.includes('mevlevi') || t.includes('mevlevî'))
      )
    })

  const osmanPanel =
    list.find((p) => p.id === 'osmanli') ||
    list.find((p) => {
      const t = normTr(p.title)
      return t.includes('osmanlı mutfağı') || t.includes('osmanli mutfagi')
    })

  const salataTatliPanel =
    list.find((p) => p.id === 'salata-tatli') ||
    list.find((p) => {
      const t = normTr(p.title)
      return t.includes('tatlı') && t.includes('salata')
    })

  let tatliCover = null
  let tatliMenuAnchorId = 'salata-tatli'

  if (salataTatliPanel) {
    tatliMenuAnchorId = salataTatliPanel.id
    const tatliSection = salataTatliPanel.sections?.find((s) => {
      const st = normTr(s?.title ?? '')
      return st.includes('tatlı')
    })
    if (tatliSection?.items?.length) {
      tatliCover = getPanelCoverImage({
        id: 'home-tatli-card',
        title: 'Tatlılar',
        sections: [{ title: tatliSection.title, items: tatliSection.items }],
      })
    } else {
      tatliCover = getPanelCoverImage(salataTatliPanel)
    }
  } else {
    const onlyTatli = list.find((p) => {
      const t = normTr(p.title)
      return t.includes('tatlı') && !t.includes('salata')
    })
    if (onlyTatli) {
      tatliMenuAnchorId = onlyTatli.id
      tatliCover = getPanelCoverImage(onlyTatli)
    }
  }

  return [
    {
      key: 'selcuklu-mevlevi',
      title: 'Selçuklu & Mevlevi Mutfağı',
      description:
        'Selçuklu ve Mevlevi geleneğinden çorbalar, kalyeler ve güveçte pişen ana yemekler.',
      image: selPanel ? getPanelCoverImage(selPanel) : null,
      menuPanelId: selPanel?.id ?? 'selcuklu-mevlevi',
    },
    {
      key: 'osmanli',
      title: 'Osmanlı Mutfağı',
      description:
        'Saray mutfağının seçkin lezzetleri: börekler, sarmalar ve klasik ana yemekler.',
      image: osmanPanel ? getPanelCoverImage(osmanPanel) : null,
      menuPanelId: osmanPanel?.id ?? 'osmanli',
    },
    {
      key: 'tatlilar',
      title: 'Tatlılar',
      description: 'Helvalar, kabak tatlısı, sütlü tatlılar ve Maraş dondurması.',
      image: tatliCover,
      menuPanelId: tatliMenuAnchorId,
    },
  ]
}
