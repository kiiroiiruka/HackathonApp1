// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database'; // Realtime Database用
import { 
  API_KEY, 
  AUTH_DOMAIN, 
  PROJECT_ID, 
  STORAGE_BUCKET, 
  MESSAGING_SENDER_ID, 
  APP_ID, 
  DATABASE_URL, 
  MEASUREMENT_ID 
} from '@env';

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  databaseURL: DATABASE_URL, // Realtime DatabaseのURL
  measurementId: MEASUREMENT_ID, // Google AnalyticsのMeasurement ID
};
console.log(DATABASE_URL);
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const realtimeDb = getDatabase(app); // Realtime Databaseのエクスポート
