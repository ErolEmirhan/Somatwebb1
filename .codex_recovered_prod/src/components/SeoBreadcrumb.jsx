import { Link } from 'react-router-dom'

export default function SeoBreadcrumb({ items }) {
  if (!items?.length) return null

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={item.path} className="flex items-center gap-2">
              {index > 0 && <span className="text-gray-300" aria-hidden="true">/</span>}
              {isLast ? (
                <span className="text-gray-700 font-medium">{item.label}</span>
              ) : (
                <Link to={item.path} className="hover:text-amber-700 transition-colors">
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
