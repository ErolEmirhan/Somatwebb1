import { Instagram } from 'lucide-react'
import { motion } from 'framer-motion'
import { CONTACT_INSTAGRAM_URL } from '../config/contact'

export default function InstagramFloatingButton() {
  return (
    <motion.a
      href={CONTACT_INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white px-5 py-4 rounded-full shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 group"
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Instagram className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
      <span className="font-semibold text-base whitespace-nowrap">Bizi Takip Edin</span>
    </motion.a>
  )
}
