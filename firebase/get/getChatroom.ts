import { realtimeDb } from '@/firebase/firebaseConfig'; // FirebaseのRealtime Databaseをインポート
import { getDatabase, ref, get } from 'firebase/database';
import { getKeybyStudentId } from '@/firebase/fetch/meDataset'; // 必要な関数をインポート

type Chatroom = {
  id: string; // チャットルームのID
  person: string[]; // チャットルームに参加しているユーザーのリスト
  chat: any[]; // チャットメッセージのリスト（型を詳細に定義する場合は適宜変更）
};

const getAllChatrooms = async () => {
  try {
    const db = getDatabase(); // Realtime Databaseのインスタンスを取得
    const chatroomsRef = ref(db, 'chat'); // "chatrooms"ノードを参照

    const snapshot = await get(chatroomsRef); // 全データを取得
    console.log('取得したスナップショット:', snapshot); // デバッグ用にログ出力
    if (snapshot.exists()) {
      return snapshot.val(); // すべてのチャットルームデータを返す
    } else {
      console.log('チャットルームが存在しません。');
      return null;
    }
  } catch (error) {
    console.error('チャットルームの取得中にエラーが発生しました:', error);
    throw error;
  }
};

export const getChatroomByPersons = async (
  studentIdA: string,
  studentIdB: string
): Promise<Chatroom | null> => {
  try {
    // Firestoreからユーザー情報を取得
    const userAId = await getKeybyStudentId(studentIdA);
    const userBId = await getKeybyStudentId(studentIdB);

    if (!userAId || !userBId) {
      console.error('ユーザー情報が見つかりませんでした。');
      return null;
    }

    console.log('取得したユーザー情報:', { userAId, userBId });

    const chatrooms = await getAllChatrooms(); // すべてのチャットルームを取得
    console.log('取得したチャットルーム:', chatrooms); // デバッグ用にログ出力

    if (chatrooms) {
      // 条件に一致するチャットルームを検索
      const matchingRoom = Object.values(chatrooms).find((room: any) => {
        const persons = room.person || [];
        return (
          persons.includes(userAId) &&
          persons.includes(userBId) &&
          persons.length === 2 // 必要に応じて人数をチェック
        );
      });

      if (matchingRoom) {
        console.log('条件に一致するチャットルーム:', matchingRoom);
        return matchingRoom as Chatroom; // 型アサーションを使用
      } else {
        console.log('条件に一致するチャットルームが見つかりませんでした。');
        return null;
      }
    } else {
      console.log('チャットルームが存在しません。');
      return null;
    }
  } catch (error) {
    console.error('条件検索中にエラーが発生しました:', error);
    throw error;
  }
};