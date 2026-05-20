import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCFLfuGTp5_Hw1voZgitGfvnqhkuYPrUpU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "vantage-mine-hub.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://vantage-mine-hub-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "vantage-mine-hub",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "vantage-mine-hub.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "538561818249",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:538561818249:web:558469806ba20f19f2a058",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
