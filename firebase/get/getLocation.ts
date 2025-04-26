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

export const getlocationsbyKeys = async function (keys: string[]) {
  try {
    console.log("処理するキー:", keys); // デバッグ用にキーをログ出力
    const locations = await Promise.all(
      keys.map(async (key) => {
        try {
          if (!key) {
            console.warn("無効なキーが検出されました:", key);
            return null; // 無効なキーはスキップ
          }
          const locationRef = ref(realtimeDb, `locations/${key}`);
          const snapshot = await get(locationRef);

          if (snapshot.exists()) {
            console.log("位置情報取得成功22", snapshot.val());
            return { key, location: snapshot.val() }; // キーと位置情報を返す
          } else {
            console.warn(`キー ${key} の位置情報が見つかりません。`);
            return null;
          }
        } catch (error) {
          console.error(`キー ${key} の位置情報取得中にエラーが発生しました:`, error);
          return null; // エラーが発生した場合はnullを返す
        }
      })
    );
    console.log("取得した位置情報:", locations);
    return locations.filter((loc) => loc !== null); // 有効な位置情報のみ返す
  } catch (error) {
    console.error("複数の位置情報の取得中にエラーが発生しました:", error);
    throw error;
  }
};
