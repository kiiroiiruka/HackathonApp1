import { db } from '@/firebase/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useMeInfoStore } from '@/store/meData';

export const fetchUserInfoAndSetbyEmail = async (email: string) => {
  try {
    const userQuery = query(collection(db, 'users'), where('email', '==', email));
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
      console.warn('指定されたメールアドレスのユーザーが見つかりません');
      return;
    }

    const userDoc = userSnapshot.docs[0];
    const data = userDoc.data();

    // 状態にセットする用のUserInfo型オブジェクトを作成
    const userInfo = {
      key: userDoc.id, // ドキュメントIDをkeyとして使用
      uid: data.studentId, // ドキュメントIDをuidとして使用
      username: data.username ?? '',
      location: data.location ?? '',
      message: data.message ?? '',
      time: data.time ?? '',
    };

    // Zustand ストアにセット
    useMeInfoStore.getState().setUserInfo(userInfo);
    console.log('Zustandストアにユーザー情報をセットしました');

  } catch (error) {
    console.error('ユーザー情報の取得に失敗しました:', error);
    return false
  }
};

export const getKeybyStudentId = async (studentId: string) => {
  try {
    const userQuery = query(collection(db, 'users'), where('studentId', '==', studentId));
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
      console.warn('指定されたメールアドレスのユーザーが見つかりません');
      return;
    }

    const userDoc = userSnapshot.docs[0];
    const data = userDoc.data();
    return userDoc.id; // ドキュメントIDをkeyとして使用

  } catch (error) {
    console.error('ユーザー情報の取得に失敗しました:', error);
    return false
  }
};
