import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  setPersistence, 
  inMemoryPersistence 
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyD2QxCTsFTiW4H6vRFvh4kpBO9XHyzLtoQ",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "usepyramid.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "usepyramid",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "usepyramid.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "285580492378",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:285580492378:web:6d92d1a84c87df29d96263",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-WLNW89CCH8",
};

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);

// Use in-memory persistence to prevent Brave Shields / Safari IndexedDB storage lockouts
if (typeof window !== "undefined") {
  setPersistence(auth, inMemoryPersistence).catch((err) => {
    console.warn("Could not set inMemoryPersistence on Firebase Auth", err);
  });
}

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
