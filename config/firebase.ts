import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBzwslsNn2Zpo7lNFa6oXwUq7U-uVA-Jnk",
  authDomain: "campuspro-a516b.firebaseapp.com",
  projectId: "campuspro-a516b",
  storageBucket: "campuspro-a516b.firebasestorage.app",
  messagingSenderId: "783482001470",
  appId: "1:783482001470:web:7ee5ad5a9c3bbc4bb9d96f",
  measurementId: "G-9HVVQNENB6"
};

// Initialize Firebase app (avoid re-initialization)
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Initialize Firebase Authentication
// For Expo/React Native, we use getAuth() directly
const auth = getAuth(app);

// Initialize Firestore Database
const db = getFirestore(app);

export { app, auth, db };
