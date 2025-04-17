import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

// 特定の studentId を持つユーザーの location, message, status を更新
export const meDataUpdateByStudentId = async (
  studentId: string,
  location: string,
  message: string,
  status: string
) => {
  try {
    // ユーザーコレクションを studentId で検索
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("studentId", "==", studentId)); // ←ここがポイント
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.warn("指定された学籍番号（studentId）のユーザーが見つかりませんでした。");
      return { success: false, error: "ユーザーが存在しません。" };
    }

    // 一致するドキュメントを更新（通常は1件の想定）
    const userDoc = querySnapshot.docs[0];
    await updateDoc(userDoc.ref, {
      location,
      message,
      status,
    });

    return { success: true };
  } catch (error) {
    console.error("ユーザーデータの更新中にエラーが発生しました:", error);
    return { success: false, error };
  }
};
