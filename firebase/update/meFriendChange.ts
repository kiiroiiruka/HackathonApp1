import { collection, query, where, getDocs, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../firebaseConfig";

// 自分の友達リストを更新する関数
export const updateFriendsOfUser = async (
  myStudentId: string,        // 自分の学籍番号
  targetStudentId: string,    // 追加・削除したい友達の学籍番号
  shouldAdd: boolean          // trueなら追加、falseなら削除
) => {
  try {
    // ユーザーコレクションの参照
    const usersRef = collection(db, "users");

    // 自分の学籍番号で検索
    const q = query(usersRef, where("studentId", "==", myStudentId));
    const snapshot = await getDocs(q);

    // 自分のデータが見つからない場合
    if (snapshot.empty) {
      console.warn("指定された学籍番号のユーザーが見つかりませんでした。");
      return;
    }

    // 自分のユーザードキュメント
    const userDoc = snapshot.docs[0];

    // 自分のfriends配列を更新
    await updateDoc(userDoc.ref, {
      friends: shouldAdd ? arrayUnion(targetStudentId) : arrayRemove(targetStudentId),
    });

    console.log(`友達リストが${shouldAdd ? "追加" : "削除"}されました。`);
    return true
  } catch (error) {
    console.error("friends 更新エラー:", error);
    return false
  }
};
