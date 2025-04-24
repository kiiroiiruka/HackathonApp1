import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

/**
 * 指定されたメールアドレスのユーザーの friendOnlyOrEveryone を取得する関数
 * 
 * @param email ユーザーのメールアドレス
 * @returns friendOnlyOrEveryone の値（boolean） or null（取得失敗時）
 */
export const getFriendOnlySetting = async (email: string): Promise<boolean | null> => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.warn(`ユーザーが見つかりませんでした（email: ${email}）`);
      return null;
    }

    const userData = querySnapshot.docs[0].data();
    const value = userData.friendOnlyOrEveryone;

    console.log(`取得成功：friendOnlyOrEveryone = ${value}（email: ${email}）`);

    return typeof value === 'boolean' ? value : false; // 想定外型対策
  } catch (error) {
    console.error(`friendOnlyOrEveryone の取得に失敗しました（email: ${email}）:`, error);
    return null;
  }
};
