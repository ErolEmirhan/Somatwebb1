import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics, isSupported } from 'firebase/analytics'

/**
 * Web client config — bundle’da zaten görünür; Firestore kuralları + Firebase Console
 * “Authorized domains” ile korunur. Vercel’de .env gerekmez; yerel .env varsa env önceliklidir.
 */
const FIREBASE_DEFAULTS = {
  apiKey: 'AIzaSyB_sSvCgbWC4HYKufueqfoDmbBS4SHlUnA',
  authDomain: 'sultansomati-5a3e9.firebaseapp.com',
  projectId: 'sultansomati-5a3e9',
  storageBucket: 'sultansomati-5a3e9.firebasestorage.app',
  messagingSenderId: '166037373406',
  appId: '1:166037373406:web:ed1c3724085446ae0d1d4f',
  measurementId: 'G-SV23DHVNDG',
}

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY || FIREBASE_DEFAULTS.apiKey
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || FIREBASE_DEFAULTS.projectId

function getFirebaseApp() {
  if (!apiKey || !projectId) return null
  if (getApps().length > 0) return getApps()[0]
  return initializeApp({
    apiKey,
    authDomain:
      import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || FIREBASE_DEFAULTS.authDomain,
    projectId,
    storageBucket:
      import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || FIREBASE_DEFAULTS.storageBucket,
    messagingSenderId:
      import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
      FIREBASE_DEFAULTS.messagingSenderId,
    appId: import.meta.env.VITE_FIREBASE_APP_ID || FIREBASE_DEFAULTS.appId,
    measurementId:
      import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ||
      FIREBASE_DEFAULTS.measurementId ||
      undefined,
  })
}

const app = getFirebaseApp()

export const db = app ? getFirestore(app) : null

export { app }

export function isFirebaseConfigured() {
  return Boolean(db)
}

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
