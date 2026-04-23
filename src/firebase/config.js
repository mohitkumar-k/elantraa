import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const firebaseEnvStatus = {
  apiKey: Boolean(firebaseConfig.apiKey),
  authDomain: Boolean(firebaseConfig.authDomain),
  projectId: Boolean(firebaseConfig.projectId),
  storageBucket: Boolean(firebaseConfig.storageBucket),
  messagingSenderId: Boolean(firebaseConfig.messagingSenderId),
  appId: Boolean(firebaseConfig.appId),
}

export const missingFirebaseEnvKeys = Object.entries(firebaseEnvStatus)
  .filter(([, exists]) => !exists)
  .map(([key]) => `VITE_FIREBASE_${key.replace(/[A-Z]/g, (match) => `_${match}`).toUpperCase()}`)

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId,
)

const app = isFirebaseConfigured
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : null

export const auth = app ? getAuth(app) : null
export const db = app ? getFirestore(app) : null
export const storage = app ? getStorage(app) : null
export const googleProvider = new GoogleAuthProvider()
