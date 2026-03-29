import { motion } from 'framer-motion'
import { Phone, MapPin, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
  CONTACT_ADDRESS_LINE,
  contactMapsSearchUrl,
} from '../config/contact'

export default function Order() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="overflow-hidden"
    >
      <section className="py-24 bg-gray-50">
        <div className="container-custom max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">Rezervasyon & Sipariş</h1>
            <p className="text-lg text-gray-600">
              Masanızı ayırtmak veya paket / gel-al siparişi vermek için bizi arayın veya iletişime geçin.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
          >
            <div className="p-8 space-y-6">
              <a
                href={CONTACT_PHONE_TEL}
                className="flex items-center gap-4 p-4 rounded-xl bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors group"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-gold">
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <div className="text-left">
                  <span className="block text-sm text-gray-500 font-medium">Telefon</span>
                  <span className="text-xl font-bold text-gray-900">{CONTACT_PHONE_DISPLAY}</span>
                </div>
              </a>

              <a
                href={contactMapsSearchUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-amber-50/80 border border-transparent hover:border-amber-200 transition-colors"
              >
                <MapPin className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <span className="block text-sm text-gray-500 font-medium">Adres & yol tarifi</span>
                  <p className="text-gray-900 font-medium">{CONTACT_ADDRESS_LINE}</p>
                  <p className="text-amber-600 text-sm mt-1">Haritada aç →</p>
                </div>
              </a>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
                <Clock className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <span className="block text-sm text-gray-500 font-medium">Çalışma Saatleri</span>
                  <p className="text-gray-900">Pazartesi - Pazar: 12:00 - 00:00</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-gray-600 text-sm">
                  Rezervasyonlarınızı en az 2 saat önceden yapmanızı rica ederiz. Özel gün ve toplu rezervasyonlar için lütfen telefonla iletişime geçin.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-center"
          >
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 text-amber-600 font-semibold hover:text-amber-700 transition-colors"
            >
              ← Menüye dön
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}
