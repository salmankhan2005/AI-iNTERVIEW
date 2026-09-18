import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForSafeInit12345",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ai-interview.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ai-interview",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ai-interview.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef12345",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
