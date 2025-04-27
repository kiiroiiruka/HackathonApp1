import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { deleteImage } from "../del/delmage"; // ←ファイルパスOK！

// メールアドレスに基づいて profileImageUri と imagePublicId を更新する
export const updateProfileImageAndPublicIdByEmail = async (
  email: string,
  newImageUri: string,
  newImagePublicId: string,
) => {
  try {
    // usersコレクションからemailフィールドが一致するドキュメントを検索
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.warn(
        "指定されたメールアドレスのユーザーが見つかりませんでした。",
      );
      return { success: false, error: "ユーザーが存在しません。" };
    }

    // 該当ドキュメントを取得
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    // すでに存在する imagePublicId を取得して、削除
    if (userData.imagePublicId) {
      try {
        await deleteImage(userData.imagePublicId);
        console.log("古い画像をCloudinaryから削除しました。");
      } catch (deleteError) {
        console.error("古い画像削除中にエラーが発生しました:", deleteError);
        // ここでreturnするかどうかはお好み（今回は削除失敗してもFirestore更新を続行）
      }
    }

    // Firestoreのデータを更新
    await updateDoc(userDoc.ref, {
      profileImageUri: newImageUri,
      imagePublicId: newImagePublicId,
    });

    console.log("Profile image URIとPublic IDをFirestoreに更新しました！");
    return { success: true };
  } catch (error) {
    console.error(
      "プロフィール画像とPublic IDの更新中にエラーが発生しました:",
      error,
    );
    return { success: false, error };
  }
};
