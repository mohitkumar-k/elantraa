import { Helmet } from 'react-helmet-async'

function Seo({ title, description }) {
  const fullTitle = title ? `${title} | ELANTRAA` : 'ELANTRAA'

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta
        name="description"
        content={
          description || 'Premium Indian fashion e-commerce destination for festive wear, sarees, lehengas, and kurtis.'
        }
      />
      <meta name="theme-color" content="#FFFFFF" />
    </Helmet>
  )
}

export default Seo
