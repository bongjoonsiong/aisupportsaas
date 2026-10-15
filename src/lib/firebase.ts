import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfigData from '../../firebase-applet-config.json';

const metaEnv = (import.meta as any)?.env || {};

const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || (firebaseConfigData as any)?.apiKey || '',
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || (firebaseConfigData as any)?.authDomain || '',
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || (firebaseConfigData as any)?.projectId || '',
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || (firebaseConfigData as any)?.storageBucket || '',
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || (firebaseConfigData as any)?.messagingSenderId || '',
  appId: metaEnv.VITE_FIREBASE_APP_ID || (firebaseConfigData as any)?.appId || '',
};

const databaseId = metaEnv.VITE_FIRESTORE_DATABASE_ID || (firebaseConfigData as any)?.firestoreDatabaseId || undefined;


// Initialize Firebase safely
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app, databaseId);
export const auth = getAuth(app);


