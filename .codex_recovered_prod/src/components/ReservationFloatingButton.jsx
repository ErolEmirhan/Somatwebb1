import { Phone } from 'lucide-react'
import { motion } from 'framer-motion'
import { CONTACT_PHONE_TEL } from '../config/contact'

export default function ReservationFloatingButton() {
  return (
    <motion.a
      href={CONTACT_PHONE_TEL}
      className="flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-4 rounded-full shadow-2xl hover:shadow-green-500/50 transition-all duration-300 group"
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Phone className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
      <span className="font-semibold text-base whitespace-nowrap">Rezervasyon</span>
    </motion.a>
  )
}
