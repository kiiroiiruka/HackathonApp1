import { getDatabase, ref, get, child } from "firebase/database";

const db = getDatabase(); // Realtime Databaseの初期化

/**
 * チャット一覧を取得する関数
 * @param chatSpaceId - チャットスペースのID（nullの場合はオープンスペースを取得）
 * @returns チャット一覧
 */
export const getChats = async (chatSpaceId: string | null) => {
  try {
    // 参照するノードを決定
    const chatsRef = chatSpaceId
      ? ref(db, `chat/${chatSpaceId}`)
      : ref(db, "chat/openchats");

    // データを取得
    const snapshot = await get(chatsRef);

    if (snapshot.exists()) {
      const chats = snapshot.val();
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