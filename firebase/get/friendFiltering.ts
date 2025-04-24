//この中には自分のIDが相手のfriendsリスト内に入っている、かつ、相手が
import { db } from '@/firebase/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

/**
 * 自分の studentId が、相手の公開設定や友達リストに基づいて許可されているかを判定する関数
 * 
 * @param myStudentId 自分の学籍番号
 * @param targetStudentId 相手の学籍番号
 * @returns boolean（true: アクセス可能, false: アクセス不可）
 */
export const canAccessUserData = async (myStudentId: string, targetStudentId: string): Promise<boolean> => {
  try {
    const userQuery = query(collection(db, 'users'), where('studentId', '==', targetStudentId));
    const snapshot = await getDocs(userQuery);

    if (snapshot.empty) {
      console.warn('対象ユーザーが見つかりませんでした');
      return false;
    }

    const targetUserData = snapshot.docs[0].data();

    const isPublic = targetUserData.friendOnlyOrEveryone; // trueなら「全員に公開」
    const friendList: string[] = targetUserData.friends ?? [];

    // 公開設定が「全員に公開」の場合はtrue
    if (isPublic === true) {
      return true;
    }

    // 公開設定が「友達のみ」で、かつ自分が友達リストに入っている場合
    if (isPublic === false && friendList.includes(myStudentId)) {
      return true;
    }

    // どちらにも当てはまらない場合はアクセス不可
    return false;

  } catch (error) {
    console.error('アクセス判定中にエラーが発生しました:', error);
    return false;
  }
};