import { Link } from 'react-router-dom'
import { Phone, MapPin, Clock } from 'lucide-react'
import { BRAND } from '../config/brand'
import {
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
  CONTACT_ADDRESS_LINE,
  CONTACT_HOURS_WEEKDAY,
  CONTACT_HOURS_WEEKEND,
  contactMapsSearchUrl,
} from '../config/contact'
import BrandLogo from './BrandLogo'

export default function Footer() {
  const quickLinks = [
    { name: 'Anasayfa', path: '/' },
    { name: 'Hakkımızda', path: '/hakkimizda' },
    { name: 'Galeri', path: '/galeri' },
    { name: 'Menü', path: '/menu' },
    { name: 'İletişim', path: '/iletisim' },
  ]

  return (
    <footer className="relative bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 text-white overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl" />
      </div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

      <div className="container-custom py-16 sm:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <BrandLogo variant="footer" alt="" />
              <div>
                <p className="font-display font-bold text-xl text-white tracking-tight">{BRAND.name}</p>
                <p className="text-amber-400/90 text-sm mt-1 max-w-xs">{BRAND.shortDescription}</p>
              </div>
            </div>
            <h4 className="text-lg sm:text-xl font-bold mb-6 text-white tracking-tight">Sayfalar</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-amber-400 transition-all duration-300 hover:translate-x-2 inline-block text-sm sm:text-base font-medium group"
                  >
                    <span className="relative">
                      {link.name}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg sm:text-xl font-bold mb-6 text-white tracking-tight">İletişim</h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/20 backdrop-blur-sm p-3 rounded-xl border border-amber-500/30 flex-shrink-0">
                  <MapPin className="w-5 h-5 text-amber-400" />
                </div>
                <div className="pt-1">
                  <a
                    href={contactMapsSearchUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-amber-400 text-sm sm:text-base leading-relaxed transition-colors"
                  >
                    {CONTACT_ADDRESS_LINE} — haritada aç
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/20 backdrop-blur-sm p-3 rounded-xl border border-amber-500/30 flex-shrink-0">
                  <Phone className="w-5 h-5 text-amber-400" />
                </div>
                <a
                  href={CONTACT_PHONE_TEL}
                  className="text-gray-300 hover:text-amber-400 transition-colors duration-300 text-sm sm:text-base font-medium"
                >
                  {CONTACT_PHONE_DISPLAY}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg sm:text-xl font-bold mb-6 text-white tracking-tight">Çalışma Saatleri</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-4 bg-gradient-to-r from-amber-500/15 to-amber-600/15 backdrop-blur-sm rounded-2xl px-6 py-4 border border-amber-500/25">
                <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/20 backdrop-blur-sm p-3 rounded-xl border border-amber-500/30 flex-shrink-0 mt-0.5">
                  <Clock className="w-5 h-5 text-amber-400" />
                </div>
                <div className="space-y-3 min-w-0 flex-1">
                  <p className="text-amber-400 font-bold text-lg sm:text-xl tracking-wide">{CONTACT_HOURS_WEEKDAY}</p>
                  <p className="text-amber-400 font-bold text-lg sm:text-xl tracking-wide">{CONTACT_HOURS_WEEKEND}</p>
                </div>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm pt-2">Her gün sizlere hizmet vermekten mutluluk duyuyoruz.</p>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-700/50 relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
          <p className="text-gray-500 text-center text-xs sm:text-sm mb-4 max-w-2xl mx-auto">
            {BRAND.name} — {BRAND.tagline} Rezervasyon için bizi arayın.
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <p className="text-gray-400 text-xs sm:text-sm font-medium">
              2026 Emirhan Erol Tüm hakları saklıdır
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
