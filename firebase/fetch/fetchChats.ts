import { realtimeDb } from "../firebaseConfig";
import { ref, get, onValue } from "firebase/database";

export const subscribeToChats = (
  chatSpaceId: string,
  callback: (chats: any[]) => void,
) => {
  try {
    // 参照するノードを決定
    const chatsRef = ref(realtimeDb, `chat/${chatSpaceId}/chats`);

    // リアルタイムリスナーを設定
    const unsubscribe = onValue(chatsRef, (snapshot) => {
      if (snapshot.exists()) {
        const chats = snapshot.val() || []; // チャットメッセージのリストを取得
        console.log("リアルタイムでチャットを取得:", chats);
        const chatArray = Object.values(chats);
        callback(chatArray); // コールバック関数を呼び出してデータを渡す
      } else {
        console.log("チャットが存在しません");
        callback([]); // 空の配列を渡す
      }
    });

    // リスナー解除関数を返す
    return unsubscribe;
  } catch (error) {
    console.error("リアルタイムチャットの取得中にエラーが発生しました:", error);
    throw error;
  }
};
