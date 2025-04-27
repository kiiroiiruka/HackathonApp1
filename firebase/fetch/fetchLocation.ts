import { ref, set } from "firebase/database";
import { realtimeDb } from "@/firebase/firebaseConfig";
import * as Location from "expo-location"; // expo-locationをインポート
export const updateLocation = async function (
  userKey: string,
  location: Location.LocationObject,
) {
  if(!userKey) {
    console.warn("無効なユーザーキーが提供されました。位置情報の更新をスキップします。");    return;
  }
  const coords = location.coords;
  const locationRef = ref(realtimeDb, `locations/${userKey}`);
  await set(locationRef, coords);
};
