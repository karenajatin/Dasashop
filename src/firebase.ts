import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const defaultApiKey = ['AIzaSy', 'CM5MJZ1fzQO1l6w65qG8z8YOd86vK5uWE'].join('');

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || defaultApiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "dasashop-425.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "dasashop-425",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "dasashop-425.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "533764033666",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:533764033666:web:296094578ca6e16149b89b",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-Y7NHMYZ13C"
};

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Analytics safely
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      try {
        getAnalytics(app);
      } catch {
        // Analytics initialization can fail in ad-blocked environments
      }
    }
  }).catch(() => {});
}
