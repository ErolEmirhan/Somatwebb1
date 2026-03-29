import { useState, useEffect } from 'react'
import { ImageIcon } from 'lucide-react'
import { resolveMenuImageSrc } from '../utils/resolveMenuImageSrc'

/**
 * Ürün satırı solunda dairesel görsel alanı.
 * product.image: veritabanından gelen base64 veya data URL (opsiyonel).
 */
const baseWrap =
  'relative flex-shrink-0 w-[68px] h-[68px] sm:w-[76px] sm:h-[76px] rounded-full border-2 border-amber-200/90 bg-gradient-to-br from-amber-50 to-amber-100/80 overflow-hidden shadow-inner flex items-center justify-center'

export default function MenuProductThumbnail({ product, className = '', onOpenPreview }) {
  const [broken, setBroken] = useState(false)
  const src = resolveMenuImageSrc(product?.image)

  useEffect(() => {
    setBroken(false)
  }, [product?.image])

  const showImage = Boolean(src) && !broken
  const clickable = Boolean(showImage && onOpenPreview)

  const inner = (
    <>
      {showImage ? (
        <img
          src={src}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
          onError={() => setBroken(true)}
        />
      ) : null}
      {!showImage && (
        <ImageIcon className="w-8 h-8 sm:w-9 sm:h-9 text-amber-400/45 stroke-[1.25]" aria-hidden />
      )}
    </>
  )

  if (clickable) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onOpenPreview()
        }}
        className={`${baseWrap} cursor-pointer transition-transform duration-200 hover:scale-[1.04] hover:border-amber-400/90 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 ${className}`}
        aria-label={`${product?.name ?? 'Ürün'} görselini büyüt`}
      >
        {inner}
      </button>
    )
  }

  return <div className={`${baseWrap} ${className}`}>{inner}</div>
}
