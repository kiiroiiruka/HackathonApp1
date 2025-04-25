import {
  getDocs,
  collection,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

/**
 * 二つの学籍番号のchatReadの値を比較し、差分を返す関数
 * @param myStudentNumber 自分の学籍番号
 * @param otherStudentNumber 相手の学籍番号
 * @returns 差分（0または正の整数）またはnull（エラー時）
 */
export const compareChatReadCounts = async (
  myStudentNumber: string,
  otherStudentNumber: string,
) => {
  try {
    // Step 1: 両者のユーザードキュメントIDを取得
    const usersRef = collection(db, "users");

    const myQuery = query(usersRef, where("studentId", "==", myStudentNumber));
    const otherQuery = query(
      usersRef,
      where("studentId", "==", otherStudentNumber),
    );

    const [mySnapshot, otherSnapshot] = await Promise.all([
      getDocs(myQuery),
      getDocs(otherQuery),
    ]);

    if (mySnapshot.empty || otherSnapshot.empty) {
      throw new Error("ユーザーが見つかりませんでした。");
    }

    const myUserDocId = mySnapshot.docs[0].id;
    const otherUserDocId = otherSnapshot.docs[0].id;

    // Step 2: chatRead データを取得
    const myChatReadRef = doc(db, "chatRead", myUserDocId);
    const otherChatReadRef = doc(db, "chatRead", otherUserDocId);

    const [myChatSnap, otherChatSnap] = await Promise.all([
      getDoc(myChatReadRef),
      getDoc(otherChatReadRef),
    ]);

    if (!myChatSnap.exists() || !otherChatSnap.exists()) {
      throw new Error("chatReadドキュメントが存在しません。");
    }

    const myData = myChatSnap.data();
    const otherData = otherChatSnap.data();

    // Step 3: 共通のチャットルームID（key）を取得
    const myKeys = Object.keys(myData);
    const otherKeys = Object.keys(otherData);
    const commonKeys = myKeys.filter((key) => otherKeys.includes(key));

    // Step 4: 最初に見つかった共通のIDに対して比較する（1つだけでOKなら）
    for (const chatId of commonKeys) {
      const myValue = myData[chatId];
      const otherValue = otherData[chatId];

      // 数値であることを確認
      if (typeof myValue === "number" && typeof otherValue === "number") {
        if (myValue === otherValue) return 0;
        if (myValue < otherValue) return otherValue - myValue;
        else return 0;
      }
    }

    // 共通のキーがなかった場合
    return null;
  } catch (error) {
    console.error("比較中にエラー:", error);
    return null;
  }
};
