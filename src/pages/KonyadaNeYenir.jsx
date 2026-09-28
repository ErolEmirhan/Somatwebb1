import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Clock, Phone } from 'lucide-react'
import SeoBreadcrumb from '../components/SeoBreadcrumb'
import { getSeoPageBySlug, getSeoPagePath } from '../content/seoPages'
import { BRAND } from '../config/brand'
import {
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
  CONTACT_ADDRESS_LINE,
  CONTACT_HOURS_WEEKDAY,
  CONTACT_HOURS_WEEKEND,
  contactMapsDirectionsUrl,
} from '../config/contact'

export default function KonyadaNeYenir() {
  const hubPage = getSeoPageBySlug('konyada-ne-yenir')
  const hubLinks = (hubPage?.relatedSlugs ?? [])
    .map((slug) => getSeoPageBySlug(slug))
    .filter(Boolean)

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
          <SeoBreadcrumb items={hubPage?.breadcrumbs} />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-6 leading-tight">
            {hubPage?.h1 ?? "Konya'da Ne Yenir? Selçuklu, Mevlevi ve Konya Mutfağı Rehberi"}
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Konya, tarihi mutfak kültürü ve yöresel ürünleriyle ziyaretçilere zengin bir gastronomi
            deneyimi sunan bir şehir. Çorbalar, et yemekleri, börekler, tatlılar ve şerbetler
            Konya sofralarının temel parçalarıdır.
          </p>
          <p className="text-gray-600 leading-relaxed">
            {BRAND.name} olarak Selçuklu, Mevlevi, Osmanlı ve Konya mutfaklarından seçkileri aynı
            sofrada buluşturuyoruz. Aşağıda Konya&apos;da aranan lezzet türlerini ve restoranımızın
            yaklaşımını özetliyoruz.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-custom max-w-3xl space-y-14">
          <article>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-4">
              Konya&apos;nın yöresel ve geleneksel lezzetleri
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Konya mutfağında etli yemekler, güveç ve tencere yemekleri, tahin ve cevizle
              zenginleştirilen soğuk başlangıçlar, ev yapımı tatlılar ve geleneksel şerbetler sıkça
              tercih edilir. Şehirde yemek arayan misafirler hem günlük sofralar hem de özel günler
              için bu çeşitlilikten seçim yapabilir.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Menümüzde çorbalar, ana yemekler, salatalar, içecekler ve tatlı kategorileri güncel
              fiyatlarla listelenmiştir.
            </p>
          </article>

          <article>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-4">
              Selçuklu mutfağı
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Selçuklu mutfağı, Anadolu&apos;nun tarihi dönemlerinden gelen çorba, kalye ve güveç
              yemekleriyle tanınır. Sultan Somatı menüsünde Selçuklu geleneğinden çorbalar, kalyeler
              ve güveçte pişen ana yemekler yer alır.
            </p>
          </article>

          <article>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-4">
              Mevlevi mutfağı
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Mevlevi mutfağı, ölçülü kullanım ve geleneksel pişirme yöntemleriyle hazırlanan
              yemekleriyle bilinir. Restoranımızda Mevlevi mutfağından seçkiler, Selçuklu ve Osmanlı
              lezzetleriyle birlikte sunulur.
            </p>
          </article>

          <article>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-4">
              {BRAND.name}&apos;nın mutfak yaklaşımı
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {BRAND.tagline} Her tabakta lezzet ve sunum bütünlüğüne özen gösteriyoruz; taze
              malzemeler ve şef ekibimizin titiz çalışması sofralarınıza ulaşıyor.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Aile yemekleri ve özel günler için sıcak atmosfer ve misafir odaklı hizmet sunuyoruz.
              Hikayemiz ve değerlerimiz için{' '}
              <Link to="/hakkimizda" className="text-amber-700 font-semibold hover:text-amber-800">
                Hakkımızda
              </Link>{' '}
              sayfasına bakabilirsiniz.
            </p>
          </article>

          {hubLinks.length > 0 && (
            <article>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-4">
                Konya gastronomi rehberi
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Aşağıdaki sayfalar Konya yemekleri, mutfak gelenekleri ve menümüzdeki ürünler hakkında
                ayrıntılı bilgi sunar.
              </p>
              <ul className="space-y-2">
                {hubLinks.map((page) => (
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
            </article>
          )}

          <article>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-4">
              Konya&apos;da yemek ve ziyaret planı
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Konya merkezde, tarihi çevreyle birlikte yemek planı yapmak isteyen misafirler için
              konumumuz harita üzerinden kolayca görüntülenebilir. Hafta içi ve hafta sonu çalışma
              saatlerimiz farklıdır; şehir gezisinden önce veya sonra rezervasyon yaparak soframızda
              yer ayırtabilirsiniz.
            </p>
            <ul className="space-y-3 text-gray-700">
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
          </article>

          <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-4">
            <Link
              to="/menu"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold shadow-gold hover:from-amber-600 hover:to-amber-700 transition-colors"
            >
              Menüyü İncele
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/menu/order"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-amber-600 text-amber-700 font-semibold hover:bg-amber-50 transition-colors"
            >
              Rezervasyon
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-gray-700 font-semibold hover:text-amber-700 transition-colors"
            >
              {BRAND.name} Ana Sayfa
            </Link>
          </div>
        </div>
      </section>
    </motion.div>
  )
}
