import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

export const firebaseConfig = {
  apiKey: "AIzaSyCM5MJZ1fzQO1l6w65qG8z8YOd86vK5uWE",
  authDomain: "dasashop-425.firebaseapp.com",
  projectId: "dasashop-425",
  storageBucket: "dasashop-425.firebasestorage.app",
  messagingSenderId: "533764033666",
  appId: "1:533764033666:web:296094578ca6e16149b89b",
  measurementId: "G-Y7NHMYZ13C"
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
