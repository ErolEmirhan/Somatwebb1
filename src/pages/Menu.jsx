import { useState, useEffect, Fragment } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { getPanelCoverImage } from '../data/menuPanelCovers'
import MenuProductThumbnail from '../components/MenuProductThumbnail'
import MenuProductImagePreview from '../components/MenuProductImagePreview'
import {
  CategoryLuxuryLeftRail,
  CategoryLuxuryTriangleFlag,
} from '../components/CategoryLuxuryLeftMark'
import { useMenuPanels } from '../hooks/useMenuPanels'
import { formatMenuProductDescription } from '../utils/sanitizeSaladDescriptions'

/** Kategori kartları arası ince altın motif + nefes payı */
function MenuCategoryMotifDivider() {
  return (
    <div
      className="mx-auto flex w-full max-w-md flex-col items-center gap-3 py-6 sm:max-w-lg sm:gap-4 sm:py-8 md:py-10"
      role="presentation"
      aria-hidden
    >
      <div className="flex w-full items-center gap-4 sm:gap-5">
        <span className="h-[0.5px] min-w-0 flex-1 bg-gradient-to-r from-transparent via-amber-800/40 to-amber-600/30" />
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <span className="h-px w-6 bg-gradient-to-r from-transparent to-amber-700/35 sm:w-8" />
          <span className="inline-block h-1 w-1 rotate-45 bg-gradient-to-br from-amber-300 to-amber-700 shadow-sm ring-1 ring-amber-900/10" />
          <span className="inline-block h-1.5 w-1.5 rotate-45 border border-amber-700/45 bg-amber-50/30 shadow-sm" />
          <span className="inline-block h-1 w-1 rotate-45 bg-gradient-to-br from-amber-300 to-amber-700 shadow-sm ring-1 ring-amber-900/10" />
          <span className="h-px w-6 bg-gradient-to-l from-transparent to-amber-700/35 sm:w-8" />
        </div>
        <span className="h-[0.5px] min-w-0 flex-1 bg-gradient-to-l from-transparent via-amber-800/40 to-amber-600/30" />
      </div>
      <div className="flex items-center gap-3 opacity-80">
        <span className="h-px w-10 bg-gradient-to-r from-transparent via-amber-600/25 to-transparent sm:w-14" />
        <span className="flex gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="block h-[3px] w-[3px] rounded-full bg-amber-800/40 ring-1 ring-amber-700/15"
            />
          ))}
        </span>
        <span className="h-px w-10 bg-gradient-to-l from-transparent via-amber-600/25 to-transparent sm:w-14" />
      </div>
    </div>
  )
}

export default function Menu() {
  const location = useLocation()
  const [expandedPanels, setExpandedPanels] = useState(new Set())
  const { panels, menuLoadError, isRefreshing } = useMenuPanels()
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    if (!panels?.length) return
    const raw = (location.hash || '').replace(/^#/, '')
    if (!raw.startsWith('menu-panel-')) return
    const panelId = raw.slice('menu-panel-'.length)
    if (!panels.some((p) => p.id === panelId)) return
    setExpandedPanels((prev) => {
      const next = new Set(prev)
      next.add(panelId)
      return next
    })
    requestAnimationFrame(() => {
      document.getElementById(raw)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [panels, location.hash])

  const togglePanel = (id) => {
    setExpandedPanels((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const closeImagePreview = () => setImagePreview(null)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="overflow-hidden min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-100/80"
    >
      <MenuProductImagePreview
        open={Boolean(imagePreview)}
        onClose={closeImagePreview}
        product={imagePreview?.product}
        panelTitle={imagePreview?.panelTitle}
        sectionTitle={imagePreview?.sectionTitle}
        panelId={imagePreview?.panelId}
        sectionIndex={imagePreview?.sectionIndex}
      />

      {/* Panel list — eşit yükseklik, fotoğraf + alttan ~%68 siyah gradient, ortalanmış başlık */}
      <section className="pt-20 sm:pt-24 md:pt-28 pb-24 px-3 sm:px-5 md:px-8 lg:px-10 xl:px-12">
        {isRefreshing && (
          <p
            className="text-center text-amber-800/70 text-xs font-medium tracking-wide mb-4 px-4"
            role="status"
            aria-live="polite"
          >
            Menü güncelleniyor…
          </p>
        )}
        {menuLoadError && (
          <p className="text-center text-neutral-700 text-sm px-4 mb-6 max-w-2xl mx-auto">
            Menü sunucudan alınamadı; yerel veri gösteriliyor. ({menuLoadError})
          </p>
        )}
        <div className="mx-auto flex w-full max-w-md flex-col px-2 sm:max-w-lg sm:px-0">
          {panels.map((panel, panelIndex) => {
            const isExpanded = expandedPanels.has(panel.id)
            const coverUrl = getPanelCoverImage(panel)

            return (
              <Fragment key={panel.id}>
                {panelIndex > 0 ? <MenuCategoryMotifDivider /> : null}
                <motion.div
                  id={`menu-panel-${panel.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: panelIndex * 0.04 }}
                  className="relative w-full scroll-mt-24 sm:scroll-mt-28"
                >
                <div
                  className={`group relative overflow-hidden rounded-3xl border border-black/[0.06] bg-white transition-shadow duration-500 ${
                    isExpanded
                      ? 'shadow-[0_28px_64px_-18px_rgba(0,0,0,0.28)]'
                      : 'shadow-[0_20px_50px_-20px_rgba(0,0,0,0.2)] hover:shadow-[0_26px_56px_-20px_rgba(0,0,0,0.26)]'
                  }`}
                >
                  <CategoryLuxuryLeftRail />
                  {/* Kapak şeridi: tüm kategorilerde aynı yükseklik; gradient yalnızca bu bölümde */}
                  <div className="relative h-44 w-full overflow-hidden bg-neutral-900 sm:h-52 md:h-60">
                    {coverUrl ? (
                      <img
                        src={coverUrl}
                        alt=""
                        aria-hidden
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div
                        className="absolute inset-0 bg-gradient-to-br from-amber-950 via-neutral-900 to-neutral-950"
                        aria-hidden
                      />
                    )}
                    <div
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-[68%]"
                      style={{
                        background:
                          'linear-gradient(to top, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.62) 28%, rgba(0,0,0,0.38) 52%, rgba(0,0,0,0.14) 76%, transparent 100%)',
                      }}
                      aria-hidden
                    />
                    <CategoryLuxuryTriangleFlag />

                    <button
                      type="button"
                      onClick={() => togglePanel(panel.id)}
                      className="relative z-10 flex h-full w-full items-center justify-center px-14 text-center"
                    >
                      <h2
                        className="max-w-[min(100%,32rem)] font-display text-2xl font-extrabold leading-tight tracking-tight text-white antialiased sm:text-3xl md:text-4xl"
                        style={{
                          textShadow: `
                            0 0 1px rgba(0, 0, 0, 1),
                            0 1px 2px rgba(0, 0, 0, 0.95),
                            0 2px 8px rgba(0, 0, 0, 0.85),
                            0 4px 18px rgba(0, 0, 0, 0.65),
                            0 0 42px rgba(0, 0, 0, 0.45)
                          `,
                        }}
                      >
                        {panel.title}
                      </h2>
                      <span className="pointer-events-none absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/25 text-white backdrop-blur-[2px] sm:right-5 md:right-6">
                        <motion.span
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.35, ease: 'easeInOut' }}
                          className="flex"
                        >
                          <ChevronDown className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2} />
                        </motion.span>
                      </span>
                    </button>
                  </div>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="relative z-10 border-t border-neutral-200/90 bg-white backdrop-blur-sm">
                          <div
                            className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-300/80 to-transparent"
                            aria-hidden
                          />
                          <div className="relative px-6 sm:px-10 md:px-12 pb-10 pt-4">

                          {panel.sections.map((section, sectionIndex) => (
                            <div
                              key={`${panel.id}-s${sectionIndex}-${section.title ?? 'x'}`}
                              className={sectionIndex > 0 ? 'mt-12' : 'mt-2'}
                            >
                              {section.title && (
                                <div className="mb-6 sm:mb-7">
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                                    <div className="h-px sm:flex-1 bg-gradient-to-r from-transparent via-neutral-300/90 to-neutral-400/50 sm:max-w-[min(12rem,28%)]" />
                                    <h3 className="relative flex-shrink-0 text-left sm:text-center px-2">
                                      <span className="block font-display text-lg sm:text-xl font-semibold tracking-tight text-neutral-900">
                                        {section.title}
                                      </span>
                                      <span
                                        className="mt-2 block h-px w-10 rounded-full bg-neutral-900/80 sm:mx-auto"
                                        aria-hidden
                                      />
                                    </h3>
                                    <div className="h-px sm:flex-1 bg-gradient-to-l from-transparent via-neutral-300/90 to-neutral-400/50 sm:max-w-[min(12rem,28%)]" />
                                  </div>
                                </div>
                              )}

                              <ul className="space-y-1">
                                {section.items.map((product, index) => {
                                  const desc = formatMenuProductDescription(
                                    product.description,
                                    section.title,
                                    panel.id,
                                    sectionIndex
                                  )
                                  return (
                                    <motion.li
                                      key={`${product.name}-${index}`}
                                      initial={{ opacity: 0, x: -8 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: index * 0.015, duration: 0.2 }}
                                      className="flex flex-row items-start gap-3 sm:gap-4 py-4 px-3 sm:px-4 rounded-xl border border-transparent transition-all duration-200 hover:border-neutral-200/80 hover:bg-neutral-50/90"
                                    >
                                      <MenuProductThumbnail
                                        product={product}
                                        onOpenPreview={() =>
                                          setImagePreview({
                                            product,
                                            panelTitle: panel.title,
                                            sectionTitle: section.title,
                                            panelId: panel.id,
                                            sectionIndex,
                                          })
                                        }
                                      />
                                      <div className="min-w-0 flex-1 pt-0.5">
                                        <div className="flex flex-wrap items-center gap-2">
                                          <span className="font-semibold text-gray-900">{product.name}</span>
                                          {product.glutenFree && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                                              GLUTEN İÇERMEZ
                                            </span>
                                          )}
                                          {product.note && (
                                            <span className="text-xs text-gray-500">({product.note})</span>
                                          )}
                                        </div>
                                        {desc ? (
                                          <p className="text-sm text-gray-600 mt-1 leading-relaxed">{desc}</p>
                                        ) : null}
                                      </div>
                                      <span className="text-neutral-900 font-semibold whitespace-nowrap flex-shrink-0 text-lg tabular-nums pt-0.5">
                                        ₺{product.price}
                                      </span>
                                    </motion.li>
                                  )
                                })}
                              </ul>
                            </div>
                          ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
              </Fragment>
            )
          })}
        </div>

        <p className="text-center text-gray-500 text-sm mt-12 max-w-3xl mx-auto px-4">
          Fiyatlarımız günceldir. Özel istekler ve porsiyon bilgisi için personelimize sorabilirsiniz.
        </p>
      </section>
    </motion.div>
  )
}
