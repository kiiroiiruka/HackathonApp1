import { realtimeDb } from '@/firebase/firebaseConfig';
import { getDatabase, ref, push, set } from "firebase/database";
import { getKeybyStudentId } from "@/firebase/fetch/meDataset"; // 必要な関数をインポート

const db = getDatabase(); // Realtime Databaseの初期化


export const createChatroom= async (personA: string,personB: string) => {
  try {
    // Realtime Databaseの "chat/openchats" ノード
    const userAId = await getKeybyStudentId(personA);
    const userBId = await getKeybyStudentId(personB);

    if (!userAId || !userBId) {
      console.error('ユーザー情報が見つかりませんでした。');
      return null;
    }
    const openChatsRef = ref(db, "chat");

    // 新しいメッセージを作成
    const newMessageRef = push(openChatsRef); // 一意のキーを生成
    const chatroomId = newMessageRef.key; // 生成されたキーを取得
    console.log("新しいメッセージID:", chatroomId); // デバッグ用にログ出力
    // メッセージデータを保存
    await set(newMessageRef, {
      id: chatroomId,
      person:[userAId ,userBId],
      chat:[]
    });

    console.log("オープンチャットメッセージが作成されました:", chatroomId);
    return { success: true, chatroomId };
  } catch (error) {
    console.error("オープンチャットメッセージ作成エラー:", error);
    return { success: false, error };
  }
};
