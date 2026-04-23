import { Link } from 'react-router-dom'
import Seo from '../components/Seo'

function NotFoundPage() {
  return (
    <>
      <Seo title="404" />
      <section className="container-shell flex min-h-[60vh] items-center justify-center py-16">
        <div className="max-w-lg text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">404</p>
          <h1 className="heading-display mt-4 text-5xl text-[#24151d]">This page slipped out of style.</h1>
          <p className="mt-4 text-sm leading-7 text-[#6f5160]">The page you are looking for does not exist or may have moved.</p>
          <Link to="/" className="btn-primary mt-8">
            Back to Home
          </Link>
        </div>
      </section>
    </>
  )
}

export default NotFoundPage
