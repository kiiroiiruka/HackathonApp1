import { db } from "@/firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useFriendUserStore } from "@/store/friendData";

export const fetchFriendsFromStudentIdArray = async (email: string) => {
  try {
    // メールアドレスでユーザーを検索
    const userQuery = query(
      collection(db, "users"),
      where("email", "==", email),
    );
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
      console.warn("該当ユーザーが見つかりませんでした");
      return;
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();

    const friendStudentIds: string[] = userData.friends ?? [];

    if (friendStudentIds.length === 0) {
      console.warn("friends配列が空です");
      useFriendUserStore.getState().loadUsersFromData([]); // 空配列をZustandにセット
      return;
    }

    // 友達の学籍番号に基づいてユーザー情報を取得
    const allUsersQuery = query(collection(db, "users"));
    const allUsersSnapshot = await getDocs(allUsersQuery);

    const friendUsers = allUsersSnapshot.docs
      .filter((doc) => {
        const data = doc.data();
        return friendStudentIds.includes(data.studentId);
      })
      .map((doc) => {
        const data = doc.data();
        return {
          uid: data.studentId,
          username: data.username ?? "",
          location: data.location ?? "",
          message: data.message ?? "",
          time: data.status ?? "",
          profileImageUri: data.profileImageUri ?? "",
        };
      });
    // 恣意的な情報を追加
    const ShisaInfo = {
      uid: "Shisa",
      username: "AIだよー",
      location: "サーバ",
      message: "hello",
      time: "200",
      profileImageUri:
        "https://res.cloudinary.com/dy1ip2xgb/image/upload/v1745468781/media/pictures/images.jpg.jpg",
    };

    // friendUsersに追加情報を付加
    friendUsers.push(ShisaInfo);

    // Zustandにセット
    useFriendUserStore.getState().loadUsersFromData(friendUsers);
    console.log("友達情報をZustandにセットしました");
    return true;
  } catch (error) {
    console.error("友達の情報取得に失敗しました:", error);
    return false;
  }
};
