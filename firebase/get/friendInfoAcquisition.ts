import { db } from '@/firebase/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useFriendUserStore } from '@/store/friendData';

export const fetchFriendsFromStudentIdArray = async (email: string) => {
  try {
    // 自分のユーザードキュメントを取得（メールアドレスから）
    const userQuery = query(collection(db, 'users'), where('email', '==', email));
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
      console.warn('該当ユーザーが見つかりませんでした');
      return;
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();

    const friendStudentIds: string[] = userData.friends ?? [];

    if (!Array.isArray(friendStudentIds) || friendStudentIds.length === 0) {
      console.warn('friends配列が空です');
      useFriendUserStore.getState().loadUsersFromData([]); // ← Zustandのusersを空にする
      return;
    }

    // friends配列に入っている学籍番号に基づいて、他ユーザーの情報を取得
    const allUsersQuery = query(collection(db, 'users'));
    const allUsersSnapshot = await getDocs(allUsersQuery);

    const friendUsers = allUsersSnapshot.docs
      .filter((doc) => {
        const data = doc.data();
        return friendStudentIds.includes(data.studentId);
      })
      .map((doc) => {
        const data = doc.data();
        return {
          uid:data.studentId,
          username: data.username ?? '',
          location: data.location ?? '',
          message: data.message ?? '',
          time: data.status ?? '',
        };
      });

    // Zustand にセット
    const setFriendUserStore = useFriendUserStore.getState().loadUsersFromData;
    setFriendUserStore(friendUsers);
    console.log(friendUsers)

    console.log('学籍番号に対応する友達をZustandにセットしました');
    return true
  } catch (error) {
    console.error('友達の情報取得に失敗しました:', error);
    return false
  }
};
