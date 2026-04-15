import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'
import { menuPanels as localMenuPanels } from '../data/menuData'
import {
  MENU_PANEL_GROUPS,
  PANEL_GROUP_TITLES,
} from '../data/menuCategoryPanelConfig'
import {
  AUTO_PREFIX_PANEL_RULES,
  matchAutoPrefixGroup,
  deriveSectionTitle,
} from '../data/menuAutoPrefixGroups'

const CATEGORIES_COLLECTION =
  import.meta.env.VITE_FIREBASE_CATEGORIES_COLLECTION || 'categories'
const PRODUCTS_COLLECTION =
  import.meta.env.VITE_FIREBASE_PRODUCTS_COLLECTION || 'products'

const PANELS_COLLECTION =
  import.meta.env.VITE_FIREBASE_MENU_PANELS_COLLECTION || 'menu_panels'

/** Tek belge: örn. `config/menu` — alan: `panels` (dizi) */
const MENU_ROOT_DOC = import.meta.env.VITE_FIREBASE_MENU_ROOT_DOC?.trim() || ''

function str(v) {
  if (v == null) return ''
  return String(v).trim()
}

/** Menü sayfasında gösterilmeyecek paneller (ör. ekstra / hediyelik satış kategorisi). */
function shouldHideMenuPanel(panel) {
  const title = str(panel?.title).toLocaleLowerCase('tr-TR')
  if (
    title.includes('ekstralar') ||
    title.includes('ekstra (') ||
    title.includes('ekstra ')
  ) {
    return true
  }
  const id = str(panel?.id).toLowerCase()
  if (id.includes('ekstralar') || id.includes('ekstra-')) return true
  return false
}

function filterPublicMenuPanels(panels) {
  if (!Array.isArray(panels)) return []
  return panels.filter((p) => !shouldHideMenuPanel(p))
}

/** Ürün / kategori eşlemesi: category_id ile categories belgesi (id veya doc id) */
function normCatId(v) {
  if (v === undefined || v === null || v === '') return '__none__'
  const n = Number(v)
  if (!Number.isNaN(n) && String(v).trim() !== '') return String(n)
  const s = String(v).trim()
  return s || '__none__'
}

function readImage(raw) {
  let img = raw?.image ?? raw?.imageBase64 ?? raw?.photo ?? raw?.gorsel
  if (img != null && typeof img === 'object') {
    img = img.base64 ?? img.data ?? img.url ?? img.src
  }
  if (img == null) return undefined
  const s = String(img).trim()
  return s || undefined
}

function normalizeItem(raw) {
  if (!raw || typeof raw !== 'object') return null
  const name = str(raw.name ?? raw.productName ?? raw.title ?? raw.urun_adi)
  if (!name) return null
  const priceRaw = raw.price ?? raw.fiyat ?? raw.ucret ?? '0'
  const price =
    typeof priceRaw === 'number' && !Number.isNaN(priceRaw)
      ? String(priceRaw)
      : str(priceRaw) || '0'
  const description = str(raw.description ?? raw.aciklama ?? '') || undefined
  const note = str(raw.note ?? raw.not ?? '') || undefined
  const glutenFree = Boolean(raw.glutenFree ?? raw.gluten_free ?? raw.glutensiz)
  const image = readImage(raw)
  return {
    name,
    price,
    ...(description ? { description } : {}),
    ...(note ? { note } : {}),
    ...(glutenFree ? { glutenFree: true } : {}),
    ...(image ? { image } : {}),
  }
}

function normalizeSection(raw) {
  if (!raw || typeof raw !== 'object') return null
  const title = str(raw.title ?? raw.name ?? raw.baslik ?? '') || null
  const itemsArr = Array.isArray(raw.items)
    ? raw.items
    : Array.isArray(raw.products)
      ? raw.products
      : []
  const items = itemsArr.map(normalizeItem).filter(Boolean)
  if (items.length === 0) return null
  return { title, items }
}

function normalizePanel(panelId, data) {
  if (!data || typeof data !== 'object') return null
  const id = str(data.id) || panelId
  const title = str(data.title ?? data.name ?? data.baslik) || id
  const orderRaw = data.order ?? data.sira ?? 0
  const order =
    typeof orderRaw === 'number' && !Number.isNaN(orderRaw)
      ? orderRaw
      : parseInt(String(orderRaw), 10) || 0
  const cover = str(
    data.coverImage ?? data.cover_image ?? data.backgroundImage ?? ''
  )
  const coverImage = cover || undefined

  let sectionsRaw = []
  if (Array.isArray(data.sections)) sectionsRaw = data.sections
  else if (Array.isArray(data.categories)) sectionsRaw = data.categories

  const sections = sectionsRaw.map(normalizeSection).filter(Boolean)
  if (sections.length === 0) return null

  return {
    id,
    title,
    order,
    ...(coverImage ? { coverImage } : {}),
    sections,
  }
}

function sortProductsInCategory(arr) {
  return [...arr].sort((a, b) => {
    const oa = a.order ?? a.sort ?? a.sort_order ?? a.id
    const ob = b.order ?? b.sort ?? b.sort_order ?? b.id
    const na = Number(oa)
    const nb = Number(ob)
    if (!Number.isNaN(na) && !Number.isNaN(nb) && na !== nb) return na - nb
    const sa = str(a.name)
    const sb = str(b.name)
    return sa.localeCompare(sb, 'tr')
  })
}

function panelIdFromFirestoreGroup(pg) {
  const raw = str(pg).toLowerCase().replace(/\s+/g, '-')
  const safe = raw.replace(/[^a-z0-9-]/g, '')
  return safe ? `grp-${safe}` : 'grp-menu'
}

/**
 * Firebase’deki `categories` + `products` şeması:
 * - category: id, name/title, order?, image? (kapak / data URL)
 * - product: category_id, name, price, description, image (base64 / data URL)
 */
async function loadPanelsFromCategoriesAndProducts() {
  if (!db) return null

  const [catSnap, prodSnap] = await Promise.all([
    getDocs(collection(db, CATEGORIES_COLLECTION)),
    getDocs(collection(db, PRODUCTS_COLLECTION)),
  ])

  if (prodSnap.empty) return null

  /** @type {Map<string, { panelId: string, title: string, order: number, coverImage?: string }>} */
  const catMap = new Map()
  catSnap.forEach((d) => {
    const data = d.data()
    if (!data || typeof data !== 'object') return
    const rawId = data.id ?? d.id
    const key = normCatId(rawId)
    if (key === '__none__') return

    const title =
      str(data.name ?? data.title ?? data.category_name ?? data.baslik) ||
      `Kategori ${key}`
    const orderRaw = data.order ?? data.sort ?? data.sira ?? rawId
    const order =
      typeof orderRaw === 'number' && !Number.isNaN(orderRaw)
        ? orderRaw
        : parseInt(String(orderRaw), 10) || 0
    const coverImage = readImage(data)

    const panelGroup = str(
      data.panelGroup ??
        data.panel_group ??
        data.kitchenId ??
        data.kitchen_id ??
        ''
    )
    const panelTitleFs = str(data.panelTitle ?? data.panel_title ?? '')
    const sectionTitleFs = str(data.sectionTitle ?? data.section_title ?? '') || null
    const soRaw = data.sectionOrder ?? data.section_order
    const sectionOrder =
      typeof soRaw === 'number' && !Number.isNaN(soRaw)
        ? soRaw
        : parseInt(String(soRaw), 10)
    const sectionOrderN = Number.isNaN(sectionOrder) ? order : sectionOrder

    catMap.set(key, {
      panelId: `cat-${key}`,
      title,
      order,
      ...(coverImage ? { coverImage } : {}),
      ...(panelGroup ? { panelGroup } : {}),
      ...(panelTitleFs ? { panelTitleFs } : {}),
      ...(sectionTitleFs ? { sectionTitleFs } : {}),
      sectionOrder: sectionOrderN,
    })
  })

  /** @type {Map<string, object[]>} */
  const productsByCat = new Map()
  prodSnap.forEach((d) => {
    const data = d.data()
    if (!data || typeof data !== 'object') return
    const key = normCatId(data.category_id ?? data.categoryId)
    if (!productsByCat.has(key)) productsByCat.set(key, [])
    productsByCat.get(key).push(data)
  })

  const productKeys = [...productsByCat.keys()].filter((k) => k !== '__none__')

  const processed = new Set()
  const panels = []

  function sectionTitleFor(key, cat) {
    if (cat?.sectionTitleFs) return cat.sectionTitleFs
    return str(cat?.title ?? '') || `Kategori ${key}`
  }

  function firstCoverFromKeys(keys) {
    for (const k of keys) {
      const c = catMap.get(k)
      if (c?.coverImage) return c.coverImage
    }
    return undefined
  }

  // 0) Kategori adı öneki: "Konya Mutfağı …", "Osmanlı Mutfağı …" vb. → tek panel, çok bölüm
  const autoByRuleId = new Map()
  for (const key of productKeys) {
    const cat = catMap.get(key)
    if (!cat?.title) continue
    const hit = matchAutoPrefixGroup(cat.title)
    if (!hit) continue
    const id = hit.rule.id
    if (!autoByRuleId.has(id)) autoByRuleId.set(id, [])
    autoByRuleId.get(id).push({ key, hit })
  }

  for (const rule of AUTO_PREFIX_PANEL_RULES) {
    const entries = autoByRuleId.get(rule.id)
    if (!entries?.length) continue
    entries.sort((a, b) => {
      const ca = catMap.get(a.key)
      const cb = catMap.get(b.key)
      const oa = ca?.sectionOrder ?? ca?.order ?? 0
      const ob = cb?.sectionOrder ?? cb?.order ?? 0
      if (oa !== ob) return oa - ob
      return str(ca?.title ?? '').localeCompare(str(cb?.title ?? ''), 'tr')
    })

    const sectionRows = []
    for (const { key, hit } of entries) {
      const raw = productsByCat.get(key)
      if (!raw?.length) continue
      const cat = catMap.get(key)
      const items = sortProductsInCategory(raw).map(normalizeItem).filter(Boolean)
      if (items.length === 0) continue
      const st =
        cat?.sectionTitleFs ??
        deriveSectionTitle(cat.title, hit.matchedPrefix, rule.panelTitle)
      sectionRows.push({
        sort: cat?.sectionOrder ?? cat?.order ?? sectionRows.length,
        title: st,
        items,
      })
      processed.add(key)
    }
    if (sectionRows.length === 0) continue

    sectionRows.sort((a, b) => {
      if (a.sort !== b.sort) return a.sort - b.sort
      return str(a.title ?? '').localeCompare(str(b.title ?? ''), 'tr')
    })

    const sections = sectionRows.map(({ title, items }) => ({ title, items }))
    const coverImage = firstCoverFromKeys(entries.map((e) => e.key))
    panels.push({
      id: rule.id,
      title: rule.panelTitle,
      order: rule.order,
      ...(coverImage ? { coverImage } : {}),
      sections,
    })
  }

  // 1) Yerel gruplar: MENU_PANEL_GROUPS (aynı mutfak → tek panel, çok bölüm)
  for (const g of MENU_PANEL_GROUPS) {
    if (!Array.isArray(g.categoryKeys) || g.categoryKeys.length === 0) continue
    const sections = []
    for (const ck of g.categoryKeys) {
      const key = normCatId(ck)
      if (key === '__none__') continue
      const raw = productsByCat.get(key)
      if (!raw?.length) continue
      const cat = catMap.get(key)
      const items = sortProductsInCategory(raw).map(normalizeItem).filter(Boolean)
      if (items.length === 0) continue
      sections.push({
        title: sectionTitleFor(key, cat),
        items,
      })
      processed.add(key)
    }
    if (sections.length === 0) continue
    const coverImage = g.coverImage ?? firstCoverFromKeys(g.categoryKeys.map((ck) => normCatId(ck)))
    panels.push({
      id: g.id,
      title: g.title,
      order: g.order ?? 0,
      ...(coverImage ? { coverImage } : {}),
      sections,
    })
  }

  const remaining = productKeys.filter((k) => !processed.has(k))

  // 2) Firestore panelGroup ile kalan kategorileri birleştir
  const fsBuckets = new Map()
  for (const key of remaining) {
    const cat = catMap.get(key)
    const pg = str(cat?.panelGroup ?? '')
    if (!pg) continue
    if (!fsBuckets.has(pg)) fsBuckets.set(pg, [])
    fsBuckets.get(pg).push(key)
  }

  for (const [pg, keys] of fsBuckets) {
    for (const k of keys) processed.add(k)

    const sortedKeys = [...keys].sort((ka, kb) => {
      const a = catMap.get(ka)
      const b = catMap.get(kb)
      const oa = a?.sectionOrder ?? a?.order ?? 0
      const ob = b?.sectionOrder ?? b?.order ?? 0
      if (oa !== ob) return oa - ob
      const ta = str(a?.title ?? ka)
      const tb = str(b?.title ?? kb)
      return ta.localeCompare(tb, 'tr')
    })

    let panelTitle = ''
    let panelOrder = 9999
    for (const k of sortedKeys) {
      const c = catMap.get(k)
      if (c?.panelTitleFs && !panelTitle) panelTitle = c.panelTitleFs
      if (c && c.order < panelOrder) panelOrder = c.order
    }
    if (!panelTitle) {
      panelTitle =
        PANEL_GROUP_TITLES[pg] ?? PANEL_GROUP_TITLES[pg.toLowerCase()] ?? pg
    }

    const sectionRows = []
    for (const key of sortedKeys) {
      const raw = productsByCat.get(key)
      if (!raw?.length) continue
      const cat = catMap.get(key)
      const items = sortProductsInCategory(raw).map(normalizeItem).filter(Boolean)
      if (items.length === 0) continue
      sectionRows.push({
        sort: cat?.sectionOrder ?? cat?.order ?? sectionRows.length,
        title: sectionTitleFor(key, cat),
        items,
      })
    }
    if (sectionRows.length === 0) continue

    sectionRows.sort((a, b) => {
      if (a.sort !== b.sort) return a.sort - b.sort
      return str(a.title).localeCompare(str(b.title), 'tr')
    })

    const sections = sectionRows.map(({ title, items }) => ({ title, items }))

    const coverImage = firstCoverFromKeys(sortedKeys)
    panels.push({
      id: panelIdFromFirestoreGroup(pg),
      title: panelTitle,
      order: panelOrder,
      ...(coverImage ? { coverImage } : {}),
      sections,
    })
  }

  // 3) Tekil kategoriler (grup yok)
  const standaloneKeys = productKeys.filter((k) => !processed.has(k))
  const sortedStandalone = [...standaloneKeys].sort((ka, kb) => {
    const a = catMap.get(ka)
    const b = catMap.get(kb)
    const oa = a?.order ?? 9999
    const ob = b?.order ?? 9999
    if (oa !== ob) return oa - ob
    const ta = str(a?.title ?? ka)
    const tb = str(b?.title ?? kb)
    return ta.localeCompare(tb, 'tr')
  })

  function pushStandalonePanel(key, cat, rawItems) {
    const items = sortProductsInCategory(rawItems)
      .map(normalizeItem)
      .filter(Boolean)
    if (items.length === 0) return
    const title = cat?.title ?? `Kategori ${key}`
    const order = cat?.order ?? 9999
    const panelId = cat?.panelId ?? `cat-${key}`
    const coverImage = cat?.coverImage
    panels.push({
      id: panelId,
      title,
      order,
      ...(coverImage ? { coverImage } : {}),
      sections: [{ title: null, items }],
    })
  }

  for (const key of sortedStandalone) {
    const raw = productsByCat.get(key)
    if (!raw?.length) continue
    pushStandalonePanel(key, catMap.get(key), raw)
  }

  const orphans = productsByCat.get('__none__') || []
  const orphanItems = sortProductsInCategory(orphans)
    .map(normalizeItem)
    .filter(Boolean)
  if (orphanItems.length > 0) {
    panels.push({
      id: 'uncategorized',
      title: 'Diğer',
      order: 99999,
      sections: [{ title: null, items: orphanItems }],
    })
  }

  // Kategorisi listede olan ama ürünü olmayan panel üretme (eski menü_panels davranışına gerek yok)

  return panels.length > 0 ? panels : null
}

async function loadPanelsFromRootDoc() {
  if (!db || !MENU_ROOT_DOC) return null
  const segs = MENU_ROOT_DOC.split('/').filter(Boolean)
  if (segs.length < 2) return null

  const snap = await getDoc(doc(db, segs[0], segs[1]))
  if (!snap.exists()) return null
  const rawPanels = snap.data()?.panels
  if (!Array.isArray(rawPanels)) return null

  return rawPanels
    .map((p, i) =>
      normalizePanel(str(p?.id) || `panel-${i}`, {
        ...p,
        id: p?.id ?? `panel-${i}`,
      })
    )
    .filter(Boolean)
}

async function loadPanelsFromCollection() {
  if (!db) return null
  const snap = await getDocs(collection(db, PANELS_COLLECTION))
  const list = []
  snap.forEach((d) => {
    const p = normalizePanel(d.id, { id: d.id, ...d.data() })
    if (p) list.push(p)
  })
  return list
}

function sortPanels(panels) {
  return [...panels].sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order
    return a.title.localeCompare(b.title, 'tr')
  })
}

/**
 * Öncelik: `categories` + `products` → sonra `MENU_ROOT_DOC` → `menu_panels` → yerel menuData.
 */
export async function fetchMenuPanelsFromFirestore() {
  if (!db) {
    if (import.meta.env.DEV) {
      console.info(
        '[menu] Firestore kapalı (.env içinde VITE_FIREBASE_*). Yerel menuData kullanılıyor.'
      )
    }
    return {
      panels: filterPublicMenuPanels(localMenuPanels),
      usedFallback: true,
      error: null,
    }
  }

  try {
    let list = await loadPanelsFromCategoriesAndProducts()
    let source = 'categories+products'

    if (!list || list.length === 0) {
      list = await loadPanelsFromRootDoc()
      source = MENU_ROOT_DOC || 'root-doc'
    }
    if (!list || list.length === 0) {
      list = await loadPanelsFromCollection()
      source = PANELS_COLLECTION
    }

    if (!list || list.length === 0) {
      if (import.meta.env.DEV) {
        console.warn(
          `[menu] Firestore'da menü verisi yok (${CATEGORIES_COLLECTION} / ${PRODUCTS_COLLECTION}). Yerel menuData kullanılıyor.`
        )
      }
      return {
        panels: filterPublicMenuPanels(localMenuPanels),
        usedFallback: true,
        error: null,
      }
    }

    if (import.meta.env.DEV) {
      console.info(`[menu] Firestore (${source}): ${list.length} panel yüklendi.`)
    }
    return {
      panels: sortPanels(filterPublicMenuPanels(list)),
      usedFallback: false,
      error: null,
    }
  } catch (e) {
    console.error('[menu] Firestore menü okuma hatası:', e)
    return {
      panels: filterPublicMenuPanels(localMenuPanels),
      usedFallback: true,
      error: e?.message || String(e),
    }
  }
}
