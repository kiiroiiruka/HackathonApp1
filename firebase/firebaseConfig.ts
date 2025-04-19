// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyCoD6rPY0PndhCSBazFEVvl1Tfh1B-ZCVc',
  authDomain: 'hackathonapp1-64ab3.firebaseapp.com',
  projectId: 'hackathonapp1-64ab3',
  storageBucket: 'hackathonapp1-64ab3.appspot.com',
  messagingSenderId: '838810716103',
  databaseURL: "https://hackathonapp1-64ab3-default-rtdb.asia-southeast1.firebasedatabase.app",
  appId: '1:838810716103:web:80652c4d36567052e03be2',
};

// Firebase 初期化
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const realtimeDb = getDatabase(app);
