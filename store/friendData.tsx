import { create } from 'zustand';

// ユーザー情報の型定義
type UserInfo = {
  uid: string;      // ユーザーID
  username: string; // ユーザー名
  location: string; // 場所
  message: string;  // メッセージ
  time: string;     // 時間
};

// Zustandストアの型定義
type UserStore = {
  users: UserInfo[];
  loadUsersFromData: (data: any[]) => void;
  updateUserInfo: (uid: string, username: string, location: string, time: string) => void;
};

// Zustandストア作成（初期値あり）
export const useFriendUserStore = create<UserStore>((set) => ({
  // 初期データ（5人分）
  users: [
    {
      uid: '1',
      username: 'たろう',
      location: '東京',
      message: 'やっほー！',
      time: '2025-04-17 10:00',
    },
    {
      uid: '2',
      username: 'じろう',
      location: '大阪',
      message: '今から出かけるよ',
      time: '2025-04-17 10:15',
    },
    {
      uid: '3',
      username: 'さぶろう',
      location: '北海道',
      message: '寒いけど元気！',
      time: '2025-04-17 10:30',
    },
    {
      uid: '4',
      username: 'しろう',
      location: '福岡',
      message: 'ラーメン最高🍜',
      time: '2025-04-17 10:45',
    },
    {
      uid: '5',
      username: 'ごろう',
      location: '沖縄',
      message: '海きれいだった！',
      time: '2025-04-17 11:00',
    },
  ],

  // 外部データからユーザーを読み込む関数
  loadUsersFromData: (data) => {
    const formatted = data.map((item) => ({
      uid: item.uid,
      username: item.username ?? '',
      location: item.location ?? '',
      message: item.message ?? '',
      time: item.time ?? '',
    }));
    set({ users: formatted });
  },

  // ユーザー情報を更新する関数
  updateUserInfo: (uid, username, location, time) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.uid === uid ? { ...user, username, location, time } : user
      ),
    })),
}));
