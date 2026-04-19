/**
 * Sol kenar: ince altın şerit + üçgen bayrak (lüks sarı gradient).
 * Üçgen, `relative` olan görsel/kapak sarmalayıcı içinde kullanılmalı (dikey orta).
 */
const RAIL_GRADIENT =
  'linear-gradient(180deg, #fffef9 0%, #fff7d6 14%, #fde68a 32%, #f5d04a 50%, #eab308 66%, #ca8a04 82%, #854d0e 96%, #5c370d 100%)'

export function CategoryLuxuryLeftRail({ className = '' }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute left-0 top-0 z-[8] h-full w-px sm:w-1 ${className}`}
      style={{
        background: RAIL_GRADIENT,
        boxShadow:
          '2px 0 14px rgba(0,0,0,0.16), inset -1px 0 0 rgba(255,255,255,0.42), inset 0 0 20px rgba(255,250,235,0.2)',
      }}
    />
  )
}

export function CategoryLuxuryTriangleFlag({ className = 'left-[3px] sm:left-1' }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute top-1/2 z-[8] h-[min(72%,2.85rem)] w-[clamp(11px,3vw,15px)] -translate-y-1/2 sm:h-[min(72%,3.35rem)] sm:w-4 ${className}`}
      style={{
        clipPath: 'polygon(0 8%, 0 92%, 100% 50%)',
        background:
          'linear-gradient(148deg, #fffef9 0%, #fef9c3 18%, #fde047 42%, #eab308 58%, #d97706 78%, #92400e 100%)',
        boxShadow:
          '2px 0 12px rgba(0,0,0,0.22), inset -1px 0 2px rgba(255,255,255,0.45), inset 0 0 12px rgba(255,252,240,0.35)',
      }}
    />
  )
}
