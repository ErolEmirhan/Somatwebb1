/**
 * Config-driven SEO topical authority pages.
 */
import { SITE_URL } from '../config/siteUrl.js'

export const RESTAURANT_ENTITY_ID = `${SITE_URL}/#restaurant`

export const SEO_PAGES = [
  {
    slug: 'konyada-ne-yenir',
    level: 'pillar',
    cluster: 'konya-gastronomy',
    primaryIntent: 'Genel Konya gastronomi rehberi',
    title: "Konya'da Ne Yenir? Konya'nın Yöresel Lezzetleri | Sultan Somatı",
    description:
      "Konya'da ne yenir, yöresel ve geleneksel lezzetler, Selçuklu ve Mevlevi mutfağı rehberi. Sultan Somatı menü ve rezervasyon.",
    h1: "Konya'da Ne Yenir? Selçuklu, Mevlevi ve Konya Mutfağı Rehberi",
    breadcrumbs: [
      { label: 'Ana Sayfa', path: '/' },
      { label: "Konya'da Ne Yenir", path: '/konyada-ne-yenir' },
    ],
    relatedSlugs: [
      'konya-yoresel-yemekleri',
      'selcuklu-mutfagi',
      'osmanli-mutfagi-konya',
      'konya-bamya-corbasi',
      'konya-kuyu-tandir-kebabi',
      'konya-et-tiridi',
      'mevlana-yakininda-restoran',
    ],
    lastModified: '2026-08-18',
    sections: [
      {
        type: 'p',
        paragraphs: [
          "Konya, tarihi mutfak kültürü ve yöresel ürünleriyle ziyaretçilere zengin bir gastronomi deneyimi sunan bir şehir. Çorbalar, et yemekleri, börekler, tatlılar ve şerbetler Konya sofralarının temel parçalarıdır.",
          "Sultan Somatı olarak Selçuklu, Mevlevi, Osmanlı ve Konya mutfaklarından seçkileri aynı sofrada buluşturuyoruz.",
        ],
      },
      {
        type: 'h2',
        title: "Konya'nın yöresel ve geleneksel lezzetleri",
        paragraphs: [
          "Konya mutfağında etli yemekler, güveç ve tencere yemekleri, tahin ve cevizle zenginleştirilen soğuk başlangıçlar, ev yapımı tatlılar ve geleneksel şerbetler sıkça tercih edilir.",
        ],
      },
      {
        type: 'h2',
        title: 'Selçuklu mutfağı',
        paragraphs: [
          "Selçuklu mutfağı, Anadolu'nun tarihi dönemlerinden gelen çorba, kalye ve güveç yemekleriyle tanınır. Menümüzde Selçuklu geleneğinden çorbalar, kalyeler ve güveçte pişen ana yemekler yer alır.",
        ],
      },
      {
        type: 'h2',
        title: 'Mevlevi mutfağı',
        paragraphs: [
          "Mevlevi mutfağı, geleneksel pişirme yöntemleriyle hazırlanan yemekleriyle bilinir. Restoranımızda Mevlevi seçkiler, Selçuklu ve Osmanlı lezzetleriyle birlikte sunulur.",
        ],
      },
    ],
  },
  {
    slug: 'konya-yoresel-yemekleri',
    level: 'pillar',
    cluster: 'konya-gastronomy',
    primaryIntent: 'Konya yöresel yemekleri ve Konya mutfağı menü bağlantısı',
    title: 'Konya Yöresel Yemekleri | Sultan Somatı',
    description:
      'Konya yöresel yemekleri ve Konya mutfağı: bamya çorbası, kuyu tandır, güveçte tiridi. Menüdeki güncel seçkiler.',
    h1: 'Konya Yöresel Yemekleri',
    breadcrumbs: [
      { label: 'Ana Sayfa', path: '/' },
      { label: "Konya'da Ne Yenir", path: '/konyada-ne-yenir' },
      { label: 'Konya Yöresel Yemekleri', path: '/konya-yoresel-yemekleri' },
    ],
    relatedSlugs: [
      'konya-bamya-corbasi',
      'konya-kuyu-tandir-kebabi',
      'konya-et-tiridi',
      'konyada-ne-yenir',
    ],
    menuPanelId: 'konya',
    lastModified: '2026-08-18',
    sections: [
      {
        type: 'p',
        paragraphs: [
          'Konya yöresel yemekleri, tahıl ve et ağırlıklı tencere yemekleri, kurutulmuş sebze kalyeleri, çorbalar ve ev yapımı tatlılarla zengin bir çeşitlilik sunar.',
        ],
      },
      {
        type: 'h2',
        title: 'Çorbalar ve ana yemekler',
        paragraphs: [
          'Konya mutfağında bamya çorbası, kuyu tandırda pişen etler ve güveçte hazırlanan tiridi gibi yemekler sıkça aranır.',
        ],
      },
      {
        type: 'h2',
        title: 'Menümüzde Konya Mutfağı',
        paragraphs: [
          'Konya Mutfağı panelimizde bamya çorbası, kuyu tandır kebabı ve güveçte et tiridi listelenir. Dört Mutfak Tadım Menüsü ile Selçuklu, Mevlevi ve Osmanlı geleneklerini aynı ziyarette deneyimleyebilirsiniz.',
        ],
      },
    ],
  },
  {
    slug: 'selcuklu-mutfagi',
    level: 'cuisine',
    cluster: 'cuisine-authority',
    primaryIntent: 'Selçuklu ve Mevlevi mutfağı — menü paneli',
    title: 'Selçuklu ve Mevlevi Mutfağı | Sultan Somatı – Konya',
    description:
      'Selçuklu ve Mevlevi mutfağı: çorbalar, kalyeler ve güveç yemekleri. Sultan Somatı Selçuklu Mevlevi Mutfağı menü paneli.',
    h1: 'Selçuklu ve Mevlevi Mutfağı',
    breadcrumbs: [
      { label: 'Ana Sayfa', path: '/' },
      { label: "Konya'da Ne Yenir", path: '/konyada-ne-yenir' },
      { label: 'Selçuklu ve Mevlevi Mutfağı', path: '/selcuklu-mutfagi' },
    ],
    relatedSlugs: ['osmanli-mutfagi-konya', 'konya-yoresel-yemekleri', 'konyada-ne-yenir'],
    menuPanelId: 'selcuklu-mevlevi',
    lastModified: '2026-08-18',
    sections: [
      {
        type: 'p',
        paragraphs: [
          'Selçuklu mutfağı, Anadolu coğrafyasında şekillenen çorba, kalye ve güveç yemekleriyle tanınır. Kurutulmuş sebzelerle hazırlanan kalyeler bu geleneğin ayırt edici örnekleridir.',
        ],
      },
      {
        type: 'h2',
        title: 'Mevlevi mutfağı',
        paragraphs: [
          "Mevlevi mutfağı, geleneksel pişirme yöntemleriyle hazırlanan yemekleriyle bilinir. Konya'nın kültürel mirasıyla ilişkili bu sofra geleneği çorbalar ve ana yemeklerde sade ama derin lezzetler sunar.",
        ],
      },
      {
        type: 'h2',
        title: 'Menümüzde Selçuklu Mevlevi seçkiler',
        paragraphs: [
          'Tarhana ve tutmaç çorbaları, kalyeler, hurmalı erikli dana biryan, hassaten lokma ve vişneli kuzu incik gibi yemekler Selçuklu Mevlevi Mutfağı panelimizde listelenir.',
        ],
      },
    ],
  },
  {
    slug: 'osmanli-mutfagi-konya',
    level: 'cuisine',
    cluster: 'cuisine-authority',
    primaryIntent: 'Osmanlı mutfağı — ayrı menü paneli',
    title: 'Osmanlı Mutfağı Konya | Sultan Somatı',
    description:
      'Osmanlı mutfağı Konya: çorbalar, börekler ve saray usulü ana yemekler. Sultan Somatı Osmanlı Mutfağı menü paneli.',
    h1: 'Osmanlı Mutfağı Konya',
    breadcrumbs: [
      { label: 'Ana Sayfa', path: '/' },
      { label: "Konya'da Ne Yenir", path: '/konyada-ne-yenir' },
      { label: 'Osmanlı Mutfağı Konya', path: '/osmanli-mutfagi-konya' },
    ],
    relatedSlugs: ['selcuklu-mutfagi', 'konya-yoresel-yemekleri', 'konyada-ne-yenir'],
    menuPanelId: 'osmanli',
    lastModified: '2026-08-18',
    sections: [
      {
        type: 'p',
        paragraphs: [
          "Osmanlı mutfağı, saray ve şehir sofralarında şekillenen çorba, börek ve ana yemek geleneğini Konya'ya taşır.",
        ],
      },
      {
        type: 'h2',
        title: 'Osmanlı Mutfağı menü seçkileri',
        paragraphs: [
          'Çeşmi nigar çorbası, su börekleri, tavuklu mahmudiye, dana seferceliye, kuzu mutancana ve saray usulü tavuk menümüzde yer alır.',
        ],
      },
    ],
  },
  {
    slug: 'konya-bamya-corbasi',
    level: 'dish',
    cluster: 'dish-cluster',
    primaryIntent: 'Konya bamya çorbası — menüdeki ürün',
    title: 'Konya Bamya Çorbası | Sultan Somatı Menüsü',
    description:
      'Konya bamya çorbası: kurutulmuş çiçek bamya ve dana etiyle hazırlanan geleneksel çorba. Menü ve fiyat.',
    h1: 'Konya Bamya Çorbası',
    breadcrumbs: [
      { label: 'Ana Sayfa', path: '/' },
      { label: "Konya'da Ne Yenir", path: '/konyada-ne-yenir' },
      { label: 'Konya Bamya Çorbası', path: '/konya-bamya-corbasi' },
    ],
    relatedSlugs: ['konya-yoresel-yemekleri', 'konyada-ne-yenir', 'konya-kuyu-tandir-kebabi'],
    menuItemName: 'Bamya Çorbası',
    menuPanelId: 'konya',
    lastModified: '2026-08-18',
    sections: [
      {
        type: 'p',
        paragraphs: [
          'Bamya çorbası, Konya mutfağında kurutulmuş çiçek bamya ve etle hazırlanan geleneksel bir çorbadır. Menümüzde un, yağ, kuru soğan, kurutulmuş çiçek bamya, dana eti ve baharatlarla hazırlanır.',
        ],
      },
      {
        type: 'h2',
        title: 'Menümüzdeki sunum',
        paragraphs: [
          'Güncel fiyat ve içerik açıklaması menü sayfasında Konya Mutfağı bölümünde listelenir.',
        ],
      },
    ],
  },
  {
    slug: 'konya-kuyu-tandir-kebabi',
    level: 'dish',
    cluster: 'dish-cluster',
    primaryIntent: 'Kuyu tandır kebabı — menüdeki ürün',
    title: 'Konya Kuyu Tandır Kebabı | Sultan Somatı',
    description:
      'Kuyu tandır kebabı: uzun süre pişen kemiksiz kuzu eti. Konya mutfağı menüsünde güncel fiyat.',
    h1: 'Konya Kuyu Tandır Kebabı',
    breadcrumbs: [
      { label: 'Ana Sayfa', path: '/' },
      { label: "Konya'da Ne Yenir", path: '/konyada-ne-yenir' },
      { label: 'Kuyu Tandır Kebabı', path: '/konya-kuyu-tandir-kebabi' },
    ],
    relatedSlugs: ['konya-et-tiridi', 'konya-yoresel-yemekleri', 'konyada-ne-yenir'],
    menuItemName: 'Kuyu Tandır Kebabı',
    menuPanelId: 'konya',
    lastModified: '2026-08-18',
    sections: [
      {
        type: 'p',
        paragraphs: [
          'Kuyu tandır kebabı, kuyu tandırda bakır tencere içerisinde kendi yağında uzun süre pişirilen kemiksiz kuzu etinden hazırlanır.',
        ],
      },
      {
        type: 'h2',
        title: 'Menümüzde',
        paragraphs: [
          'Konya Mutfağı ana yemekler bölümünde listelenir. Pişirme süresi ve malzeme detayları menü açıklamasında belirtilmiştir.',
        ],
      },
    ],
  },
  {
    slug: 'konya-et-tiridi',
    level: 'dish',
    cluster: 'dish-cluster',
    primaryIntent: 'Güveçte et tiridi — menüdeki ürün',
    title: 'Konya Et Tiridi (Güveçte) | Sultan Somatı',
    description:
      'Güveçte et tiridi: pide, yoğurt ve dana kavurma ile Konya mutfağından tiridi. Menü ve fiyat.',
    h1: 'Konya Et Tiridi — Güveçte Sunum',
    breadcrumbs: [
      { label: 'Ana Sayfa', path: '/' },
      { label: "Konya'da Ne Yenir", path: '/konyada-ne-yenir' },
      { label: 'Konya Et Tiridi', path: '/konya-et-tiridi' },
    ],
    relatedSlugs: ['konya-kuyu-tandir-kebabi', 'konya-yoresel-yemekleri', 'konyada-ne-yenir'],
    menuItemName: 'Güveçte Et Tiridi',
    menuPanelId: 'konya',
    lastModified: '2026-08-18',
    sections: [
      {
        type: 'p',
        paragraphs: [
          'Güveçte et tiridi, toprak güveç kabında pide üzerine yoğurt, sumaklı soğan, dana kavurma, maydanoz, tereyağı ve baharatlarla hazırlanan Konya mutfağından bir ana yemektir.',
        ],
      },
      {
        type: 'h2',
        title: 'Menüdeki tiridi',
        paragraphs: [
          'Ürün adı ve içerik detayları menü sayfasında Konya Mutfağı bölümünde güncel fiyatla yer alır.',
        ],
      },
    ],
  },
  {
    slug: 'mevlana-yakininda-restoran',
    level: 'local',
    cluster: 'local-intent',
    primaryIntent: 'Mevlana bölgesi yakınında restoran — doğrulanabilir konum',
    title: 'Mevlana Yakınında Restoran | Sultan Somatı – Konya',
    description:
      'Mevlana Müzesi bölgesine yakın konumda restoran. Harita, çalışma saatleri ve menü.',
    h1: 'Mevlana Yakınında Restoran',
    breadcrumbs: [
      { label: 'Ana Sayfa', path: '/' },
      { label: "Konya'da Ne Yenir", path: '/konyada-ne-yenir' },
      { label: 'Mevlana Yakınında Restoran', path: '/mevlana-yakininda-restoran' },
    ],
    relatedSlugs: ['konyada-ne-yenir', 'konya-yoresel-yemekleri'],
    lastModified: '2026-08-18',
    sections: [
      {
        type: 'p',
        paragraphs: [
          'Konya ziyaretinde Mevlana Müzesi çevresinde zaman geçiren misafirler için merkezde erişilebilir bir konumda hizmet veriyoruz. Harita koordinatlarımız ile Mevlana Müzesi yaklaşık konumu arasındaki mesafe yaklaşık 400 metre civarındadır.',
        ],
      },
      {
        type: 'h2',
        title: 'Yol tarifi ve rezervasyon',
        paragraphs: [
          'İletişim sayfasındaki harita üzerinden yol tarifi alabilir veya telefonla rezervasyon yapabilirsiniz.',
        ],
      },
    ],
  },
]

export function getSeoPageBySlug(slug) {
  return SEO_PAGES.find((p) => p.slug === slug) ?? null
}

export function getSeoPageByPath(pathname) {
  if (!pathname || pathname === '/') return null
  const slug = pathname.replace(/^\//, '').replace(/\/$/, '')
  return getSeoPageBySlug(slug)
}

export function getSeoPagePath(slug) {
  return `/${slug}`
}

export function getSeoContentPaths() {
  return SEO_PAGES.map((p) => getSeoPagePath(p.slug))
}

export function getIndexablePaths() {
  const base = ['/', '/menu', '/hakkimizda', '/galeri', '/iletisim', '/menu/order']
  return [...new Set([...base, ...getSeoContentPaths()])]
}

export function getPrerenderPaths() {
  return getIndexablePaths().filter((p) => p !== '/menu/order')
}

export function buildSeoPageMeta() {
  const map = {}
  for (const page of SEO_PAGES) {
    const path = getSeoPagePath(page.slug)
    map[path] = {
      title: page.title,
      description: page.description,
      canonical: `${SITE_URL}${path}`,
      breadcrumbs: page.breadcrumbs,
    }
  }
  return map
}
