import { realtimeDb } from "@/firebase/firebaseConfig"; // FirebaseのRealtime Databaseをインポート
import { ref, get } from "firebase/database";

export const isShisaInRoom = async (roomId: string): Promise<boolean> => {
  try {
    const roomRef = ref(realtimeDb, `chat/${roomId}/person`);
    const snapshot = await get(roomRef);
    if (snapshot.exists()) {
      const personList = snapshot.val() as string[]; // personのリストを取得
      return personList.includes("shisa"); // 'shisa'が含まれているかチェック
    } else {
      console.log("No data found for the specified room ID.");
      return false; // データが存在しない場合は false を返す
    }
  } catch (error) {
    console.error("Error checking Shisa in room:", error);
    return false; // エラーが発生した場合は false を返す
  }
};
