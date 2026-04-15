import { BRAND, BRAND_LOGO_PATH } from '../config/brand'

/** Yükseklik sabit, genişlik logonun en–boy oranına göre (daire / kırpma yok). */
const SIZE_CLASSES = {
  nav: 'h-11 md:h-[3.25rem]',
  footer: 'h-14',
  hero: 'h-24 md:h-28',
  splash: 'h-32 md:h-40',
}

/**
 * Resmî logo: çerçeve veya dairesel maske yok; `object-contain` ile tam görünür.
 */
export default function BrandLogo({
  variant = 'nav',
  className = '',
  imageClassName = '',
  alt,
}) {
  const height = SIZE_CLASSES[variant] ?? SIZE_CLASSES.nav
  return (
    <div className={`inline-flex flex-shrink-0 items-center justify-center ${height} ${className}`}>
      <img
        src={BRAND_LOGO_PATH}
        alt={alt ?? `${BRAND.name} — resmî logo`}
        className={`h-full w-auto max-h-full object-contain object-center ${imageClassName}`}
        draggable={false}
      />
    </div>
  )
}
