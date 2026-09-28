import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Clock, Phone } from 'lucide-react'
import SeoBreadcrumb from '../components/SeoBreadcrumb'
import { findMenuItemByName } from '../content/menuCatalog'
import { getSeoPageBySlug, getSeoPagePath } from '../content/seoPages'
import { resolveMenuImageSrc } from '../utils/resolveMenuImageSrc'
import { BRAND } from '../config/brand'
import {
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
  CONTACT_ADDRESS_LINE,
  CONTACT_HOURS_WEEKDAY,
  CONTACT_HOURS_WEEKEND,
  contactMapsDirectionsUrl,
} from '../config/contact'

function RelatedLinks({ relatedSlugs, currentSlug }) {
  const links = relatedSlugs
    .filter((slug) => slug !== currentSlug)
    .map((slug) => getSeoPageBySlug(slug))
    .filter(Boolean)

  if (!links.length) return null

  return (
    <aside className="pt-10 border-t border-gray-200">
      <h2 className="text-xl font-display font-bold text-gray-900 mb-4">İlgili içerikler</h2>
      <ul className="space-y-2">
        {links.map((page) => (
          <li key={page.slug}>
            <Link
              to={getSeoPagePath(page.slug)}
              className="text-amber-700 font-medium hover:text-amber-800 transition-colors"
            >
              {page.h1}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}

function ContactCta() {
  return (
    <section className="mt-12 rounded-2xl bg-amber-50/80 border border-amber-100 p-6 md:p-8">
      <h2 className="text-xl font-display font-bold text-gray-900 mb-4">
        {BRAND.name} — konum ve rezervasyon
      </h2>
      <ul className="space-y-3 text-gray-700 mb-6">
        <li className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden />
          <span>
            {CONTACT_ADDRESS_LINE} —{' '}
            <a
              href={contactMapsDirectionsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-700 font-medium hover:text-amber-800"
            >
              Yol tarifi al
            </a>
          </span>
        </li>
        <li className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden />
          <span>
            {CONTACT_HOURS_WEEKDAY}
            <br />
            {CONTACT_HOURS_WEEKEND}
          </span>
        </li>
        <li className="flex items-start gap-3">
          <Phone className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden />
          <a href={CONTACT_PHONE_TEL} className="text-amber-700 font-medium hover:text-amber-800">
            Rezervasyon: {CONTACT_PHONE_DISPLAY}
          </a>
        </li>
      </ul>
      <div className="flex flex-col sm:flex-row flex-wrap gap-3">
        <Link
          to="/menu"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold shadow-gold hover:from-amber-600 hover:to-amber-700 transition-colors"
        >
          Menüyü incele
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/menu/order"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-amber-600 text-amber-700 font-semibold hover:bg-amber-50 transition-colors"
        >
          Rezervasyon
        </Link>
        <Link
          to="/iletisim"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-gray-700 font-semibold hover:text-amber-700 transition-colors"
        >
          İletişim
        </Link>
      </div>
    </section>
  )
}

export default function SeoContentPage({ page }) {
  const menuMatch = page.menuItemName ? findMenuItemByName(page.menuItemName) : null
  const menuImageSrc = menuMatch ? resolveMenuImageSrc(menuMatch.item?.image) : null

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="overflow-hidden"
    >
      <section className="pt-28 pb-16 bg-gradient-to-b from-amber-50/80 to-white">
        <div className="container-custom max-w-3xl">
          <SeoBreadcrumb items={page.breadcrumbs} />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-6 leading-tight">
            {page.h1}
          </h1>
          {page.sections?.[0]?.type === 'p' &&
            page.sections[0].paragraphs?.map((p) => (
              <p key={p.slice(0, 40)} className="text-lg text-gray-700 leading-relaxed mb-4 last:mb-0">
                {p}
              </p>
            ))}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-custom max-w-3xl space-y-12">
          {page.sections?.slice(page.sections[0]?.type === 'p' ? 1 : 0).map((section) => (
            <article key={section.title ?? section.type}>
              {section.type === 'h2' && (
                <>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-4">
                    {section.title}
                  </h2>
                  {section.paragraphs?.map((p) => (
                    <p key={p.slice(0, 40)} className="text-gray-700 leading-relaxed mb-4 last:mb-0">
                      {p}
                    </p>
                  ))}
                </>
              )}
            </article>
          ))}

          {menuMatch && (
            <article className="rounded-2xl border border-gray-200 p-6 md:p-8 bg-gray-50/50">
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">Menüdeki ürün</h2>
              {menuImageSrc && (
                <img
                  src={menuImageSrc}
                  alt={`${menuMatch.item.name} — ${BRAND.name} menü`}
                  className="w-full max-w-md rounded-xl mb-4 object-cover"
                  loading="lazy"
                  decoding="async"
                />
              )}
              <p className="text-lg font-semibold text-gray-900">{menuMatch.item.name}</p>
              {menuMatch.item.price && (
                <p className="text-amber-700 font-medium mt-1">{menuMatch.item.price} ₺</p>
              )}
              {menuMatch.item.description && (
                <p className="text-gray-600 mt-2 leading-relaxed">{menuMatch.item.description}</p>
              )}
              <p className="mt-4">
                <Link to="/menu" className="text-amber-700 font-semibold hover:text-amber-800">
                  Tüm menüyü görüntüle
                </Link>
              </p>
            </article>
          )}

          <p className="text-gray-700">
            <Link
              to="/konyada-ne-yenir"
              className="text-amber-700 font-semibold hover:text-amber-800"
            >
              Konya&apos;da ne yenir rehberine dön
            </Link>
          </p>

          <RelatedLinks relatedSlugs={page.relatedSlugs} currentSlug={page.slug} />
          <ContactCta />
        </div>
      </section>
    </motion.div>
  )
}
