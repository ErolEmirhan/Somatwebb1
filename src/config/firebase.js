import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics, isSupported } from 'firebase/analytics'

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID

function getFirebaseApp() {
  if (!apiKey || !projectId) return null
  if (getApps().length > 0) return getApps()[0]
  return initializeApp({
    apiKey,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || undefined,
  })
}

const app = getFirebaseApp()

/** Firestore; .env eksikse null */
export const db = app ? getFirestore(app) : null

export { app }

export function isFirebaseConfigured() {
  return Boolean(db)
}

/** Tarayıcıda Analytics (measurementId .env’de olmalı) */
export async function initFirebaseAnalytics() {
  if (!app || typeof window === 'undefined') return
  const ok = await isSupported().catch(() => false)
  if (!ok) return
  try {
    getAnalytics(app)
  } catch {
    /* zaten başlatılmış olabilir */
  }
}
