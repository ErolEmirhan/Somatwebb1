import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { BRAND } from '../config/brand'
import BrandLogo from './BrandLogo'

const SPLASH_LINES = ['Selçuklu & Mevlevi', 'Osmanlı & Konya', 'Tarihi mutfak']

export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2500)
    return () => clearTimeout(timer)
  }, [onFinish])

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center px-6"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -12 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.75, ease: [0.34, 1.56, 0.64, 1] }}
        className="mb-6 drop-shadow-xl"
      >
        <BrandLogo variant="splash" />
      </motion.div>

      <motion.h1
        className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight text-center gradient-gold-text"
        style={{ textShadow: '2px 2px 4px rgba(212, 175, 55, 0.15)' }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.2 }}
      >
        {BRAND.name}
      </motion.h1>

      <motion.p
        className="mt-3 text-sm md:text-base text-amber-900/70 text-center max-w-md font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
      >
        {BRAND.shortDescription}
      </motion.p>

      <motion.div className="mt-8 flex flex-col items-center gap-3">
        {SPLASH_LINES.map((item, index) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.65 + index * 0.1 }}
            className="relative"
          >
            <p className="text-base md:text-lg font-medium text-gray-700 tracking-wide text-center">{item}</p>
            <motion.div
              className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.35, delay: 0.75 + index * 0.1 }}
            />
          </motion.div>
        ))}
      </motion.div>

      <div className="flex gap-2 mt-10">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-3 h-3 bg-amber-500 rounded-full"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, delay: index * 0.2, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <motion.div
        className="absolute top-20 left-20 w-32 h-32 border-4 border-amber-200 rounded-full"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.3, rotate: 360 }}
        transition={{ duration: 2, ease: 'easeOut' }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-40 h-40 border-4 border-amber-200 rounded-full"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.3, rotate: -360 }}
        transition={{ duration: 2, ease: 'easeOut', delay: 0.2 }}
      />
    </motion.div>
  )
}
