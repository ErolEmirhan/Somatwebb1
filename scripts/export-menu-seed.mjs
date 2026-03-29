/**
 * Yerel menuData + kapak URL'lerini birleştirip Firestore'a aktarım için JSON üretir.
 * Çalıştır: npm run export-menu-seed
 * Çıktı: public/firestore-menu-panels-seed.json (dizi — her eleman bir panel belgesi)
 */
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { menuPanels } from '../src/data/menuData.js'
import { menuPanelCoverById, defaultPanelCover } from '../src/data/menuPanelCovers.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const panels = menuPanels.map((p, order) => ({
  id: p.id,
  title: p.title,
  order,
  coverImage: p.coverImage ?? menuPanelCoverById[p.id] ?? defaultPanelCover,
  sections: p.sections,
}))

const outPath = join(root, 'public', 'firestore-menu-panels-seed.json')
writeFileSync(outPath, JSON.stringify(panels, null, 2), 'utf8')
console.log('Yazıldı:', outPath, `(${panels.length} panel)`)
