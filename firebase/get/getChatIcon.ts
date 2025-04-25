import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// 戻り値の型を定義（オプションだけどおすすめ）
type UserProfile = {
  profileImageUri?: string;
  username?: string;
};

export const getUserInfoByDocId = async (documentId: string): Promise<UserProfile | undefined | false> => {
  try {
    const userDocRef = doc(db, 'users', documentId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      console.warn('指定されたユーザーは存在しません');
      return;
    }

    const data = userDocSnap.data();
    return {
      profileImageUri: data?.profileImageUri,
      username: data?.username,
    };

  } catch (error) {
    console.error('ユーザー情報の取得に失敗しました:', error);
    return false;
  }
};
