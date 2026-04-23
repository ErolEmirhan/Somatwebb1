/**
 * Menü metinlerinden "limon sosu" ifadesini kaldırır (Firestore eski kayıtları dahil).
 * "Limon suyu" vb. ifadelere dokunulmaz (sadece tam "limon" + ayraç + "sosu").
 */

export function isSalatalarSectionTitle(sectionTitle) {
  if (sectionTitle == null || sectionTitle === '') return false
  const t = String(sectionTitle).trim().replace(/\s+/g, ' ').toLocaleLowerCase('tr-TR')
  return t === 'salatalar'
}

/**
 * Firestore bazen bölüm başlığını göndermez veya panel id yerel şemadan farklıdır;
 * metin düzeltmesi panel eşlemesine bağlı kalmamalı — bkz. stripLimonSosuFromSaladDescription.
 */
export function shouldSanitizeSaladProductDescription(sectionTitle, panelId, sectionIndex) {
  if (isSalatalarSectionTitle(sectionTitle)) return true
  const pid = String(panelId ?? '').trim()
  if (pid === 'salata-tatli' && sectionIndex === 0) return true
  const norm = String(sectionTitle ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase('tr-TR')
  if (norm.includes('salatalar') && !norm.includes('tatlı')) return true
  return false
}

/**
 * @param {string} text
 * @returns {string}
 */
export function stripLimonSosuFromSaladDescription(text) {
  if (typeof text !== 'string') return text
  let t = text.normalize('NFC').trim()
  if (!t) return text

  // space: normal, NBSP, dar boşluk — \b kullanmıyoruz (Türkçe harflerde sorun çıkarıyor)
  const gap = '[\\s\\u00a0\\u202f]'

  // Virgüllü / bitişik "zeytinyağı … limon sosu" (mobil / Firestore metni)
  t = t.replace(new RegExp(`zeytinyağı${gap}*,${gap}*limon${gap}+sosu`, 'giu'), 'zeytinyağı')
  t = t.replace(new RegExp(`zeytinyağı${gap}+limon${gap}+sosu`, 'giu'), 'zeytinyağı')

  t = t.replace(new RegExp(`,${gap}*limon${gap}+sosu`, 'giu'), '')
  t = t.replace(new RegExp(`limon${gap}+sosu${gap}*,`, 'giu'), '')
  t = t.replace(new RegExp(`${gap}+limon${gap}+sosu`, 'giu'), ' ')
  t = t.replace(new RegExp(`limon${gap}+sosu`, 'giu'), '')

  t = t.replace(/,\s*,+/g, ',')
  t = t.replace(/\s{2,}/g, ' ')
  t = t.replace(/\s+,/g, ',')
  t = t.replace(/^,\s*|,\s*$/g, '')
  return t.trim()
}

/**
 * Menü satırı ve önizlemede kullanım.
 * Panel id Firestore'da farklı olsa bile çalışması için her zaman temizlik uygulanır
 * (yalnızca "limon sosu"; "limon suyu" korunur).
 */
/** Çağıran bileşenlerle uyum için ek parametreler korunur; temizlik her açıklamada uygulanır. */
export function formatMenuProductDescription(description, _sectionTitle, _panelId, _sectionIndex = 0) {
  if (description == null || description === '') return description
  return stripLimonSosuFromSaladDescription(description)
}

/**
 * Firestore panel listesi yüklendiğinde ürün açıklamalarını normalize eder.
 */
export function sanitizeMenuPanelsForSaladDescriptions(panels) {
  if (!Array.isArray(panels)) return panels
  return panels.map((panel) => ({
    ...panel,
    sections: Array.isArray(panel.sections)
      ? panel.sections.map((sec) => {
          if (!Array.isArray(sec.items)) return sec
          return {
            ...sec,
            items: sec.items.map((it) => {
              if (!it?.description) return it
              const next = stripLimonSosuFromSaladDescription(it.description)
              if (!next) {
                const { description: _d, ...rest } = it
                return rest
              }
              return { ...it, description: next }
            }),
          }
        })
      : panel.sections,
  }))
}
