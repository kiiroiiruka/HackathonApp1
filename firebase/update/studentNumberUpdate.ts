import { collection, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

// 学籍番号の末尾を更新する関数
export const updateFriendsWithNewStudentId = async (
  newStudentId: string // 新しい学籍番号
) => {
  try {
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);

    if (snapshot.empty) {
      console.warn("ユーザーが見つかりませんでした。");
      return;
    }

    // ✅ 最後の "--" より後ろの文字列を取得
    const lastDoubleHyphenIndex = newStudentId.lastIndexOf("--");
    const newUidSuffix = lastDoubleHyphenIndex !== -1
      ? newStudentId.slice(lastDoubleHyphenIndex + 2)
      : "";

    snapshot.forEach(async (userDoc) => {
      const userData = userDoc.data();
      const userFriends = userData.friends || [];
      const userStudentId = userData.studentId || "";

      // ✅ friends の末尾部分と比較・更新
      const updatedFriends = userFriends.map((friendId: string) => {
        const friendHyphenIndex = friendId.lastIndexOf("--");
        const friendSuffix = friendHyphenIndex !== -1 ? friendId.slice(friendHyphenIndex + 2) : "";

        return friendSuffix === newUidSuffix ? newStudentId : friendId;
      });

      // ✅ studentId の末尾部分もチェック
      const userHyphenIndex = userStudentId.lastIndexOf("--");
      const userStudentIdSuffix = userHyphenIndex !== -1
        ? userStudentId.slice(userHyphenIndex + 2)
        : "";

      const updatedStudentId = userStudentIdSuffix === newUidSuffix
        ? newStudentId
        : userStudentId;

      // ✅ 更新が必要かチェック
      const updateData: any = {};
      if (JSON.stringify(updatedFriends) !== JSON.stringify(userFriends)) {
        updateData.friends = updatedFriends;
      }
      if (updatedStudentId !== userStudentId) {
        updateData.studentId = updatedStudentId;
      }

      if (Object.keys(updateData).length > 0) {
        await updateDoc(userDoc.ref, updateData);
        console.log(`ユーザー ${userDoc.id} の情報を更新しました。`);
      }
    });

    console.log("全てのユーザーの情報が更新されました。");
    return true;
  } catch (error) {
    console.error("エラーが発生しました:", error);
    return false;
  }
};
