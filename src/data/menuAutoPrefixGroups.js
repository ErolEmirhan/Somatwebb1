/**
 * Firestore kategori adı (name/title) bu öneklerden biriyle başlıyorsa
 * ilgili mutfak panelinde toplanır; bölüm başlığı genelde önek sonrası metindir.
 * Sıra: önce daha uzun / özel önekler kontrol edilir.
 */
export const AUTO_PREFIX_PANEL_RULES = [
  {
    id: 'selcuklu-mevlevi',
    panelTitle: 'Selçuklu Mevlevi Mutfağı',
    order: 0,
    prefixes: ['Selçuklu Mevlevi Mutfağı', 'Selçuklu Mevlevi'],
  },
  {
    id: 'osmanli',
    panelTitle: 'Osmanlı Mutfağı',
    order: 1,
    prefixes: ['Osmanlı Mutfağı', 'Osmanli Mutfağı'],
  },
  {
    id: 'konya',
    panelTitle: 'Konya Mutfağı',
    order: 2,
    prefixes: ['Konya Mutfağı', 'Konya Mutfagi'],
  },
  {
    id: 'vejetaryen',
    panelTitle: 'Vejetaryen',
    order: 3,
    prefixes: ['Vejetaryen', 'Vejeteryan', 'vejeteryan'],
  },
  {
    id: 'vegan',
    panelTitle: 'Vegan',
    order: 4,
    prefixes: ['Vegan'],
  },
]

function normTr(s) {
  return String(s ?? '')
    .trim()
    .toLocaleLowerCase('tr-TR')
}

/**
 * @param {string} categoryTitle
 * @returns {{ rule: (typeof AUTO_PREFIX_PANEL_RULES)[0], matchedPrefix: string } | null}
 */
export function matchAutoPrefixGroup(categoryTitle) {
  const n = normTr(categoryTitle)
  if (!n) return null
  for (const rule of AUTO_PREFIX_PANEL_RULES) {
    for (const prefix of rule.prefixes) {
      const np = normTr(prefix)
      if (np && n.startsWith(np)) {
        return { rule, matchedPrefix: String(prefix).trim() }
      }
    }
  }
  return null
}

/**
 * Önek sonrası bölüm başlığı; panel başlığıyla aynıysa null (gereksiz tekrar gizlenir).
 */
export function deriveSectionTitle(categoryTitle, matchedPrefix, panelTitle) {
  const full = String(categoryTitle ?? '').trim()
  const p = String(matchedPrefix ?? '').trim()
  const pl = normTr(p)
  const fl = normTr(full)
  let rest = ''
  if (pl && fl.startsWith(pl)) {
    rest = full
      .slice(p.length)
      .trim()
      .replace(/^[\s\-–—:|/]+/, '')
      .trim()
  }
  const title = rest || full
  if (normTr(title) === normTr(panelTitle)) return null
  return title || null
}
