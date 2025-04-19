import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

/**
 * Firestore の users コレクションから全ユーザーの学籍番号（studentId）を取得する
 * @returns studentId の配列
 */
export const getAllStudentIds = async (): Promise<string[]|false> => {
  try {
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);

    const studentIds: string[] = snapshot.docs
      .map((doc) => doc.data()?.studentId)
      .filter((id): id is string => typeof id === 'string'); // 型安全に絞る

    return studentIds;
  } catch (error) {
    console.error("学籍番号の取得中にエラーが発生しました:", error);
    return false
  }
};
