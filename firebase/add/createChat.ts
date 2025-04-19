import { getDatabase, ref, push, set } from "firebase/database";

const db = getDatabase(); // Realtime Databaseの初期化


export const createChat= async (message: string, createdBy: string,room:string|null) => {
  try {
    if (!room) {
      room="openchats"; // ルームIDがない場合はデフォルトのルームIDを使用
    }
    else {
      room=room+"/chats"; // ルームIDがある場合はそのまま使用
    }
    const openChatsRef = ref(db, `chat/${room}`); // ルームIDを使用して参照を取得
    console.log("openChatsRef:", openChatsRef); // デバッグ用にログ出力
    // 新しいメッセージを作成
    const newMessageRef = push(openChatsRef); // 一意のキーを生成
    const messageId = newMessageRef.key; // 生成されたキーを取得
    console.log("新しいメッセージID:", messageId); // デバッグ用にログ出力
    // メッセージデータを保存
    await set(newMessageRef, {
      id: messageId,
      text: message,
      createdBy: createdBy,
      createdAt: Date.now(),
    });

    console.log("メッセージが作成されました:", messageId);
    return { success: true, messageId };
  } catch (error) {
    console.error("オープンチャットメッセージ作成エラー:", error);
    return { success: false, error };
  }
};