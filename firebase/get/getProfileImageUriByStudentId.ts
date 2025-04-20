import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig'; // Firebaseの設定ファイル

export const getProfileImageUriByStudentId = async (studentId: string): Promise<string | null> => {
  // 'users' コレクションの参照を作成
  const usersRef = collection(db, 'users');
  
  // studentId でフィルタリングするクエリを作成
  const q = query(usersRef, where('studentId', '==', studentId));
  
  // クエリを実行してユーザーを検索
  const querySnapshot = await getDocs(q);
  
  // もし該当するユーザーが存在すれば、profileImageUriを取得
  if (!querySnapshot.empty) {
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    return userData.profileImageUri || null; // プロフィール画像URIがあれば返す
  } else {
    // 一致するユーザーがいなければ null を返す
    return null;
  }
};
