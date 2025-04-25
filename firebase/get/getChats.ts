import { realtimeDb } from "../firebaseConfig";
import { ref, get } from "firebase/database";

export const getChats = async (chatSpaceId: string) => {
  try {
    // 参照するノードを決定
    const chatsRef = ref(realtimeDb, `chat/${chatSpaceId}`);
    console.log("chatsRef:", chatSpaceId); // デバッグ用にログ出力
    // データを取得
    const snapshot = await get(chatsRef);

    if (snapshot.exists()) {
      const chats = snapshot.val().chats || []; // チャットメッセージのリストを取得
      console.log("チャット一覧を取得しました:", chats);
      return chats;
    } else {
      console.log("チャットが存在しません");
      return null;
    }
  } catch (error) {
    console.error("チャット一覧の取得中にエラーが発生しました:", error);
    throw error;
  }
};
