import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

/**
 * ユーザーのメールアドレスに基づいて、username を更新する関数
 * @param email 更新したいユーザーのメールアドレス
 * @param newUsername 新しく設定したいユーザー名
 */
export const updateUsernameByEmail = async (
  email: string,
  newUsername: string
) => {
  try {
    const usersRef = collection(db, "users");

    // メールアドレスでユーザーを検索
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.warn("指定されたメールアドレスのユーザーが見つかりませんでした。");
      return false;
    }

    // 一致するユーザーに対して username を更新
    for (const doc of querySnapshot.docs) {
      await updateDoc(doc.ref, { username: newUsername });
      console.log(`ユーザー ${doc.id} の username を更新しました。`);
    }

    return true;
  } catch (error) {
    console.error("エラーが発生しました:", error);
    return false;
  }
};