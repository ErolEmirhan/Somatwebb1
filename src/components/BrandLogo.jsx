import { BRAND, BRAND_LOGO_PATH } from '../config/brand'

const SIZE_CLASSES = {
  nav: 'h-11 w-11 md:h-[3.25rem] md:w-[3.25rem]',
  footer: 'h-14 w-14',
  hero: 'w-24 h-24 md:w-28 md:h-28',
  splash: 'w-28 h-28 md:w-36 md:h-36',
}

const DEFAULT_SURFACE =
  'bg-gradient-to-br from-amber-100 to-amber-50 ring-2 ring-amber-300/60'

/**
 * Logo, dairesel mask ile kırpılır (object-cover + hafif zoom).
 */
export default function BrandLogo({
  variant = 'nav',
  className = '',
  surfaceClass,
  imageClassName = '',
  alt,
}) {
  const box = SIZE_CLASSES[variant] ?? SIZE_CLASSES.nav
  const surface = surfaceClass ?? DEFAULT_SURFACE
  return (
    <div
      className={`rounded-full overflow-hidden flex-shrink-0 shadow-md ${surface} ${box} ${className}`}
    >
      <img
        src={BRAND_LOGO_PATH}
        alt={alt ?? BRAND.name}
        className={`h-full w-full object-cover object-center scale-[1.14] ${imageClassName}`}
        draggable={false}
      />
    </div>
  )
}
