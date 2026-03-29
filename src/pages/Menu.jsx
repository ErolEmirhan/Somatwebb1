import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown,
  UtensilsCrossed,
  Landmark,
  Leaf,
  Sun,
  CupSoda,
  Salad,
  Coffee,
  Sparkles,
  Crown,
} from 'lucide-react'
import { getPanelCoverImage } from '../data/menuPanelCovers'
import MenuProductThumbnail from '../components/MenuProductThumbnail'
import MenuProductImagePreview from '../components/MenuProductImagePreview'
import { fetchMenuPanelsFromFirestore } from '../services/menuFromFirestore'

const panelIcons = {
  'selcuklu-mevlevi': Landmark,
  osmanli: Crown,
  konya: Landmark,
  vejetaryen: Leaf,
  vegan: Leaf,
  kahvalti: Sun,
  'soguk-icecekler': CupSoda,
  'salata-tatli': Salad,
  'sicak-icecekler': Coffee,
  'cocuk-menu': Sparkles,
}

function getPanelIcon(panelId) {
  return panelIcons[panelId] || UtensilsCrossed
}

export default function Menu() {
  const [expandedPanels, setExpandedPanels] = useState(new Set())
  const [panels, setPanels] = useState(null)
  const [menuLoadError, setMenuLoadError] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetchMenuPanelsFromFirestore().then((r) => {
      if (cancelled) return
      setPanels(r.panels)
      setMenuLoadError(r.error)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const togglePanel = (id) => {
    setExpandedPanels((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const closeImagePreview = () => setImagePreview(null)

  if (panels === null) {
    return (
      <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-amber-50/40 via-white to-amber-50/30 pt-20 sm:pt-24 md:pt-28">
        <p className="text-amber-900/80 font-medium">Menü yükleniyor…</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="overflow-hidden min-h-screen bg-gradient-to-b from-amber-50/40 via-white to-amber-50/30"
    >
      <MenuProductImagePreview
        open={Boolean(imagePreview)}
        onClose={closeImagePreview}
        product={imagePreview?.product}
        panelTitle={imagePreview?.panelTitle}
        sectionTitle={imagePreview?.sectionTitle}
      />

      {/* Panel list — geniş kartlar, arka plan görseli + sarı gradient overlay */}
      <section className="pt-20 sm:pt-24 md:pt-28 pb-24 px-3 sm:px-5 md:px-8 lg:px-10 xl:px-12">
        {menuLoadError && (
          <p className="text-center text-amber-900/90 text-sm px-4 mb-6 max-w-2xl mx-auto">
            Menü sunucudan alınamadı; yerel veri gösteriliyor. ({menuLoadError})
          </p>
        )}
        <div className="max-w-[90rem] mx-auto space-y-6 md:space-y-8">
          {panels.map((panel, panelIndex) => {
            const isExpanded = expandedPanels.has(panel.id)
            const Icon = getPanelIcon(panel.id)
            const coverUrl = getPanelCoverImage(panel)

            return (
              <motion.div
                key={panel.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: panelIndex * 0.04 }}
                className="relative"
              >
                <div
                  className="group relative overflow-hidden rounded-3xl border border-amber-300/45 shadow-xl transition-all duration-500"
                  style={{
                    boxShadow: isExpanded
                      ? '0 28px 56px -16px rgba(180, 83, 9, 0.22), 0 0 0 1px rgba(212, 175, 55, 0.35)'
                      : '0 12px 40px -12px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(212, 175, 55, 0.22)',
                  }}
                >
                  {/* Arka plan: ürün fotoğrafı veya kapak URL (img → data URL güvenli) */}
                  <img
                    src={coverUrl}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-[1.04]"
                  />
                  {/* Sarı–altın gradient overlay (profesyonel, modern) */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `linear-gradient(135deg,
                        rgba(255, 251, 235, 0.93) 0%,
                        rgba(254, 243, 199, 0.84) 26%,
                        rgba(252, 211, 77, 0.48) 58%,
                        rgba(217, 119, 6, 0.32) 100%)`,
                    }}
                  />
                  {/* Üst parlama + alt derinlik */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `linear-gradient(180deg,
                        rgba(255, 255, 255, 0.38) 0%,
                        transparent 38%,
                        rgba(146, 64, 14, 0.14) 100%)`,
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => togglePanel(panel.id)}
                    className="relative z-10 w-full flex items-center justify-between gap-5 min-h-[100px] md:min-h-[124px] py-6 md:py-7 px-6 sm:px-10 md:px-12 text-left"
                  >
                    <div className="flex items-center gap-5 min-w-0">
                      <div className="flex-shrink-0 w-16 h-16 md:w-[72px] md:h-[72px] rounded-2xl flex items-center justify-center bg-white/55 backdrop-blur-md border border-amber-300/50 shadow-md">
                        <Icon className="w-8 h-8 md:w-9 md:h-9 text-amber-800" />
                      </div>
                      <h2
                        className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-amber-950 tracking-tight"
                        style={{
                          textShadow: `
                            0 0 2px rgba(255, 255, 255, 1),
                            0 1px 2px rgba(255, 252, 245, 0.98),
                            0 2px 6px rgba(255, 251, 235, 0.95),
                            0 2px 12px rgba(0, 0, 0, 0.35),
                            0 4px 24px rgba(0, 0, 0, 0.28)
                          `,
                        }}
                      >
                        {panel.title}
                      </h2>
                    </div>
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/55 backdrop-blur-md border border-amber-300/50 flex items-center justify-center text-amber-800 shadow-md transition-colors duration-300 hover:bg-white/75">
                      <motion.span
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                      >
                        <ChevronDown className="w-6 h-6" />
                      </motion.span>
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="relative z-10 border-t border-amber-200/60 bg-white/80 backdrop-blur-lg rounded-b-3xl">
                          <div
                            className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/70 to-transparent"
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
                                    <div className="h-px sm:flex-1 bg-gradient-to-r from-transparent via-amber-300/80 to-amber-500/50 sm:max-w-[min(12rem,28%)]" />
                                    <h3 className="relative flex-shrink-0 text-left sm:text-center px-2">
                                      <span className="block font-display text-lg sm:text-xl font-bold text-amber-950 tracking-tight">
                                        {section.title}
                                      </span>
                                      <span
                                        className="mt-2 block h-0.5 w-12 rounded-full bg-gradient-to-r from-amber-500 to-amber-300 sm:mx-auto"
                                        aria-hidden
                                      />
                                    </h3>
                                    <div className="h-px sm:flex-1 bg-gradient-to-l from-transparent via-amber-300/80 to-amber-500/50 sm:max-w-[min(12rem,28%)]" />
                                  </div>
                                </div>
                              )}

                              <ul className="space-y-1">
                                {section.items.map((product, index) => (
                                  <motion.li
                                    key={`${product.name}-${index}`}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.015, duration: 0.2 }}
                                    className="flex flex-row items-start gap-3 sm:gap-4 py-4 px-3 sm:px-4 rounded-xl hover:bg-amber-100/50 border border-transparent hover:border-amber-200 transition-all duration-200"
                                  >
                                    <MenuProductThumbnail
                                      product={product}
                                      onOpenPreview={() =>
                                        setImagePreview({
                                          product,
                                          panelTitle: panel.title,
                                          sectionTitle: section.title,
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
                                      {product.description && (
                                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                          {product.description}
                                        </p>
                                      )}
                                    </div>
                                    <span className="text-amber-600 font-bold whitespace-nowrap flex-shrink-0 text-lg tabular-nums pt-0.5">
                                      ₺{product.price}
                                    </span>
                                  </motion.li>
                                ))}
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
