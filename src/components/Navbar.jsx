import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, Home, Info, Images, UtensilsCrossed, Phone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { BRAND } from '../config/brand'
import BrandLogo from './BrandLogo'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Anasayfa', path: '/anasayfa', icon: Home },
    { name: 'Menü', path: '/menu', icon: UtensilsCrossed },
    { name: 'Hakkımızda', path: '/hakkimizda', icon: Info },
    { name: 'Galeri', path: '/galeri', icon: Images },
    { name: 'İletişim', path: '/iletisim', icon: Phone },
  ]

  const currentPageData = navLinks.find(link => link.path === location.pathname) || navLinks[0]
  const currentPage = currentPageData.name
  const CurrentIcon = currentPageData.icon

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-3' : 'bg-white/95 backdrop-blur-sm shadow-sm py-3'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between relative">
          <Link to="/anasayfa" className="flex items-center gap-3 group min-w-0" aria-label={`${BRAND.name} anasayfa`}>
            <motion.div className="flex-shrink-0" whileHover={{ scale: 1.04 }}>
              <BrandLogo variant="nav" alt="" />
            </motion.div>
            <span className="text-lg sm:text-xl md:text-2xl font-display font-bold tracking-tight text-amber-900 group-hover:text-amber-700 transition-colors leading-snug">
              {BRAND.name}
            </span>
          </Link>

          <div className="absolute left-1/2 transform -translate-x-1/2">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-8 w-px bg-gradient-to-b from-transparent via-amber-400 to-transparent"
            />
          </div>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <motion.div
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === link.path
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-gold'
                      : 'text-gray-700 hover:bg-amber-50 hover:text-amber-700'
                  }`}
                >
                  {link.name}
                </motion.div>
              </Link>
            ))}
          </div>

          <div className="lg:hidden relative">
            <motion.div
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center gap-2"
              whileTap={{ scale: 0.95 }}
            >
              <motion.div className="p-2.5 bg-white/80 backdrop-blur-sm rounded-full border border-amber-200/50 shadow-sm">
                <CurrentIcon size={20} className="text-amber-600" />
              </motion.div>
              <motion.div className="flex items-center gap-1 bg-amber-50/80 backdrop-blur-sm px-3 py-2 rounded-full border border-amber-200/50 shadow-sm cursor-pointer">
                <span className="text-sm font-semibold text-gray-800">{currentPage}</span>
                <motion.div animate={{ rotate: mobileMenuOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <ChevronDown size={20} className="text-gray-700" />
                </motion.div>
              </motion.div>
            </motion.div>

            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl py-2 min-w-[160px] z-50"
                >
                  {navLinks.map((link, index) => {
                    const Icon = link.icon
                    const isLast = index === navLinks.length - 1
                    return (
                      <div key={link.path} className={!isLast ? 'border-b border-gray-100' : ''}>
                        <Link to={link.path} onClick={() => setMobileMenuOpen(false)}>
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            whileTap={{ scale: 0.98 }}
                            className={`px-4 py-2.5 flex items-center gap-3 text-sm font-medium ${
                              location.pathname === link.path ? 'bg-amber-50 text-amber-700' : 'text-gray-700 hover:bg-gray-50 hover:text-amber-700'
                            }`}
                          >
                            <Icon size={18} />
                            <span>{link.name}</span>
                          </motion.div>
                        </Link>
                      </div>
                    )
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  )
}
