import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

/**
 * 自分のドキュメント（chatRead コレクション内）に、友達の ID をキーにしてメッセージ総数（count）を更新
 * @param userId 自分のユーザーID
 * @param count 設定するメッセージ総数
 */
export const setReadCount = async (
  userId: string,
  roomId: string,
  count: number,
) => {
  const targetDocRef = doc(db, "chatRead", userId); // chatRead コレクション内の自分のドキュメントを指し示す

  try {
    // ドキュメントが存在するかチェック
    const docSnapshot = await getDoc(targetDocRef);

    // ドキュメントが存在しない場合、新しく作成する
    if (!docSnapshot.exists()) {
      await setDoc(targetDocRef, {}); // 空のドキュメントを作成
    }

    // 自分のドキュメントに、友達のIDをキーにしてメッセージ総数を設定
    await setDoc(
      targetDocRef,
      {
        [`${roomId}`]: count, // 友達のIDをキーにしてcountを保持
      },
      { merge: true },
    ); // 既存のデータにマージする

    console.log(
      "count更新完了！（chatReadコレクション内に友達のメッセージ総数を保持）",
    );
  } catch (error) {
    console.error("countの更新エラー:", error);
  }
};
