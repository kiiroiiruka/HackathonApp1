import { getDatabase, ref, get, child } from "firebase/database";

const db = getDatabase(); // Realtime Databaseの初期化

export const getChats = async (chatSpaceId: string) => {
  try {
    // 参照するノードを決定
    const chatsRef = ref(db, `chat/${chatSpaceId}`);

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