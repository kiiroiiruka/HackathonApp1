import { create } from "zustand";

// ユーザー情報の型定義
type UserInfo = {
  key: string; // ユーザーのキー（FirebaseのUIDなど）
  uid: string; // ユーザーID
  username: string; // ユーザー名
  location: string; // 場所
  message: string; // メッセージ
  time: string; // 時間
};

// Zustandストアの型定義
type UserStore = {
  users: UserInfo[];
  loadUsersFromData: (data: any[]) => void;
  updateUserInfo: (
    uid: string,
    username: string,
    location: string,
    time: string,
  ) => void;
};

// Zustandストア作成（初期値あり）
export const useFriendUserStore = create<UserStore>((set) => ({
  // 初期データ（5人分）
  users: [],

  // 外部データからユーザーを読み込む関数
  loadUsersFromData: (data) => {
    const formatted = data.map((item) => ({
      key: item.key, // itemのkeyをvalueのキーに設定
      uid: item.uid,
      username: item.username ?? "",
      location: item.location ?? "",
      message: item.message ?? "",
      time: item.time ?? "",
    }));
    set({ users: formatted });
  },

  // ユーザー情報を更新する関数
  updateUserInfo: (uid, username, location, time) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.uid === uid ? { ...user, username, location, time } : user,
      ),
    })),
}));
