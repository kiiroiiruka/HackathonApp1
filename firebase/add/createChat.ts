import { realtimeDb } from '@/firebase/firebaseConfig';
import { getDatabase, ref, push, set,get } from "firebase/database";
import {generateTextWithShisa } from '@/ai/Shisa'; // Shisaの生成関数をインポート


export const createChat= async (message: string, createdBy: string,room:string) => {
  try {
    const openChatsRef = ref(realtimeDb, `chat/${room}/chats`); // ルームIDを使用して参照を取得
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
    
    // person配列にShisaが含まれているか確認
    if (await IsIncludeShisa(room)) {
      console.log("Shisaがルームに含まれています。特別な処理を実行します。");
      const shisaMessege=await generateTextWithShisa(message); 
      const newMessageRefforAI = push(openChatsRef); // 一意のキーを生成
      const messageIdforAI = newMessageRefforAI.key; // 生成されたキーを取得
      console.log("新しいメッセージID:", messageIdforAI); // デバッグ用にログ出力
      // メッセージデータを保存
      await set(newMessageRefforAI, {
        id: messageIdforAI,
        text: shisaMessege,
        createdBy:"Shisa",
        createdAt: Date.now(),
      });
    }
    return { success: true, messageId };
  } catch (error) {
    console.error("オープンチャットメッセージ作成エラー:", error);
    return { success: false, error };
  }
};

function IsIncludeShisa(room: string): Promise<boolean> {
  const roomRef = ref(realtimeDb, `chat/${room}/person`);
  return get(roomRef)
    .then((snapshot) => {
      const personArray = snapshot.val() || [];
      return personArray.includes("Shisa");
    })
    .catch((error) => {
      console.error("Error checking if Shisa is included:", error);
      return false;
    });
}
