import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { resolveMenuImageSrc } from '../utils/resolveMenuImageSrc'

export default function MenuProductImagePreview({
  open,
  onClose,
  product,
  panelTitle,
  sectionTitle,
}) {
  const src = product ? resolveMenuImageSrc(product.image) : null

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && src && product ? (
        <>
          <motion.button
            key="product-preview-backdrop"
            type="button"
            aria-label="Kapat"
            className="fixed inset-0 z-[100] bg-black/55 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <div className="fixed inset-0 z-[101] flex items-center justify-center p-3 sm:p-6 pointer-events-none">
            <motion.div
              key="product-preview-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="preview-product-title"
              className="pointer-events-auto w-full max-w-md max-h-[min(92vh,800px)] flex flex-col rounded-3xl bg-white shadow-2xl border border-amber-200/90 overflow-hidden"
              initial={{ scale: 0.86, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.86, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-gradient-to-b from-amber-50/80 to-amber-100/40 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 text-amber-900 shadow-md border border-amber-200/80 hover:bg-white transition-colors"
                  aria-label="Kapat"
                >
                  <X className="w-5 h-5" />
                </button>
                <img
                  src={src}
                  alt=""
                  className="w-full max-h-[min(48vh,420px)] object-contain mx-auto block"
                />
              </div>

              <div className="p-5 sm:p-6 overflow-y-auto flex-1 min-h-0">
                {(panelTitle || sectionTitle) && (
                  <p className="text-xs font-semibold text-amber-700/90 tracking-wide uppercase mb-2">
                    {[panelTitle, sectionTitle].filter(Boolean).join(' · ')}
                  </p>
                )}
                <h2
                  id="preview-product-title"
                  className="font-display text-xl sm:text-2xl font-bold text-gray-900 tracking-tight"
                >
                  {product.name}
                </h2>
                {product.glutenFree && (
                  <span className="inline-flex mt-2 items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                    GLUTEN İÇERMEZ
                  </span>
                )}
                {product.note && (
                  <p className="text-sm text-gray-500 mt-2">({product.note})</p>
                )}
                {product.description && (
                  <p className="text-sm text-gray-600 mt-3 leading-relaxed">{product.description}</p>
                )}
                <p className="mt-5 text-2xl sm:text-3xl font-bold text-amber-600 tabular-nums">
                  ₺{product.price}
                </p>
              </div>
            </motion.div>
          </div>
        </>
      ) : null}
    </AnimatePresence>
  )
}
