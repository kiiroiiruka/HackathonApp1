import { getDatabase, ref, push, set } from "firebase/database";

const db = getDatabase(); // Realtime Databaseの初期化


export const createChat= async (message: string, createdBy: string) => {
  try {
    // Realtime Databaseの "chat/openchats" ノードへの参照を取得
    const openChatsRef = ref(db, "chat/openchats");

    // 新しいメッセージを作成
    const newMessageRef = push(openChatsRef); // 一意のキーを生成
    const messageId = newMessageRef.key; // 生成されたキーを取得

    // メッセージデータを保存
    await set(newMessageRef, {
      id: messageId,
      text: message,
      createdBy: createdBy,
      createdAt: Date.now(),
    });

    console.log("オープンチャットメッセージが作成されました:", messageId);
    return { success: true, messageId };
  } catch (error) {
    console.error("オープンチャットメッセージ作成エラー:", error);
    return { success: false, error };
  }
};