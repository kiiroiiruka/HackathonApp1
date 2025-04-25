import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

/**
 * 特定の学籍番号を持つユーザーの friends リストを取得する関数
 * @param studentId - 対象ユーザーの学籍番号
 * @returns そのユーザーの friends 配列（なければ空配列）
 */
export const getFriendsByStudentId = async (
  studentId: string,
): Promise<string[] | false> => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("studentId", "==", studentId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.warn("指定された学籍番号のユーザーが見つかりませんでした。");
      return [];
    }

    const userData = snapshot.docs[0].data();
    const friends = userData.friends;

    // friends が存在していて、配列であることを確認
    if (Array.isArray(friends)) {
      return friends;
    } else {
      return [];
    }
  } catch (error) {
    console.error("friends リストの取得中にエラーが発生しました:", error);
    return false;
  }
};
