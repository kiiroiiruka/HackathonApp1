import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

/**
 * 指定されたメールアドレスのユーザーの `friendOnlyOrEveryone` を更新する関数
 *
 * @param email 更新対象のユーザーのメールアドレス
 * @param value 設定するboolean値（true = friends only, false = everyone）
 * @returns 成功時: true / 失敗時: false
 */
export const updateFriendOnlySetting = async (
  email: string,
  value: boolean,
): Promise<boolean> => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.warn(`ユーザーが見つかりませんでした（email: ${email}）`);
      return false;
    }

    const userDoc = querySnapshot.docs[0];
    const userRef = userDoc.ref;

    await updateDoc(userRef, {
      friendOnlyOrEveryone: value,
    });

    console.log(
      `friendOnlyOrEveryone を ${value} に更新しました（email: ${email}）`,
    );
    return true;
  } catch (error) {
    console.error(
      `friendOnlyOrEveryone の更新に失敗しました（email: ${email}）:`,
      error,
    );
    return false;
  }
};
