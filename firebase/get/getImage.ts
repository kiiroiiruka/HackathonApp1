import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig"; // Firebaseの設定ファイル

export const getProfileImageUriByEmail = async (
  email: string,
): Promise<string | null> => {
  // 'users' コレクションの参照を作成
  const usersRef = collection(db, "users");

  // メールアドレスでフィルタリングするクエリを作成
  const q = query(usersRef, where("email", "==", email));

  // クエリを実行してユーザーを検索
  const querySnapshot = await getDocs(q);

  // もし該当するユーザーが存在すれば、profileImageUriを取得
  if (!querySnapshot.empty) {
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    return userData.profileImageUri || null; // profileImageUriがあれば返し、無ければnullを返す
  } else {
    // メールアドレスに一致するユーザーがいない場合はnullを返す
    return null;
  }
};
