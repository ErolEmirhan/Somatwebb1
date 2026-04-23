import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Heart, Award, Users, TrendingUp } from 'lucide-react'
import { useMenuProductImages } from '../hooks/useMenuProductImages'

export default function About() {
  const { entries } = useMenuProductImages()

  const storySlots = useMemo(() => {
    const fromMenu = entries.slice(0, 4).map((e) => ({ src: e.src, alt: e.title }))
    return [0, 1, 2, 3].map((i) => fromMenu[i] ?? null)
  }, [entries])
  const values = [
    { icon: Heart, title: 'Taze Malzeme', description: 'Günlük taze ürünlerle hazırlanan yemekler' },
    { icon: Award, title: 'Şef Deneyimi', description: 'Usta şeflerimizin özenle hazırladığı menü' },
    { icon: Users, title: 'Misafir Odaklı', description: 'Her misafirimize özel ilgi ve sıcak hizmet' },
    { icon: TrendingUp, title: 'Modern Lezzetler', description: 'Geleneksel ve modern tariflerin buluşması' },
  ]

  const timeline = [
    { year: '2018', title: 'Kuruluş', description: 'Kaliteli yemek ve sıcak atmosfer hayaliyle yola çıktık.' },
    { year: '2020', title: 'Menü Genişlemesi', description: 'Ana yemekler, ızgaralar ve tatlı kategorilerimizi zenginleştirdik.' },
    { year: '2023', title: 'Mekan Yenileme', description: 'Daha ferah ve modern bir ortamla hizmete devam ettik.' },
    { year: '2025', title: 'Bugün', description: 'Binlerce mutlu misafir ve unutulmaz sofralar sunmaya devam ediyoruz.' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="overflow-hidden"
    >
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Hikayemiz</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
                <p>
                  Sultan Somatı olarak, tarihi Türk mutfağı geleneğini yaşatan lezzetler ve özenli sunumla misafirlerimize unutulmaz bir deneyim sunmak için yola çıktık. Selçuklu, Mevlevi, Osmanlı ve Konya mutfaklarından seçkiler soframızda buluşuyor.
                </p>
                <p>
                  Taze ve doğal ürünlerle hazırlanan ana yemeklerimiz, ızgaralarımız ve ev yapımı tatlılarımız, şef ekibimizin titiz çalışmasıyla sofralarınıza ulaşıyor. Her tabak, lezzet ve sunum bütünlüğüyle tasarlanıyor.
                </p>
                <p>
                  Misafir memnuniyeti odaklı hizmet anlayışımız ve sıcak atmosferimizle, hem aile yemekleri hem de özel günleriniz için ideal bir adres olmaktan gurur duyuyoruz.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                {storySlots.map((slot, idx) => {
                  const wrap =
                    idx === 1 ? 'mt-8' : idx === 2 ? '-mt-8' : ''
                  return slot ? (
                    <img
                      key={idx}
                      src={slot.src}
                      alt={slot.alt}
                      decoding="async"
                      className={`rounded-2xl shadow-xl w-full h-48 sm:h-56 object-cover ${wrap}`}
                    />
                  ) : (
                    <div
                      key={idx}
                      className={`rounded-2xl shadow-inner w-full h-48 sm:h-56 bg-gradient-to-br from-amber-100 to-amber-200/80 ${wrap}`}
                      aria-hidden
                    />
                  )
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title">Değerlerimiz</h2>
            <p className="section-subtitle">Bizi biz yapan ilkeler</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 text-center hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title">Yolculuğumuz</h2>
            <p className="section-subtitle">Başlangıcımızdan bugüne</p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-8 pb-12 border-l-4 border-amber-600 last:pb-0"
              >
                <div className="absolute -left-4 top-0 w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-gold">
                  <div className="w-3 h-3 bg-white rounded-full" />
                </div>
                <div className="bg-gray-50 rounded-xl p-6 ml-8">
                  <div className="text-3xl font-bold text-amber-600 mb-2">{item.year}</div>
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Bizi Ziyaret Edin</h2>
            <p className="text-xl mb-8 text-amber-100 max-w-2xl mx-auto">
              Soframızda sizleri ağırlamaktan mutluluk duyarız.
            </p>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}
