import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import { BRAND, BRAND_LOGO_PATH } from '../config/brand'
import { PAGE_SEO, SITE_URL, DEFAULT_META, DEFAULT_OG_IMAGE } from '../seo.config'

export default function SEOHead() {
  const { pathname } = useLocation()
  const seo = PAGE_SEO[pathname] || DEFAULT_META
  const title = seo.title || DEFAULT_META.title
  const description = seo.description || DEFAULT_META.description
  const canonical = seo.canonical || `${SITE_URL}${pathname === '/' ? '' : pathname}`

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta property="og:image" content={DEFAULT_OG_IMAGE} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:alt" content={`${BRAND.name} — resmî logo`} />
      <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
      <meta name="twitter:image:alt" content={`${BRAND.name} — resmî logo`} />
      <link rel="icon" type="image/png" href={BRAND_LOGO_PATH} sizes="48x48" />
      <link rel="icon" type="image/png" href={BRAND_LOGO_PATH} sizes="32x32" />
      <link rel="icon" type="image/png" href={BRAND_LOGO_PATH} sizes="192x192" />
      <link rel="shortcut icon" type="image/png" href={BRAND_LOGO_PATH} />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="apple-touch-icon" href={BRAND_LOGO_PATH} />
    </Helmet>
  )
}
