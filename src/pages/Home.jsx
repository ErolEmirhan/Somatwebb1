import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import { BRAND } from '../config/brand'
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL } from '../config/contact'
import BrandLogo from '../components/BrandLogo'
import { HERO_SECTION_BACKGROUNDS } from '../config/heroBackgrounds'
import { useMenuProductImages } from '../hooks/useMenuProductImages'
import { buildHomeMenuCategoryCards } from '../utils/homeMenuCategoryCards'
import {
  CategoryLuxuryLeftRail,
  CategoryLuxuryTriangleFlag,
} from '../components/CategoryLuxuryLeftMark'

export default function Home() {
  const { panels } = useMenuProductImages()
  const heroUrls = HERO_SECTION_BACKGROUNDS
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const menuCategoryCards = useMemo(() => buildHomeMenuCategoryCards(panels), [panels])

  useEffect(() => {
    setCurrentImageIndex(0)
  }, [heroUrls])

  useEffect(() => {
    const n = heroUrls.length
    if (n === 0) return undefined
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev === n - 1 ? 0 : prev + 1))
    }, 4000)
    return () => clearInterval(interval)
  }, [heroUrls])

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="overflow-hidden"
    >
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <AnimatePresence initial={false}>
            <motion.img
              key={currentImageIndex}
              src={heroUrls[currentImageIndex]}
              alt={BRAND.name}
              className="w-full h-full object-cover absolute inset-0 scale-105"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1.05 }}
              exit={{ opacity: 0, scale: 1 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/75 backdrop-blur-[1px]" />
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />

          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-30 flex gap-3">
            {heroUrls.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`h-[2px] transition-all duration-500 ${index === currentImageIndex ? 'bg-white w-12' : 'bg-white/40 w-8 hover:bg-white/60'}`}
                aria-label={`Slayt ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="container-custom relative z-20 text-center text-white px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-block mb-6 mx-auto"
            >
              <BrandLogo
                variant="hero"
                alt=""
                className="mx-auto drop-shadow-[0_8px_32px_rgba(0,0,0,0.45)]"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mb-6"
            >
              <span
                className="text-sm md:text-base tracking-[0.28em] uppercase font-bold"
                style={{
                  background: 'linear-gradient(135deg, #fde68a 0%, #fcd34d 50%, #d4af37 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Tarihi Türk mutfağı
              </span>
            </motion.div>

            <h1
              className="text-4xl md:text-6xl lg:text-7xl font-display font-semibold mb-6 tracking-tight leading-[1.15] text-white"
              style={{ textShadow: '0 4px 20px rgba(0,0,0,0.9)' }}
            >
              {BRAND.name}
            </h1>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '80px' }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="h-[1px] bg-white mx-auto mb-8"
            />

            <p
              className="text-base md:text-lg lg:text-xl text-white/95 font-light max-w-2xl mx-auto mb-12 leading-relaxed tracking-wide"
              style={{ textShadow: '0 2px 15px rgba(0,0,0,0.9)' }}
            >
              {BRAND.tagline}
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col items-center gap-4"
            >
              <Link
                to="/menu"
                className="group relative inline-flex items-center gap-4 px-12 py-5 text-sm md:text-base tracking-[0.2em] uppercase font-bold text-dark-900 overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(212,175,55,0.5)]"
                style={{
                  background: 'linear-gradient(135deg, #fde68a 0%, #fcd34d 50%, #d4af37 100%)',
                  boxShadow: '0 10px 40px rgba(212,175,55,0.35)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                <span className="relative z-10">Menümüzü Keşfedin</span>
                <ArrowRight className="w-5 h-5 relative z-10 text-dark-900 group-hover:translate-x-2 transition-transform duration-500" />
              </Link>

              <Link
                to="/menu/order"
                className="group relative inline-flex items-center gap-3 px-10 py-4 text-sm md:text-base tracking-[0.15em] uppercase font-semibold text-white border-2 border-white/30 hover:border-white/60 backdrop-blur-sm"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.1) 100%)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                }}
              >
                <span className="relative z-10">Rezervasyon</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-[1px] h-12 bg-gradient-to-b from-transparent via-white/60 to-transparent"
          />
        </motion.div>
      </section>

      {/* Concepts */}
      <section className="py-24 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title">Menü Kategorilerimiz</h2>
            <p className="section-subtitle">Taze malzeme ve özenli sunumla hazırlanan lezzetler</p>
          </motion.div>

          <div className="mx-auto grid max-w-5xl gap-x-8 gap-y-12 md:grid-cols-2 md:justify-items-center md:gap-y-14 lg:max-w-6xl lg:grid-cols-3 lg:gap-y-16">
            {menuCategoryCards.map((concept, index) => (
              <motion.div
                key={concept.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="relative w-full max-w-[17.5rem] overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl sm:max-w-xs"
              >
                <CategoryLuxuryLeftRail />
                <div className="relative h-80 overflow-hidden sm:h-[22rem]">
                  {concept.image ? (
                    <img
                      src={concept.image}
                      alt={concept.title}
                      decoding="async"
                      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div
                      className="h-full w-full bg-gradient-to-br from-amber-800 via-amber-700 to-amber-950"
                      aria-hidden
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <CategoryLuxuryTriangleFlag />
                  <h3 className="absolute bottom-4 left-6 z-10 text-2xl font-display font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]">
                    {concept.title}
                  </h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{concept.description}</p>
                  <Link
                    to={`/menu#menu-panel-${concept.menuPanelId}`}
                    className="inline-flex items-center text-amber-600 font-semibold hover:text-amber-700 transition-colors"
                  >
                    Menüyü İncele
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Soframızda Yeriniz Hazır</h2>
            <p className="text-xl mb-8 text-amber-100 max-w-2xl mx-auto">
              Rezervasyon için hemen arayın veya menümüzü inceleyin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={CONTACT_PHONE_TEL}
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-amber-700 font-semibold py-4 px-10 rounded-full transition-all duration-300"
              >
                Rezervasyon için… · {CONTACT_PHONE_DISPLAY}
              </a>
              <Link
                to="/menu"
                className="bg-white text-amber-700 hover:bg-amber-50 font-semibold py-4 px-10 rounded-full transition-all duration-300"
              >
                Menüyü Gör
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}
