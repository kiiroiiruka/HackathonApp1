import { create } from "zustand";

export type UserInfo = {
  key: string; // 追加
  uid: string;
  username: string;
  location: string;
  message: string;
  time: string;
};

type UserInfoState = {
  userInfo: UserInfo;
  setUserInfo: (info: UserInfo) => void;
  updateKey: (key: string) => void; // 追加
  updateUsername: (username: string) => void;
  updateLocation: (location: string) => void;
  updateTime: (time: string) => void;
  updateMessage: (message: string) => void;
};

export const useMeInfoStore = create<UserInfoState>((set) => ({
  userInfo: {
    key: "", // 初期値を追加
    uid: "",
    username: "",
    location: "",
    message: "",
    time: "",
  },
  setUserInfo: (info) => set({ userInfo: info }),
  updateKey: (key) =>
    set((state) => ({ userInfo: { ...state.userInfo, key } })), // 追加
  updateUsername: (username) =>
    set((state) => ({ userInfo: { ...state.userInfo, username } })),
  updateLocation: (location) =>
    set((state) => ({ userInfo: { ...state.userInfo, location } })),
  updateTime: (time) =>
    set((state) => ({ userInfo: { ...state.userInfo, time } })),
  updateMessage: (message) =>
    set((state) => ({ userInfo: { ...state.userInfo, message } })),
}));
