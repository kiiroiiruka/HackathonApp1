import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Firestoreの初期化済みインスタンス

// メールアドレスから学籍番号を取得する関数
export const getStudentIdByEmail = async (email: string): Promise<string | null> => {
  try {
    const q = query(collection(db, 'users'), where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.warn('該当するユーザーが見つかりませんでした');
      return null;
    }

    const userDoc = querySnapshot.docs[0];
    const data = userDoc.data();

    return data.studentId ?? null;
  } catch (error) {
    console.error('学籍番号の取得に失敗しました:', error);
    return null;
  }
};
