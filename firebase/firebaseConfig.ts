// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
console.log('2EXPO_PUBLIC_FIREBASE_API_KEY:', process.env.EXPO_PUBLIC_FIREBASE_API_KEY);
console.log('2EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN:', process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN);
console.log('2EXPO_PUBLIC_FIREBASE_PROJECT_ID:', process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID);
console.log('2EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET:', process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET);
console.log('2EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:', process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID);
console.log('2EXPO_PUBLIC_FIREBASE_APP_ID:', process.env.EXPO_PUBLIC_FIREBASE_APP_ID);
const firebaseConfig = {
  apiKey: 'AIzaSyCoD6rPY0PndhCSBazFEVvl1Tfh1B-ZCVc',
  authDomain: 'hackathonapp1-64ab3.firebaseapp.com',
  projectId: 'hackathonapp1-64ab3',
  storageBucket: 'hackathonapp1-64ab3.appspot.com',
  messagingSenderId: '838810716103',
  appId: '1:838810716103:web:80652c4d36567052e03be2',
};

// Firebase 初期化
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const realtimeDb = getDatabase(app);
