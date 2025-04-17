import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";



export const meDataUpdate = async (userId: string, location:string,message:string,status:string) => {
  try {
    // Firestoreのユーザードキュメントへの参照を取得
    const userDocRef = doc(db, "users", userId);

    // ドキュメントを更新
    await updateDoc(userDocRef,{location:location,message:message,status:status});

    return { success: true };
  } catch (error) {
    console.error("ユーザーデータの更新中にエラーが発生しました:", error);
    return { success: false, error };
  }
};