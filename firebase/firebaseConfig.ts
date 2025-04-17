// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
//envファイルがうまくいかなかったため取りあえずここに直で書く。
const firebaseConfig = {
  apiKey: "AIzaSyCoD6rPY0PndhCSBazFEVvl1Tfh1B-ZCVc",
  authDomain: "hackathonapp1-64ab3.firebaseapp.com",
  projectId: "hackathonapp1-64ab3",
  storageBucket: "hackathonapp1-64ab3.appspot.com",
  messagingSenderId: "838810716103",
  appId: "1:838810716103:web:80652c4d36567052e03be2",
}

// Firebase 初期化
const app = initializeApp(firebaseConfig);

// 各サービスのインスタンスをエクスポート
export const auth = getAuth(app);
export const db = getFirestore(app);
