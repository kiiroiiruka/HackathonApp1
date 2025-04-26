import { ref, get } from "firebase/database"; // getをインポート
import { realtimeDb } from "@/firebase/firebaseConfig";
import { getKeybyStudentId } from "@/firebase/fetch/meDataset"; // 学籍番号からkeyを取得する関数をインポート

export const getlocationbyStdudentId = async function (StdudentId: string) {
  try {
    const key = await getKeybyStudentId(StdudentId);
    const locationRef = ref(realtimeDb, `locations/${key}`);
    const snapshot = await get(locationRef);

    if (snapshot.exists()) {
      console.log("位置情報取得成功", snapshot.val());
      return snapshot.val(); // 位置情報を返す
    } else {
      console.warn("指定された学籍番号の位置情報が見つかりません。");
      return null;
    }
  } catch (error) {
    console.error("位置情報の取得中にエラーが発生しました:", error);
    throw error;
  }
};
