import { motion } from 'framer-motion'
import { MapPin, Phone, Clock, Instagram } from 'lucide-react'
import {
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
  CONTACT_ADDRESS_LINE,
  CONTACT_INSTAGRAM_URL,
  CONTACT_HOURS_WEEKDAY,
  CONTACT_HOURS_WEEKEND,
  contactMapsSearchUrl,
  contactMapsEmbedUrl,
} from '../config/contact'

export default function Contact() {
  const contactInfo = [
    {
      icon: MapPin,
      title: 'Adres & yol tarifi',
      content: `${CONTACT_ADDRESS_LINE} — Google Haritalar’da konum`,
      link: contactMapsSearchUrl(),
    },
    {
      icon: Phone,
      title: 'Telefon',
      content: CONTACT_PHONE_DISPLAY,
      link: CONTACT_PHONE_TEL,
    },
    {
      icon: Instagram,
      title: 'Instagram',
      content: '@sultansomati',
      link: CONTACT_INSTAGRAM_URL,
    },
    {
      icon: Clock,
      title: 'Çalışma Saatleri',
      content: `${CONTACT_HOURS_WEEKDAY}\n${CONTACT_HOURS_WEEKEND}`,
      link: null,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="overflow-hidden"
    >
      <section className="py-24 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-display font-bold mb-8">Bize Ulaşın</h2>
              <p className="text-gray-600 text-lg mb-8">
                Rezervasyon, özel gün organizasyonları veya sorularınız için bizimle iletişime geçin. En kısa sürede size dönüş yapacağız.
              </p>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-4 bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{info.title}</h3>
                      {info.link ? (
                        <a
                          href={info.link}
                          target={info.link.startsWith('http') ? '_blank' : undefined}
                          rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="text-gray-600 hover:text-amber-600 transition-colors"
                        >
                          {info.content}
                        </a>
                      ) : (
                        <p className="text-gray-600 whitespace-pre-line">{info.content}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="mt-8 rounded-2xl overflow-hidden shadow-2xl bg-gray-200"
                style={{ height: '450px' }}
              >
                <iframe
                  src={contactMapsEmbedUrl()}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Sultan Somatı konum"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  )
}
