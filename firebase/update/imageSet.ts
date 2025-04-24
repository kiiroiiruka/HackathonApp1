import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';

// メールアドレスに基づいて profileImageUri を更新する
export const updateProfileImageUriByEmail = async (
  email: string,
  newImageUri: string
) => {
  try {
    // usersコレクションからemailフィールドが一致するドキュメントを検索
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.warn('指定されたメールアドレスのユーザーが見つかりませんでした。');
      return { success: false, error: 'ユーザーが存在しません。' };
    }

    // 該当ドキュメントを1件取得して更新
    const userDoc = querySnapshot.docs[0];
    await updateDoc(userDoc.ref, {
      profileImageUri: newImageUri,
    });

    console.log('Profile image URI updated successfully');
    return { success: true };
  } catch (error) {
    console.error('プロフィール画像の更新中にエラーが発生しました:', error);
    return { success: false, error };
  }
};
