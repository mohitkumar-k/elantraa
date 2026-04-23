import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { AuthContext } from './auth-context'
import { auth, googleProvider, isFirebaseConfigured } from '../firebase/config'
import { getUserProfile, upsertUserProfile } from '../firebase/services'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(Boolean(isFirebaseConfigured && auth))

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) return

    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser)
      if (nextUser) {
        const existing = await getUserProfile(nextUser.uid)
        setProfile(existing)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      isAdmin:
        user?.email &&
        user.email.toLowerCase() === (import.meta.env.VITE_ADMIN_EMAIL || '').toLowerCase(),
      async login(email, password) {
        if (!auth) {
          toast.error('Add Firebase env keys to enable login.')
          return
        }
        await signInWithEmailAndPassword(auth, email, password)
        toast.success('Welcome back to ELANTRAA')
      },
      async register(name, email, password) {
        if (!auth) {
          toast.error('Add Firebase env keys to enable registration.')
          return
        }
        const result = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(result.user, { displayName: name })
        await upsertUserProfile(result.user.uid, { name, email, wishlist: [] })
        toast.success('Your account is ready')
      },
      async loginWithGoogle() {
        if (!auth) {
          toast.error('Add Firebase env keys to enable Google sign in.')
          return
        }
        const result = await signInWithPopup(auth, googleProvider)
        await upsertUserProfile(result.user.uid, {
          name: result.user.displayName,
          email: result.user.email,
        })
        toast.success('Signed in with Google')
      },
      async logout() {
        if (!auth) return
        await signOut(auth)
      },
      async saveProfile(data) {
        if (!user) return
        await upsertUserProfile(user.uid, data)
        setProfile((current) => ({ ...current, ...data }))
        toast.success('Profile updated')
      },
    }),
    [loading, profile, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
