import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
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
import { BRAND } from '../config/brand'

function MenuLoadingScreen() {
  const skeletonRows = [0, 1, 2]
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-amber-50/50 via-white to-amber-50/40 flex flex-col items-center justify-center px-4 pt-20 sm:pt-24 md:pt-28 pb-16">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 right-0 h-[28rem] w-[28rem] rounded-full bg-amber-300/25 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-[24rem] w-[24rem] rounded-full bg-amber-400/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-200/15 blur-3xl" />
      </div>

      <motion.div
        role="status"
        aria-live="polite"
        aria-busy="true"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <span className="sr-only">Menü yükleniyor, lütfen bekleyin.</span>
        <div className="rounded-3xl border border-amber-200/50 bg-white/70 p-8 sm:p-10 shadow-[0_24px_64px_-16px_rgba(180,83,9,0.18),0_0_0_1px_rgba(255,255,255,0.8)_inset] backdrop-blur-xl">
          <div className="flex flex-col items-center text-center">
            <motion.div
              className="relative mb-8 flex h-20 w-20 items-center justify-center rounded-2xl border border-amber-300/40 bg-gradient-to-br from-amber-50 to-white shadow-gold"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <UtensilsCrossed className="h-9 w-9 text-amber-800" strokeWidth={1.5} />
              <motion.span
                className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-amber-400/15 border-t-amber-600"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.35, repeat: Infinity, ease: 'linear' }}
                aria-hidden
              />
            </motion.div>

            <p className="mb-1 font-sans text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-amber-700/90">
              Menü
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-amber-950">
              Hazırlanıyor
            </h1>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-amber-900/65">
              {BRAND.name} seçkileri yükleniyor. Birkaç saniye içinde sofranız dijitalde.
            </p>

            <div className="mt-10 w-full space-y-3">
              {skeletonRows.map((i) => (
                <div
                  key={i}
                  className="relative h-14 sm:h-16 overflow-hidden rounded-2xl border border-amber-200/35 bg-gradient-to-r from-amber-50/90 via-white/80 to-amber-50/60"
                >
                  <motion.div
                    className="absolute inset-y-0 w-[45%] bg-gradient-to-r from-transparent via-white/85 to-transparent"
                    initial={{ x: '-120%' }}
                    animate={{ x: '280%' }}
                    transition={{
                      duration: 1.85,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.22,
                    }}
                  />
                  <div className="absolute inset-y-0 left-4 right-4 flex items-center gap-3">
                    <div className="h-9 w-9 flex-shrink-0 rounded-xl bg-amber-200/50" />
                    <div className="flex flex-1 flex-col gap-2 py-1">
                      <div className="h-2.5 w-[55%] max-w-[12rem] rounded-full bg-amber-200/55" />
                      <div className="h-2 w-[35%] max-w-[7rem] rounded-full bg-amber-100/80" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <motion.div
              className="mt-8 flex items-center gap-2 text-xs font-medium text-amber-800/55"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
              <span className="tracking-wide">Lütfen bekleyin</span>
              <span className="inline-flex gap-0.5">
                {[0, 1, 2].map((d) => (
                  <motion.span
                    key={d}
                    className="h-1 w-1 rounded-full bg-amber-500/70"
                    animate={{ opacity: [0.25, 1, 0.25] }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: d * 0.2,
                    }}
                  />
                ))}
              </span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

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
  const location = useLocation()
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

  if (panels === null) {
    return <MenuLoadingScreen />
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
                id={`menu-panel-${panel.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: panelIndex * 0.04 }}
                className="relative scroll-mt-24 sm:scroll-mt-28"
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
