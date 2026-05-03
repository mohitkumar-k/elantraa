import { useState } from 'react'
import Seo from '../components/Seo'
import { useAuth } from '../hooks/useAuth'

function ProfilePage() {
  const { user, profile, saveProfile, logout } = useAuth()
  const [form, setForm] = useState({
    name: profile?.name || user?.displayName || '',
    phone: profile?.phone || '',
  })

  return (
    <>
      <Seo title="Profile" />
      <section className="container-shell page-section">
        <div className="mx-auto max-w-2xl glass-card p-6 sm:p-8">
          <h1 className="heading-display text-4xl text-ink">My Profile</h1>
          <p className="mt-3 text-sm text-muted">Manage account details and return or exchange requests.</p>
          <div className="mt-6 grid gap-4">
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Name"
              className="rounded-[16px] border border-line px-4 py-3 text-ink outline-none focus:border-brand"
            />
            <input
              type="text"
              value={user?.email || ''}
              disabled
              className="rounded-[16px] border border-line bg-surface px-4 py-3 text-muted"
            />
            <input
              type="text"
              value={form.phone}
              onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
              placeholder="Phone"
              className="rounded-[16px] border border-line px-4 py-3 text-ink outline-none focus:border-brand"
            />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" className="btn-primary" onClick={() => saveProfile(form)}>
              SAVE PROFILE
            </button>
            <button type="button" className="btn-secondary" onClick={logout}>
              LOGOUT
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

export default ProfilePage
