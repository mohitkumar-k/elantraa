import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Seo from '../components/Seo'
import { useAuth } from '../hooks/useAuth'

function AuthPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, register, loginWithGoogle } = useAuth()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  async function handleSubmit(event) {
    event.preventDefault()
    if (mode === 'login') {
      await login(form.email, form.password)
    } else {
      await register(form.name, form.email, form.password)
    }
    navigate(location.state?.from?.pathname || '/')
  }

  return (
    <>
      <Seo title="Login" />
      <section className="container-shell page-section">
        <div className="mx-auto max-w-md glass-card p-6 sm:p-8">
          <h1 className="heading-display text-4xl text-[#24151d]">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h1>
          <p className="mt-3 text-sm text-[#6f5160]">Login with email or continue with Google.</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === 'register' && (
              <input
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                className="w-full rounded-[18px] border border-[#f0dde5] px-4 py-3"
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              className="w-full rounded-[18px] border border-[#f0dde5] px-4 py-3"
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              className="w-full rounded-[18px] border border-[#f0dde5] px-4 py-3"
            />
            <button type="submit" className="btn-primary w-full">
              {mode === 'login' ? 'LOGIN' : 'REGISTER'}
            </button>
          </form>
          <button type="button" className="btn-secondary mt-3 w-full" onClick={loginWithGoogle}>
            CONTINUE WITH GOOGLE
          </button>
          <button
            type="button"
            className="mt-4 w-full text-sm text-[#6f5160]"
            onClick={() => setMode((current) => (current === 'login' ? 'register' : 'login'))}
          >
            {mode === 'login' ? 'Need an account? Register' : 'Already have an account? Login'}
          </button>
        </div>
      </section>
    </>
  )
}

export default AuthPage
