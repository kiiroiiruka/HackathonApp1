import { getDatabase, ref, push, set } from "firebase/database";

const db = getDatabase(); // Realtime Databaseの初期化


export const createChatroom= async (personA: string,personB: string) => {
  try {
    // Realtime Databaseの "chat/openchats" ノードへの参照を取得
    const openChatsRef = ref(db, "chat");

    // 新しいメッセージを作成
    const newMessageRef = push(openChatsRef); // 一意のキーを生成
    const chatroomId = newMessageRef.key; // 生成されたキーを取得
    console.log("新しいメッセージID:", chatroomId); // デバッグ用にログ出力
    // メッセージデータを保存
    await set(newMessageRef, {
      id: chatroomId,
      person:[personA,personB],
      chat:[]
    });

    console.log("オープンチャットメッセージが作成されました:", chatroomId);
    return { success: true, chatroomId };
  } catch (error) {
    console.error("オープンチャットメッセージ作成エラー:", error);
    return { success: false, error };
  }
};