import { Helmet } from 'react-helmet-async'
import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { BRAND } from '../config/brand'
import { buildPageJsonLd } from '../config/seoStructuredData'
import { PAGE_SEO, SITE_URL, DEFAULT_META, DEFAULT_OG_IMAGE } from '../seo.config'

export default function SEOHead() {
  const { pathname } = useLocation()
  const seo = PAGE_SEO[pathname] || DEFAULT_META
  const title = seo.title || DEFAULT_META.title
  const description = seo.description || DEFAULT_META.description
  const canonical =
    seo.canonical ||
    `${SITE_URL}${pathname === '/' ? '/' : pathname}`

  const jsonLd = buildPageJsonLd(seo.breadcrumbs)

  // Build-time prerender head etiketlerini kaldır; Helmet tek kaynak olur (çift canonical önlenir)
  useLayoutEffect(() => {
    document.querySelectorAll('[data-seo-prerender="1"]').forEach((node) => node.remove())
  }, [pathname])

  return (
    <Helmet>
      <html lang="tr" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta name="robots" content="index, follow" />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={BRAND.name} />
      <meta property="og:locale" content="tr_TR" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={DEFAULT_OG_IMAGE} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:alt" content={`${BRAND.name} — resmî logo`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
      <meta name="twitter:image:alt" content={`${BRAND.name} — resmî logo`} />

      <link rel="icon" type="image/png" href="/favicon-32.png" sizes="32x32" />
      <link rel="shortcut icon" type="image/png" href="/favicon-32.png" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  )
}
